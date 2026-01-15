
import type { FC } from 'react';

interface RulesIconProps {
  className?: string;
}

const RulesIcon: FC<RulesIconProps> = ({ className = '' }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="rules-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <filter id="neon-glow">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="url(#rules-cyan)"
        strokeWidth="1.5"
        className="transition-all duration-300"
      />

      <path
        d="M8 9H16M8 12H16M8 15H12"
        stroke="url(#rules-cyan)"
        strokeWidth="1.8"
        strokeLinecap="round"
        filter="url(#neon-glow)"
      />
    </svg>
  );
};

RulesIcon.displayName = 'RulesIcon';

export default RulesIcon;
