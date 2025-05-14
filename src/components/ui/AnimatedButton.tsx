import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type AnimatedButtonProps = {
  children: ReactNode;
  variant?: 'default' | 'login';
  size?: 'default' | 'big';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AnimatedButton = ({
  children,
  variant = 'default',
  size = 'default',
  ...props
}: AnimatedButtonProps) => {
  return (
    <button
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center text-base font-medium text-white focus:outline-none',
        size === 'big' ? 'h-[77px] px-10' : 'h-[46px] px-8',
      )}
      {...props}>
      {variant === 'login' ? (
        size === 'big' ? (
          <img
            src="/big-golden-button-bg.svg"
            alt="login-big"
            className="absolute inset-0 h-full w-full object-contain backdrop-blur-sm"
          />
        ) : (
          <img
            src="/golden-button-bg.svg"
            alt="login"
            className="absolute inset-0 h-full w-full object-contain backdrop-blur-sm"
          />
        )
      ) : (
        <img
          src="/white-button-bg.svg"
          alt="default"
          className="absolute inset-0 h-full w-full object-contain backdrop-blur-sm"
        />
      )}
      <span className="relative z-10 px-2 text-center">{children}</span>
    </button>
  );
};
