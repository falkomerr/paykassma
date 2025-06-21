import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type AnimatedButtonProps = {
  children: ReactNode;
  variant?: 'default' | 'login';
  size?: 'default' | 'big';
  hasOwnAnimation?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AnimatedButton = ({
  children,
  variant = 'default',
  size = 'default',
  hasOwnAnimation = false,
  className,
  ...props
}: AnimatedButtonProps) => {
  return (
    <button
      className={cn(
        'group/button relative z-[999] inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl text-base font-medium text-white backdrop-blur-xs focus:outline-none',
        size === 'big'
          ? 'h-[4.0104166667vw] w-[17.3541666667vw] px-10 max-lg:w-[50vw]'
          : cn(
              'flex h-[3vw] items-center justify-center',
              variant === 'default' ? 'w-[9.7020833333vw]' : 'w-[6.58125vw]',
            ),
        className,
      )}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
      }}
      onMouseEnter={(event) => {
        props.onMouseEnter?.(event);
      }}>
      {variant === 'login' ? (
        size === 'big' ? (
          <img
            src="/big-golden-button-bg.svg"
            alt="login-big"
            className="absolute inset-0 h-full w-full rounded-[1.25rem] object-contain"
          />
        ) : (
          <img
            src="/golden-button-bg.svg"
            alt="login"
            className="absolute inset-0 h-full w-full rounded-xl object-contain"
          />
        )
      ) : (
        <img
          src="/white-button-bg.svg"
          alt="default"
          className="absolute inset-0 h-full w-full rounded-xl object-contain"
        />
      )}
      {hasOwnAnimation ? (
        <span className="relative z-[999] px-2 text-center whitespace-nowrap">
          {children}
        </span>
      ) : (
        <div className="relative z-[999] h-[14px] w-full overflow-hidden text-center 2xl:h-[16px]">
          <div className="absolute w-full text-center text-[14px] leading-[1] whitespace-nowrap opacity-100 transition-all duration-300 group-hover/button:-translate-y-full group-hover/button:opacity-0 2xl:text-[16px]">
            {children}
          </div>
          <div className="absolute w-full translate-y-full text-center text-[14px] leading-[1] whitespace-nowrap transition-transform duration-300 group-hover/button:translate-y-0 2xl:text-[16px]">
            {children}
          </div>
        </div>
      )}
    </button>
  );
};
