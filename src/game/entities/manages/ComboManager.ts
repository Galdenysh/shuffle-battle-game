import { ComboSystem } from './ComboSystem';
import type { AbilityRecord, Combo } from '../types';

export class ComboManager {
  private comboSystem: ComboSystem;
  private currentScore: number = 0;
  private comboListeners: Array<
    (combo: Combo, score: number, records: AbilityRecord[]) => void
  > = [];

  constructor() {
    this.comboSystem = new ComboSystem();
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

      this.currentScore += score;

      // Уведомляем слушателей
      this.notifyComboListeners(combo, score, matchedRecords);

      console.log(`🎉 Комбо "${combo.name}"! +${score} очков`);
      console.log(`Цепочка: ${this.comboSystem.getComboChain()}`);
      console.log(`Всего очков: ${this.getCurrentScore()}`);
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
    this.currentScore = 0;
  }

  public getCurrentScore(): number {
    return this.currentScore;
  }

  public getComboChain(): number {
    return this.comboSystem.getComboChain();
  }

  public getAllCombos(): Combo[] {
    return this.comboSystem.getAllCombos();
  }

  private notifyComboListeners(
    combo: Combo,
    score: number,
    records: AbilityRecord[]
  ): void {
    this.comboListeners.forEach((listener) => listener(combo, score, records));
  }
}
