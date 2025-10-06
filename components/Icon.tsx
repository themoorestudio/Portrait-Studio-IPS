
import React from 'react';

interface IconProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({ children, className = '', onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    onClick={onClick}
  >
    {children}
  </svg>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </Icon>
);

export const HeartIcon: React.FC<{ className?: string; isFilled?: boolean }> = ({ className, isFilled }) => (
  <Icon className={`${className} ${isFilled ? 'fill-red-500 text-red-500' : ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </Icon>
);

export const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.09-.83l1.21-5.452a1.125 1.125 0 00-1.09-1.42H5.625l-.24-1.061M15.75 21a2.25 2.25 0 01-2.25-2.25 2.25 2.25 0 012.25-2.25 2.25 2.25 0 012.25 2.25 2.25 2.25 0 01-2.25 2.25zM3.75 21a2.25 2.25 0 01-2.25-2.25 2.25 2.25 0 012.25-2.25 2.25 2.25 0 012.25 2.25 2.25 2.25 0 01-2.25 2.25z" />
  </Icon>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Icon>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M3 10.5v.75A2.25 2.25 0 005.25 13.5h13.5A2.25 2.25 0 0021 11.25v-.75M8.25 21V15a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v6" />
  </Icon>
);

export const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104l-1.39 1.39m2.44-1.04l-1.04 2.44M4.5 10.5l1.39-1.39m1.04 2.44l-2.44-1.04M19.5 13.5l-1.39 1.39m-1.04-2.44l2.44 1.04m-1.39 5.89l1.39 1.39M15 21l-1.04-2.44M9.75 20.896l1.39-1.39M12 18.5l2.44 1.04M12 3a9 9 0 100 18 9 9 0 000-18z" />
  </Icon>
);
