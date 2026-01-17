import { ComboSystem } from './ComboSystem';
import type { AbilityRecord, Combo, ComboScorePayload } from '../types';

interface ComboListenerEntry {
  callback: (payload: ComboScorePayload) => void;
  context?: any;
}

export class ComboManager {
  private comboSystem: ComboSystem;
  private comboListeners: ComboListenerEntry[] = [];

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
    listener: (payload: ComboScorePayload) => void,
    context?: any
  ): void {
    this.comboListeners.push({ callback: listener, context });
  }

  public removeComboListener(listener: Function): void {
    this.comboListeners = this.comboListeners.filter(
      (entry) => entry.callback !== listener
    );
  }

  public destroy(): void {
    this.comboListeners.length = 0;
    this.comboSystem.resetComboChain();
  }

  public get comboChain(): number {
    return this.comboSystem.comboChain;
  }

  public get allCombos(): Combo[] {
    return this.comboSystem.allCombos;
  }

  private notifyComboListeners(payload: ComboScorePayload): void {
    this.comboListeners.forEach((entry) => {
      if (entry.context) {
        entry.callback.call(entry.context, payload);
      } else {
        entry.callback(payload);
      }
    });
  }
}
