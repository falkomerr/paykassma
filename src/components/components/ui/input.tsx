import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="group relative aspect-[578/53] w-[30.1041666667vw]">
        <div className="bg-opacity-5 absolute inset-0 rounded-[11px] bg-[#0E0E0E] backdrop-blur-[30px]"></div>
        <div
          className="absolute inset-0 rounded-[11px] border border-transparent"
          style={{
            background:
              'linear-gradient(to bottom right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.01))',
            backgroundOrigin: 'border-box',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}></div>
        <input
          type={type}
          className={cn(
            'relative z-10 flex h-full w-full rounded-[11px] border-none bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[0.8333333333vw]',
            'placeholder:text-muted-foreground file:text-foreground',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
