import { ComboSystem } from './ComboSystem';
import type { AbilityRecord, Combo } from '../types';

export class ComboManager {
  private comboSystem: ComboSystem;
  private _currentScore: number = 0;
  
  private comboListeners: Array<
    (combo: Combo, score: number, records: AbilityRecord[]) => void
  > = [];

  constructor(comboSystem: ComboSystem) {
    this.comboSystem = comboSystem;
  }

  /**
   * Проверяет историю и начисляет очки за комбо
   */
  public processAbilityHistory(abilityHistory: AbilityRecord[]): void {
    const { combo, matchedRecords } =
      this.comboSystem.checkCombos(abilityHistory);

    if (combo) {
      const currentTime = matchedRecords[matchedRecords.length - 1].timestamp;
      const score = this.comboSystem.onComboSuccess(combo, currentTime);

      this._currentScore += score;

      this.notifyComboListeners(combo, score, matchedRecords);

      console.log(`🎉 Комбо "${combo.name}"! +${score} очков`);
      console.log(`Цепочка: ${this.comboSystem.comboChain}`);
      console.log(`Всего очков: ${this.currentScore}`);
    }
  }

  public addComboListener(
    listener: (combo: Combo, score: number, records: AbilityRecord[]) => void
  ): void {
    this.comboListeners.push(listener);
  }

  public removeComboListener(listener: Function): void {
    this.comboListeners = this.comboListeners.filter((l) => l !== listener);
  }

  public reset(): void {
    this.comboSystem.resetComboChain();
    this._currentScore = 0;
  }

  public get currentScore(): number {
    return this._currentScore;
  }

  public get comboChain(): number {
    return this.comboSystem.comboChain;
  }

  public get allCombos(): Combo[] {
    return this.comboSystem.allCombos;
  }

  private notifyComboListeners(
    combo: Combo,
    score: number,
    records: AbilityRecord[]
  ): void {
    this.comboListeners.forEach((listener) => listener(combo, score, records));
  }
}
