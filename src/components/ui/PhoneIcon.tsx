import type { FC } from 'react';
import { cn } from '@/lib/utils';

const PhoneIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      aria-hidden={true}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
};

PhoneIcon.displayName = 'PhoneIcon';

export default PhoneIcon;
