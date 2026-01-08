import { ComboSystem } from './ComboSystem';
import type { AbilityRecord, Combo, ComboScorePayload } from '../types';

export class ComboManager {
  private comboSystem: ComboSystem;
  private _currentScore: number = 0;

  private comboListeners: Array<(payload: ComboScorePayload) => void> = [];

  constructor(comboSystem: ComboSystem) {
    this.comboSystem = comboSystem;
  }

  /**
   * Проверяет историю и начисляет очки за комбо
   */
  public processAbilityHistory(
    abilityHistory: AbilityRecord[],
    timestamp: number
  ): void {
    const { combo, matchedRecords } =
      this.comboSystem.checkCombos(abilityHistory);

    if (combo) {
      const currentTime = matchedRecords[matchedRecords.length - 1].timestamp;
      const points = this.comboSystem.onComboSuccess(combo, currentTime);

      this._currentScore += points;

      this.notifyComboListeners({
        combo,
        points,
        comboChain: this.comboChain,
        records: matchedRecords,
        timestamp,
      });
    }
  }

  public addComboListener(
    listener: (payload: ComboScorePayload) => void
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

  private notifyComboListeners(payload: ComboScorePayload): void {
    this.comboListeners.forEach((listener) => listener(payload));
  }
}
