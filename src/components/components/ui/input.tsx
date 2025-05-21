import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="group relative w-fit">
        {/* Gradient border background */}
        <svg
          width="587"
          height="53"
          className="absolute inset-0"
          viewBox="0 0 587 53"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <foreignObject x="-30" y="-30" width="647" height="113">
            <div
              style={{
                backdropFilter: 'blur(15px)',
                clipPath: 'url(#bgblur_0_13_29149_clip_path)',
                height: '100%',
                width: '100%',
              }}></div>
          </foreignObject>
          <g data-figma-bg-blur-radius="30">
            <rect
              width="587"
              height="53"
              rx="11"
              fill="white"
              fillOpacity="0.05"
            />
            <rect
              x="0.5"
              y="0.5"
              width="586"
              height="52"
              rx="10.5"
              stroke="url(#paint0_linear_13_29149)"
              strokeOpacity="0.8"
            />
          </g>
          <defs>
            <clipPath
              id="bgblur_0_13_29149_clip_path"
              transform="translate(30 30)">
              <rect width="587" height="53" rx="11" />
            </clipPath>
            <linearGradient
              id="paint0_linear_13_29149"
              x1="0"
              y1="0"
              x2="6.24579"
              y2="86.4689"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0.3" />
              <stop offset="1" stopColor="white" stopOpacity="0.01" />
            </linearGradient>
          </defs>
        </svg>

        <input
          type={type}
          className={cn(
            'relative z-10 flex h-[3.25rem] w-[35.5729166667vw] max-w-[36.6875rem] rounded-[11px] border-none bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
