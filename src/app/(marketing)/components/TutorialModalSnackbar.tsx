import type { FC } from 'react';
import { Snackbar, useModal } from '@/components/ui';

interface TutorialModalSnackbarProps {
  show?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const TutorialModalSnackbar: FC<TutorialModalSnackbarProps> = ({
  show,
  onOpen,
  onClose,
}) => {
  const { setOpen } = useModal();

  const handleOpen = () => {
    setOpen(true);

    onOpen?.();
  };

  return (
    <>
      <Snackbar
        title="Впервые здесь?"
        description="Твои шансы выше, если ты знаешь правила. Изучишь?"
        show={show}
        onOpen={handleOpen}
        onClose={onClose}
      />
    </>
  );
};

TutorialModalSnackbar.displayName = 'TutorialModalSnackbar';

export default TutorialModalSnackbar;
