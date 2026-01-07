import { useEffect, useState } from 'react';

export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      return navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    };

    setIsTouch(checkTouch());
  }, []);

  return isTouch;
};

