import React from 'react';
import type { FC } from 'react';
import { MenuButton, ModalBody, ModalFooter, useModal } from '@/components/ui';
import TutorialModalContent from './TutorialModalContent';

export const TutorialModalBody: FC = () => {
  const { setOpen } = useModal();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalBody>
        <TutorialModalContent />
        <ModalFooter>
          <MenuButton
            className="uppercase"
            fullWidth
            onClick={handleClose}
            onTouchStart={handleClose}
          >
            Понятно
          </MenuButton>
        </ModalFooter>
      </ModalBody>
    </>
  );
};

TutorialModalBody.displayName = 'TutorialModalBody';

export default TutorialModalBody;
