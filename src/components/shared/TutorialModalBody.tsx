import type { FC } from 'react';
import { MenuButton, ModalFooter } from '@/components/ui';
import TutorialModalContent from './TutorialModalContent';

export const TutorialModalBody: FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <>
      <TutorialModalContent />
      <ModalFooter>
        <MenuButton className="uppercase" fullWidth onClick={handleClose}>
          Понятно
        </MenuButton>
      </ModalFooter>
    </>
  );
};

TutorialModalBody.displayName = 'TutorialModalBody';

export default TutorialModalBody;
