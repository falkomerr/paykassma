import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type AnimatedButtonProps = {
  children: ReactNode;
  variant?: 'default' | 'login';
  size?: 'default' | 'big';
  hasOwnAnimation?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AnimatedButton = ({
  children,
  variant = 'default',
  size = 'default',
  hasOwnAnimation = false,
  ...props
}: AnimatedButtonProps) => {
  return (
    <button
      className={cn(
        'group/button relative inline-flex cursor-pointer items-center justify-center overflow-hidden text-base font-medium text-white focus:outline-none',
        size === 'big'
          ? 'h-[4.0104166667vw] w-[16.3541666667vw] px-10'
          : cn(
              'h-[46px] max-h-[46px] min-h-[46px] px-8',
              variant === 'default' ? 'w-[169px]' : 'w-[111px]',
            ),
      )}
      {...props}>
      {variant === 'login' ? (
        size === 'big' ? (
          <img
            src="/big-golden-button-bg.svg"
            alt="login-big"
            className="absolute inset-0 h-full w-full rounded-[1.25rem] object-contain backdrop-blur-sm"
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
      {hasOwnAnimation ? (
        <span className="relative z-10 px-2 text-center whitespace-nowrap">
          {children}
        </span>
      ) : (
        <div className="relative z-10 h-[1vw] w-full overflow-hidden text-center">
          <div className="absolute w-full text-center text-[1.05vw] leading-[1] whitespace-nowrap transition-transform duration-300 group-hover/button:-translate-y-full">
            {children}
          </div>
          <div className="absolute w-full translate-y-full text-center text-[1.05vw] leading-[1] whitespace-nowrap transition-transform duration-300 group-hover/button:translate-y-0">
            {children}
          </div>
        </div>
      )}
    </button>
  );
};
