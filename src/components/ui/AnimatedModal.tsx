'use client';

import { useEffect, useRef } from 'react';
import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useMounted, useOutsideClick } from '@/hooks';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const mounted = useMounted();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useOutsideClick(modalRef, onClose);

  if (!mounted) return null;

  const content = (
    <AnimatePresence mode="wait">
      {isOpen && (
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
          <Overlay onClose={onClose} />

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
            <CloseButton onClose={onClose} />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export const ModalContent: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex flex-col flex-1 p-4 md:p-5 overflow-scroll overscroll-contain',
        className
      )}
    >
      {children}
    </div>
  );
};

export const ModalFooter: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('flex justify-end p-4 md:p-5', className)}>
      {children}
    </div>
  );
};

const Overlay: FC<{ onClose: () => void; className?: string }> = ({
  onClose,
  className,
}) => {
  const handleClose = () => {
    onClose();
  };

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
      onClick={handleClose}
    ></motion.div>
  );
};

const CloseButton: FC<{ onClose: () => void }> = ({ onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <button
      className={cn(
        'absolute top-4 right-4 group',
        'flex items-center justify-center h-8 w-8 cursor-pointer'
      )}
      aria-label="Закрыть модальное окно"
      onClick={handleClose}
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
