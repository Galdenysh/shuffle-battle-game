import React from 'react';
import type { FC } from 'react';
import { TutorialModalContent } from '@/components/shared';
import {
  MenuButton,
  MenuGhostButton,
  ModalBody,
  ModalFooter,
  ModalTrigger,
  useModal,
} from '@/components/ui';

export const TutorialModalBody: FC = () => {
  const { setOpen } = useModal();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalTrigger>
        <MenuGhostButton className="uppercase">
          Инструкция к битве
        </MenuGhostButton>
      </ModalTrigger>
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
