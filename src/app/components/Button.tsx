import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#FFD700] text-black hover:bg-[#FFED4E] active:bg-[#FFC700] shadow-md hover:shadow-lg',
    secondary: 'bg-[#2d2d2d] text-white hover:bg-[#3a3a3a] active:bg-[#1a1a1a]',
    outline: 'border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black',
    ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
