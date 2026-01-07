import React from 'react';
import type { FC } from 'react';

interface ShowHideIconProps {
  isShow?: boolean;
  className?: string;
}

const ShowHideIcon: FC<ShowHideIconProps> = ({
  isShow = true,
  className = '',
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="keyboard-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <g fill="url(#keyboard-grad)">
        <rect x="5" y="5" width="10" height="2.5" rx="0.8" />
        <rect x="5" y="8.5" width="10" height="2.5" rx="0.8" />
        <rect x="4" y="12" width="12" height="2.5" rx="0.8" />
      </g>

      <path
        d={isShow ? 'M4 17L10 19L16 17' : 'M4 19L10 17L16 19'}
        stroke="#8B5CF6"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
};

ShowHideIcon.displayName = 'ShowHideIcon';

export default ShowHideIcon;
