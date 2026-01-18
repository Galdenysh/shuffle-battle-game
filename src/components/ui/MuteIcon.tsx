import type { FC } from 'react';

interface MuteIconProps {
  isMuted?: boolean;
  className?: string;
}

const MuteIcon: FC<MuteIconProps> = ({ isMuted = true, className = '' }) => {
  return (
    <svg
      className={className}
      aria-hidden={true}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mute-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <g fill="url(#mute-grad)">
        <path d="M7 7H4V13H7L11 16V4L7 7Z" rx="0.8" />
        {!isMuted && (
          <>
            <rect x="13" y="7" width="1.5" height="6" rx="0.75" opacity="0.8" />
            <rect
              x="16"
              y="5"
              width="1.5"
              height="10"
              rx="0.75"
              opacity="0.5"
            />
          </>
        )}
      </g>

      {isMuted && (
        <path
          d="M4 4L16 16"
          stroke="#8B5CF6"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      )}
    </svg>
  );
};

MuteIcon.displayName = 'MuteIcon';

export default MuteIcon;
