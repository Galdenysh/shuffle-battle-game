import { Abilities } from '@/types';
import type { AbilityRecord, Combo } from '../types';

export class ComboSystem {
  // Для расчета timeLimit: RM - 800ms, TS - 400ms + 200ms
  private combos: Combo[] = [
    {
      id: 'basic_triple_left',
      name: 'Тройка влево',
      pattern: [
        Abilities.RUNNING_MAN,
        Abilities.T_STEP_LEFT,
        Abilities.RUNNING_MAN,
      ],
      baseScore: 100,
      difficulty: 1,
      timeLimit: 2200,
      multiplier: 1.2,
      description: 'Running Man → T-Step Left → Running Man',
    },
    {
      id: 'basic_triple_right',
      name: 'Тройка вправо',
      pattern: [
        Abilities.RUNNING_MAN,
        Abilities.T_STEP_RIGHT,
        Abilities.RUNNING_MAN,
      ],
      baseScore: 100,
      difficulty: 1,
      timeLimit: 2200,
      multiplier: 1.2,
      description: 'Running Man → T-Step Right → Running Man',
    },
    {
      id: 't_shuffle',
      name: 'T-Шаффл',
      pattern: [
        Abilities.T_STEP_LEFT,
        Abilities.T_STEP_RIGHT,
        Abilities.T_STEP_LEFT,
        Abilities.T_STEP_RIGHT,
      ],
      baseScore: 150,
      difficulty: 2,
      timeLimit: 1800,
      multiplier: 1.5,
      description: 'Быстрые T-шаги влево-вправо',
    },
    {
      id: 'running_chain',
      name: 'Цепочка бега',
      pattern: [
        Abilities.RUNNING_MAN,
        Abilities.RUNNING_MAN,
        Abilities.RUNNING_MAN,
      ],
      baseScore: 120,
      difficulty: 1,
      timeLimit: 2600,
      multiplier: 1.3,
      description: 'Три Running Man подряд',
    },
    {
      id: 'mixed_combo',
      name: 'Микс',
      pattern: [
        Abilities.RUNNING_MAN,
        Abilities.T_STEP_LEFT,
        Abilities.T_STEP_RIGHT,
        Abilities.RUNNING_MAN,
      ],
      baseScore: 200,
      difficulty: 3,
      timeLimit: 2600,
      multiplier: 1.8,
      description: 'Смешанная комбинация',
    },
    {
      id: 'master_combo',
      name: 'Мастер',
      pattern: [
        Abilities.RUNNING_MAN,
        Abilities.T_STEP_LEFT,
        Abilities.RUNNING_MAN,
        Abilities.T_STEP_RIGHT,
        Abilities.T_STEP_LEFT,
        Abilities.RUNNING_MAN,
      ],
      baseScore: 500,
      difficulty: 5,
      timeLimit: 3800,
      multiplier: 2.5,
      description: 'Сложная продвинутая комбинация',
    },
  ];

  private comboChain: number = 0;
  private lastComboTime: number = 0;

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
    // Увеличиваем цепочку если комбо выполнены близко по времени
    const maxAllowedGapChain = 3000;

    if (currentTime - this.lastComboTime < maxAllowedGapChain) {
      this.comboChain++;
    } else {
      this.comboChain = 1;
    }

    this.lastComboTime = currentTime;

    const multiplier = combo.multiplier ? combo.multiplier - 1 : 0.2;
    const chainMultiplier = 1 + (this.comboChain - 1) * multiplier;
    const totalScore = Math.floor(combo.baseScore * chainMultiplier);

    return totalScore;
  }

  public resetComboChain(): void {
    this.comboChain = 0;
    this.lastComboTime = 0;
  }

  public getComboChain(): number {
    return this.comboChain;
  }

  public getAllCombos(): Combo[] {
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

    // Комбо успешно!
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
