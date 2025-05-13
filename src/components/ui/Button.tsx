import { cn } from '@/lib/utils';
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'gold' | 'journey' | 'transparent';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

export const Button = ({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'gilroy relative inline-flex items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        // Размеры
        {
          'h-[46px] px-8 text-base font-medium': size === 'default',
          'h-9 px-4 text-sm font-medium': size === 'sm',
          'h-[54px] px-10 text-lg font-medium': size === 'lg',
        },
        // Варианты
        {
          'border-transparent bg-black/30 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.7)]':
            variant === 'default',
          'border-white/70 bg-black/20 text-white shadow-[inset_0_0_15px_rgba(255,255,255,0.3),0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.4),0_0_20px_rgba(255,255,255,0.5)]':
            variant === 'outline',
          'border-[#FFB901]/70 bg-black/20 text-white/90 shadow-[inset_0_0_15px_rgba(255,215,0,0.3),0_0_15px_rgba(255,215,0,0.4)] hover:shadow-[inset_0_0_20px_rgba(255,215,0,0.4),0_0_20px_rgba(255,215,0,0.5)]':
            variant === 'gold',
          'border-[#FFD900]/80 bg-black/10 text-white shadow-[inset_0_0_25px_rgba(255,215,0,0.4),0_0_30px_rgba(255,215,0,0.6)] hover:shadow-[inset_0_0_30px_rgba(255,215,0,0.5),0_0_40px_rgba(255,215,0,0.7)]':
            variant === 'journey',
          'border-0 bg-transparent p-0': variant === 'transparent',
        },
        className,
      )}
      style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500 }}
      {...props}>
      {children}
    </button>
  );
};
