
import type { FC, HTMLAttributes, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ErrorIcon from './ErrorIcon';

interface MenuInputProps extends HTMLAttributes<HTMLDivElement> {
  id?: string;
  label?: string;
  errorHint?: string;
  fullWidth?: boolean;
  placeholder?: InputHTMLAttributes<HTMLInputElement>['placeholder'];
  value?: InputHTMLAttributes<HTMLInputElement>['value'];
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

const inputClasses = {
  base: 'h-14 px-5 bg-black/60 border-2 text-cyan-100/90 font-mono text-base tracking-wider placeholder-cyan-400/50 transition-all duration-300',
  focus:
    'focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.4),inset_0_0_10px_rgba(0,255,255,0.1)]',
  error: 'border-red-500/70 shadow-[0_0_15px_rgba(255,0,0,0.3)]',
} as const;

const VALUE_MAX_LENGTH = 20;

export const MenuInput: FC<MenuInputProps> = (props) => {
  const {
    id,
    label,
    errorHint,
    fullWidth,
    placeholder,
    value,
    onChange,
    inputProps,
    ...other
  } = props;

  const { className: inputClassName, ...otherInputProps } = inputProps ?? {};

  return (
    <div {...other} className={cn(fullWidth ? 'w-full' : '', other?.className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'block text-lg font-mono mb-4 text-cyan-300/90 tracking-wider drop-shadow-[0_0_3px_rgba(0,255,255,0.5)]'
          )}
        >
          {label}
        </label>
      )}

      <div className={cn('flex flex-col')}>
        <input
          id={id}
          className={cn(
            inputClasses.base,
            errorHint ? inputClasses.error : 'border-cyan-500/50',
            inputClasses.focus,
            inputClassName
          )}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          maxLength={VALUE_MAX_LENGTH}
          aria-invalid={!!errorHint}
          aria-describedby={errorHint ? `${id}Error` : undefined}
          {...otherInputProps}
        />

        <div
          className={cn(
            'mt-3 flex gap-2 text-sm text-left',
            errorHint ? 'justify-between' : 'justify-end'
          )}
        >
          {errorHint && (
            <motion.span
              id={`${id}Error`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'flex items-center gap-2 text-red-400 font-mono tracking-wider drop-shadow-[0_0_3px_rgba(255,0,0,0.5)]'
              )}
            >
              <ErrorIcon />
              {errorHint}
            </motion.span>
          )}

          <div
            className={cn(
              'text-cyan-300/90 text-right font-mono tracking-wider drop-shadow-[0_0_3px_rgba(0,255,255,0.5)]'
            )}
          >
            {String(value)?.length}/{inputProps?.maxLength ?? VALUE_MAX_LENGTH}
          </div>
        </div>
      </div>
    </div>
  );
};

MenuInput.displayName = 'MenuInput';

export default MenuInput;
