'use client';

import React, {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { FC, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useMounted, useOutsideClick } from '@/hooks';
import { createPortal } from 'react-dom';

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const Modal: FC<{ children: ReactNode }> = ({ children }) => {
  return <ModalProvider>{children}</ModalProvider>;
};

export const ModalTrigger: FC<{ children: ReactNode }> = ({ children }) => {
  const { setOpen } = useModal();

  const handleOpen = () => {
    setOpen(true);
  };

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const child = children as ReactElement<{
    onClick?: (e: MouseEvent) => void;
    onTouchStart?: (e: TouchEvent) => void;
  }>;

  // Клонируем элемент, добавляя ему необходимые пропсы
  return cloneElement(child, {
    onClick: (e: MouseEvent) => {
      handleOpen();

      child.props.onClick?.(e);
    },
    onTouchStart: (e: TouchEvent) => {
      handleOpen();

      child.props.onTouchStart?.(e);
    },
  });
};

export const ModalBody: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { open, setOpen } = useModal();
  const mounted = useMounted();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [open]);

  useOutsideClick(modalRef, () => setOpen(false));

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full flex items-center justify-center z-1000"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            backdropFilter: 'blur(10px)',
          }}
          exit={{
            opacity: 0,
            backdropFilter: 'blur(0px)',
          }}
        >
          <Overlay />

          <motion.div
            className={cn(
              'relative z-50',
              'flex flex-col flex-1  min-h-[50%] max-h-[90%] md:max-w-[40%]',
              'bg-gradient-to-br from-gray-900 via-black to-gray-900',
              'border-2 [border-image:linear-gradient(to_bottom_right,theme(colors.purple.500/0.3),theme(colors.cyan.500/0.3))_1]',
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 15,
            }}
            ref={modalRef}
          >
            <CloseButton />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const ModalContent: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col flex-1 p-4 md:p-5 overflow-scroll', className)}>
      {children}
    </div>
  );
};

export const ModalFooter: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('flex justify-end p-4 md:p-5', className)}>{children}</div>
  );
};

const Overlay: FC<{ className?: string }> = ({ className }) => {
  const { setOpen } = useModal();

  return (
    <motion.div
      className={cn(
        'fixed inset-0 h-full w-full bg-opacity-50 z-50',
        className
      )}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        backdropFilter: 'blur(10px)',
      }}
      exit={{
        opacity: 0,
        backdropFilter: 'blur(0px)',
      }}
      onClick={() => setOpen(false)}
    ></motion.div>
  );
};

const CloseButton = () => {
  const { setOpen } = useModal();

  return (
    <button
      className={cn(
        'absolute top-4 right-4 group',
        'flex items-center justify-center h-8 w-8 cursor-pointer'
      )}
      aria-label="Закрыть модальное окно"
      onClick={() => setOpen(false)}
    >
      <svg
        className="text-white h-5 w-5 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};
