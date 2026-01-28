import { Fragment } from 'react';
import type { FC } from 'react';
import { ModalContent } from '../ui';

interface Combo {
  name: string;
  steps: string[];
  multiplier: string;
  isMaster?: boolean;
}

const keyClasses =
  'px-2 py-1 m-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-xs text-cyan-300 shadow-[0_2px_0_rgba(6,182,212,0.3)]';

const listClasses = 'flex flex-col gap-2 text-sm text-cyan-100/80';

const COMBOS: Combo[] = [
  {
    name: 'T-Шаффл',
    steps: ['T(L)', 'T(R)', 'T(L)', 'T(R)'],
    multiplier: 'x1.1',
  },
  { name: 'Цепочка бега', steps: ['RM', 'RM', 'RM'], multiplier: 'x1.2' },
  { name: 'База', steps: ['RM', 'T(R)', 'RM'], multiplier: 'x1.3' },
  { name: 'Микс', steps: ['RM', 'T(L)', 'T(R)', 'RM'], multiplier: 'x1.8' },
  {
    name: 'Мастер',
    steps: ['RM', 'T(L)', 'RM', 'T(R)', 'T(L)', 'RM'],
    multiplier: 'x2.5',
    isMaster: true,
  },
];

const TutorialModalContent: FC = () => {
  return (
    <ModalContent>
      <h2 className="text-2xl md:text-3xl text-cyan-400 uppercase mb-4 text-center">
        Правила битвы
      </h2>

      <div className="grid grid-cols-1 gap-4 text-sm text-cyan-100/80">
        <article className="p-3 md:p-4 border border-cyan-500/20 bg-cyan-500/5">
          <span className="text-cyan-400 block mb-1 uppercase">
            01. Управление
          </span>
          <ul className={listClasses}>
            <li>
              Перемещение: стрелки или{' '}
              {['W', 'A', 'S', 'D'].map((key) => (
                <kbd key={key} className={keyClasses}>
                  {key}
                </kbd>
              ))}{' '}
              <span className="text-cyan-500/60">(Touch: джойстик)</span>
            </li>
            <li>
              <kbd className={keyClasses}>F</kbd> — Вкл/Выкл режим фиксации.
              Идеально для ювелирных шагов{' '}
              <span className="text-cyan-500/60">
                (Touch: кнопка в центре стрелок)
              </span>
            </li>
          </ul>
        </article>
        <article className="p-3 md:p-4 border border-blue-500/20 bg-blue-500/5">
          <span className="text-blue-400 block mb-1 uppercase">
            02. Спецприемы
          </span>
          <ul className={listClasses}>
            <li>
              Спецприемы работают только при{' '}
              <span className="text-purple-400">
                <span className="font-bold">удержании</span> клавиши направления
              </span>
            </li>
            <li>
              <kbd className={keyClasses}>R</kbd> — Базовый шаг Running Man{' '}
              <span className="text-cyan-500/60">(Touch: кнопка RM)</span>
            </li>
            <li>
              <kbd className={keyClasses}>T</kbd> /{' '}
              <kbd className={keyClasses}>Y</kbd> — Т-Step (левая / правая нога){' '}
              <span className="text-cyan-500/60">(Touch: кнопки T(L/R))</span>
            </li>
          </ul>
        </article>
        <article className="p-3 md:p-4 border border-violet-500/20 bg-violet-500/5">
          <span className="text-violet-400 block mb-1 uppercase">
            03. Правила связок
          </span>
          <ul className={listClasses}>
            <li>
              Соединяй движения в связки, чтобы взломать счетчик очков и
              активировать множители
            </li>
            <li>
              Смена вектора — ключ к успеху! Для активации комбо необходимо{' '}
              <span className="text-purple-400">изменить направление</span>{' '}
              движения{' '}
              <span className="text-purple-400">
                хотя бы <span className="font-bold">один раз</span>
              </span>{' '}
              внутри связки
            </li>
          </ul>
        </article>
        <article className="p-3 md:p-4 border border-fuchsia-500/20 bg-fuchsia-500/5">
          <span className="text-fuchsia-400 block mb-1 uppercase">
            04. Комбо-связки
          </span>
          <ul className={listClasses}>
            <li>
              <span className="text-cyan-300">RM</span> — Running Man,{' '}
              <span className="text-cyan-300">T(L/R)</span> — Т-Step (левая /
              правая нога)
            </li>
            {COMBOS.map((combo) => (
              <li key={combo.name}>
                <span
                  className={`${combo.isMaster ? 'text-yellow-400' : 'text-white'} font-bold`}
                >
                  {combo.name}:{' '}
                </span>
                {combo.steps.map((step, i) => (
                  <Fragment key={step + i}>
                    <span className="text-cyan-300">{step}</span>
                    {i < combo.steps.length - 1 && (
                      <span className="text-gray-500 text-xs mx-1">
                        ⮕{'\u200B'}
                      </span>
                    )}
                  </Fragment>
                ))}
                {'\u200B'}
                <span
                  className={`ml-2 ${combo.isMaster ? 'text-yellow-400 font-bold' : 'text-purple-400'} text-xs`}
                >
                  {combo.multiplier}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </ModalContent>
  );
};

TutorialModalContent.displayName = 'TutorialModalContent';

export default TutorialModalContent;
