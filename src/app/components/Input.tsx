import React from 'react';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm mb-2 text-gray-700">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent',
          'transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export function TextArea({ label, error, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm mb-2 text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent',
          'transition-all duration-200 resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export function Select({ label, error, children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm mb-2 text-gray-700">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent',
          'transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
