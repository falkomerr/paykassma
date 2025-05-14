import { ReactNode } from 'react';

type AnimatedButtonProps = {
  children: ReactNode;
  variant?: 'default' | 'login';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AnimatedButton = ({
  children,
  variant = 'default',
  ...props
}: AnimatedButtonProps) => {
  return (
    <button
      className="relative inline-flex h-14 cursor-pointer items-center justify-center px-8 text-base font-medium text-white focus:outline-none"
      {...props}>
      {variant === 'login' ? (
        <svg
          className="absolute inset-0 h-full w-full backdrop-blur-sm"
          viewBox="0 0 111 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 0.75H96C103.87 0.75 110.25 7.12994 110.25 15V31C110.25 38.8701 103.87 45.25 96 45.25H15C7.12994 45.25 0.75 38.8701 0.75 31V15C0.75 7.12994 7.12994 0.75 15 0.75Z"
            fill="url(#paint0_linear_107_2911)"
            fillOpacity="0.05"
          />
          <path
            d="M15 0.75H96C103.87 0.75 110.25 7.12994 110.25 15V31C110.25 38.8701 103.87 45.25 96 45.25H15C7.12994 45.25 0.75 38.8701 0.75 31V15C0.75 7.12994 7.12994 0.75 15 0.75Z"
            stroke="url(#paint1_linear_107_2911)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient
              id="paint0_linear_107_2911"
              x1="111"
              y1="23.6969"
              x2="-1.32322e-05"
              y2="23.6969"
              gradientUnits="userSpaceOnUse">
              <stop offset="0.046883" stopColor="#FFAC64" />
              <stop offset="1" stopColor="#FFB901" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_107_2911"
              x1="7.90232"
              y1="-6.56189e-06"
              x2="99.0466"
              y2="54.6027"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#515150" />
              <stop offset="0.465842" stopColor="#FFB901" />
              <stop offset="1" stopColor="#515150" />
            </linearGradient>
          </defs>
        </svg>
      ) : (
        <svg
          className="absolute inset-0 h-full w-full backdrop-blur-sm"
          viewBox="0 0 169 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 0.75H154C161.87 0.75 168.25 7.12994 168.25 15V31C168.25 38.8701 161.87 45.25 154 45.25H15C7.12994 45.25 0.75 38.8701 0.75 31V15C0.75 7.12994 7.12994 0.75 15 0.75Z"
            fill="url(#paint0_linear_107_2909)"
            fillOpacity="0.05"
          />
          <path
            d="M15 0.75H154C161.87 0.75 168.25 7.12994 168.25 15V31C168.25 38.8701 161.87 45.25 154 45.25H15C7.12994 45.25 0.75 38.8701 0.75 31V15C0.75 7.12994 7.12994 0.75 15 0.75Z"
            stroke="url(#paint1_linear_107_2909)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient
              id="paint0_linear_107_2909"
              x1="169"
              y1="23.6969"
              x2="-2.01464e-05"
              y2="23.6969"
              gradientUnits="userSpaceOnUse">
              <stop offset="0.046883" stopColor="#EEEEEE" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_107_2909"
              x1="12.0315"
              y1="-6.56189e-06"
              x2="114.967"
              y2="93.889"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#515150" />
              <stop offset="0.465842" stopColor="white" />
              <stop offset="1" stopColor="#515150" />
            </linearGradient>
          </defs>
        </svg>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
