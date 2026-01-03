import React from 'react';
import type { FC } from 'react';
import { Direction } from '@/types';

interface ArrowIconsProps {
  direction?: Direction;
  isToggleOn?: boolean;
  showToggleIcon?: boolean;
}

const ArrowIcons: FC<ArrowIconsProps> = ({
  direction = Direction.NORTH,
  isToggleOn = false,
  showToggleIcon = false,
}) => {
  const strokeColor = '#FFFFFF';
  const strokeWidth = 2.5;

  const paths: Record<Direction, string> = {
    north: 'M12 20L12 4M12 4L8 8M12 4L16 8',
    south: 'M12 4L12 20M12 20L8 16M12 20L16 16',
    west: 'M20 12L4 12M4 12L8 8M4 12L8 16',
    east: 'M4 12L20 12M20 12L16 8M20 12L16 16',
    north_east: 'M4 20L20 4M20 4L16 4M20 4L20 8',
    north_west: 'M20 20L4 4M4 4L4 8M4 4L8 4',
    south_east: 'M4 4L20 20M20 20L20 16M20 20L16 20',
    south_west: 'M20 4L4 20M4 20L4 16M4 20L8 20',
  };

  if (showToggleIcon) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {isToggleOn && (
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
          />
        )}
      </svg>
    );
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[direction] || paths.north} />
    </svg>
  );
};

ArrowIcons.displayName = 'ArrowIcons';

export default ArrowIcons;
