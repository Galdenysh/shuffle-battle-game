import { Abilities } from '@/types';
import type { Combo } from '../entities';

// Для расчета timeLimit: RM - 800ms, TS - 400ms + 200ms

export const combos: Combo[] = [
  {
    id: 'basic_left',
    name: 'База влево',
    pattern: [
      Abilities.RUNNING_MAN,
      Abilities.T_STEP_LEFT,
      Abilities.RUNNING_MAN,
    ],
    baseScore: 150,
    difficulty: 2,
    timeLimit: 2200,
    multiplier: 1.2,
    description: 'Running Man → T-Step Left → Running Man',
  },
  {
    id: 'basic_right',
    name: 'База вправо',
    pattern: [
      Abilities.RUNNING_MAN,
      Abilities.T_STEP_RIGHT,
      Abilities.RUNNING_MAN,
    ],
    baseScore: 150,
    difficulty: 2,
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
    baseScore: 100,
    difficulty: 1,
    timeLimit: 1800,
    multiplier: 1.1,
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
