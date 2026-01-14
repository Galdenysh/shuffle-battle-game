import React from 'react';
import type { FC } from 'react';
import { ModalContent } from '../ui';

const keyClasses =
  'px-2 py-1 m-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-xs text-cyan-300 shadow-[0_2px_0_rgba(6,182,212,0.3)]';

const listClasses = 'flex flex-col gap-2 text-sm text-cyan-100/80';

const TutorialModalContent: FC = () => {
  return (
    <ModalContent>
      <h2 className="text-2xl md:text-3xl text-cyan-400 font-mono uppercase mb-4 text-center">
        Правила битвы
      </h2>

      <div className="grid grid-cols-1 gap-4 font-mono text-sm text-cyan-100/80">
        <article className="p-4 border border-cyan-500/20 bg-cyan-500/5">
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
              <span className="text-cyan-500/60">
                (на мобильных — тач-панель)
              </span>
              .
            </li>
            <li>
              <kbd className={keyClasses}>F</kbd> — Вкл/Выкл режим перемещения{' '}
              <span className="text-cyan-500/60">(для точных степов)</span>.
            </li>
          </ul>
        </article>
        <article className="p-4 border border-blue-500/20 bg-blue-500/5">
          <span className="text-blue-400 block mb-1 uppercase">
            02. Спецприемы
          </span>
          <ul className={listClasses}>
            <li>
              Спецприемы (Running Man, T-Step) активны только{' '}
              <span className="text-purple-400">
                при удержании кнопки направления.
              </span>
            </li>
            <li>
              <kbd className={keyClasses}>R</kbd> — Базовый шаг Running Man.
            </li>
            <li>
              <kbd className={keyClasses}>T</kbd> /{' '}
              <kbd className={keyClasses}>Y</kbd> — Т-Step (левая / правая
              нога).
            </li>
          </ul>
        </article>
        <article className="p-4 border border-violet-500/20 bg-violet-500/5">
          <span className="text-violet-400 block mb-1 uppercase">
            03. Правила связок
          </span>
          <ul className={listClasses}>
            <li>
              Соединяй движения в связки, чтобы взломать счетчик очков и
              активировать множители.
            </li>
            <li>
              Смена вектора — ключ к успеху! Для активации комбо необходимо{' '}
              <span className="text-purple-400">изменить направление</span>{' '}
              движения хотя бы один раз внутри связки.
            </li>
          </ul>
        </article>
        <article className="p-4 border border-fuchsia-500/20 bg-fuchsia-500/5">
          <span className="text-fuchsia-400 block mb-1 uppercase">
            04. Комбо-связки
          </span>
          <ul className={listClasses}>
            <li>
              <span className="text-cyan-300">RM</span> — Running Man,{' '}
              <span className="text-cyan-300">T(L/R)</span> — Т-Step (левая /
              правая нога).
            </li>

            {/* T-Шаффл */}
            <li>
              <span className="text-white font-bold whitespace-nowrap">
                T-Шаффл:
              </span>{' '}
              <span className="text-cyan-300 font-mono">T(L)</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">T(R)</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">T(L)</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">T(R)</span>
              <span className="ml-2 text-purple-400 text-[10px]">x1.1</span>
            </li>

            {/* Цепочка бега */}
            <li>
              <span className="text-white font-bold whitespace-nowrap">
                Цепочка бега:
              </span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>
              <span className="ml-2 text-purple-400 text-[10px]">x1.2</span>
            </li>

            {/* База */}
            <li>
              <span className="text-white font-bold whitespace-nowrap">
                База:
              </span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">T(R)</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>
              <span className="ml-2 text-purple-400 text-[10px]">x1.3</span>
            </li>

            {/* Микс */}
            <li>
              <span className="text-white font-bold whitespace-nowrap">
                Микс:
              </span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">T(L)</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">T(R)</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>
              <span className="ml-2 text-purple-400 text-[10px]">x1.8</span>
            </li>

            {/* Мастер */}
            <li>
              <span className="text-yellow-400 font-bold whitespace-nowrap">
                Мастер:
              </span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">T(L)</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">T(R)</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">T(L)</span>{' '}
              <span className="text-gray-500 text-xs">→</span>{' '}
              <span className="text-cyan-300 font-mono">RM</span>
              <span className="ml-2 text-yellow-400 text-[10px] font-bold">
                x2.5
              </span>
            </li>
          </ul>
        </article>
      </div>
    </ModalContent>
  );
};

TutorialModalContent.displayName = 'TutorialModalContent';

export default TutorialModalContent;
