import type { AbilityRecord, Combo } from '../types';

export class ComboSystem {
  private combos: Combo[];
  private maxAllowedGapChain: number;
  private _comboChain: number = 0;
  private lastComboTime: number | null = null;
  private lastComboId: string | null = null;

  constructor(
    combos: Combo[],
    config?: {
      maxAllowedGapChain?: number;
    }
  ) {
    this.combos = combos;
    this.maxAllowedGapChain = config?.maxAllowedGapChain ?? 1000;
  }

  /**
   * Проверяет историю способностей на наличие комбинаций
   * @param abilityHistory История выполненных способностей
   * @returns Найденное комбо или null
   */
  public checkCombos(abilityHistory: AbilityRecord[]): {
    combo: Combo | null;
    matchedRecords: AbilityRecord[];
  } {
    if (abilityHistory.length === 0) {
      return { combo: null, matchedRecords: [] };
    }

    for (const combo of this.combos) {
      const result = this.checkSingleCombo(abilityHistory, combo);
      if (result.success) {
        return {
          combo,
          matchedRecords: result.matchedRecords,
        };
      }
    }

    return { combo: null, matchedRecords: [] };
  }

  /**
   * Обновляет цепочку комбо после успешного выполнения
   */
  public onComboSuccess(combo: Combo, currentTime: number): number {
    if (currentTime < 0) return 0;

    if (this.lastComboTime === null) {
      this._comboChain = 1;
    } else {
      const timeSinceLastCombo =
        currentTime - combo.timeLimit - this.lastComboTime;

      const isSameCombo = this.lastComboId === combo.id;

      // Проверяем условия разрыва цепи:
      // 1. Превышен максимальный промежуток
      // 2. Повтор одного и того же комбо
      const isChainBroken =
        timeSinceLastCombo >= this.maxAllowedGapChain || isSameCombo;

      if (isChainBroken) {
        this._comboChain = 1;
      } else {
        this._comboChain++;
      }
    }

    this.lastComboTime = currentTime;
    this.lastComboId = combo.id;

    const multiplier = combo.multiplier ? combo.multiplier - 1 : 0;
    const chainMultiplier = 1 + (this._comboChain - 1) * multiplier;
    const totalScore = Math.floor(combo.baseScore * chainMultiplier);

    return totalScore;
  }

  public resetComboChain(): void {
    this._comboChain = 0;
    this.lastComboTime = null;
    this.lastComboId = null;
  }

  public get comboChain(): number {
    return this._comboChain;
  }

  public get allCombos(): Combo[] {
    return [...this.combos];
  }

  private checkSingleCombo(
    abilityHistory: AbilityRecord[],
    combo: Combo
  ): { success: boolean; matchedRecords: AbilityRecord[] } {
    if (abilityHistory.length < combo.pattern.length) {
      return { success: false, matchedRecords: [] };
    }

    const recentRecords = abilityHistory.slice(-combo.pattern.length);

    // 1. Проверяем соответствие паттерну
    for (let i = 0; i < combo.pattern.length; i++) {
      if (recentRecords[i].ability !== combo.pattern[i]) {
        return { success: false, matchedRecords: [] };
      }
    }

    // 2. Проверяем время выполнения
    const firstMoveTime = recentRecords[0].timestamp;
    const lastMoveTime = recentRecords[recentRecords.length - 1].timestamp;
    const totalTime = lastMoveTime - firstMoveTime;

    if (totalTime > combo.timeLimit) {
      return { success: false, matchedRecords: [] };
    }

    // 3. Проверяем максимальный промежуток между движениями
    const maxGap = this.getMaxGap(recentRecords);
    const maxAllowedGap = combo.timeLimit / 2; // Максимум половина времени комбо

    if (maxGap > maxAllowedGap) {
      return { success: false, matchedRecords: [] };
    }

    return { success: true, matchedRecords: recentRecords };
  }

  private getMaxGap(records: AbilityRecord[]): number {
    let maxGap = 0;

    for (let i = 1; i < records.length; i++) {
      const gap = records[i].timestamp - records[i - 1].timestamp;

      maxGap = Math.max(maxGap, gap);
    }

    return maxGap;
  }
}
