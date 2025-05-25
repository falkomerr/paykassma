import Spline from '@splinetool/react-spline';
import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ChipIcon } from './assets/chip-icon';
import { Header } from './components/layout/Header';
import {
  $loaderFinished,
  appMounted,
  loaderFinished,
} from './models/app-model';
import {
  $activeSection,
  $animationPlaying,
  $gateOpened,
  $sections,
  ANIMATED_SECTIONS,
} from './models/journey';

import { attachLogger } from 'effector-logger';
import { AnimatePresence, motion } from 'framer-motion';
import { BackgroundVideo } from './components/layout/BackgroundVideo';
import { Hero } from './components/layout/Hero';
import { SectionsContainer } from './components/layout/SectionsContainer';
import { AudioVilence } from './components/ui/AudioVilence';
import { Button } from './components/ui/Button';
import { LoginForm } from './features/login-form';
import { RegisterForm } from './features/register-form';
import { cn } from './lib/utils';
import { $volume, volumeChanged } from './models/audio';
import './styles/sections.css';

attachLogger();

const AppLayout = () => {
  const { isGateOpened, currentSection } = useUnit({
    isGateOpened: $gateOpened,
    currentSection: $activeSection,
  });

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <Header />
      <AnimatePresence>
        <motion.div
          key="hero"
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-black opacity-100 transition-opacity duration-1000 ease-in-out',
            isGateOpened && 'opacity-0',
          )}>
          <Hero />
        </motion.div>
        <motion.div
          key="gate"
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-black opacity-100 transition-opacity duration-1000 ease-in-out',
            !isGateOpened && 'opacity-0',
          )}>
          <AnimatePresence>
            {isGateOpened && ANIMATED_SECTIONS.includes(currentSection) && (
              <motion.div
                className="h-screen w-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}>
                <BackgroundVideo />
              </motion.div>
            )}
          </AnimatePresence>
          <AudioContainer />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const App = () => {
  const mountApp = useUnit(appMounted);
  const isGateOpened = useUnit($gateOpened);

  useEffect(() => {
    mountApp();
  }, [mountApp]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Loader />
              <AppLayout />
              <AnimatePresence>
                {isGateOpened && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}>
                    <SectionsContainer />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          }
        />
        <Route
          path="/test"
          element={
            <>
              <Loader />
              <AppLayout />
              <AnimatePresence>
                {isGateOpened && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}>
                    <SectionsContainer />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          }
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/spline" element={<SplineContainer />} />
      </Routes>
    </BrowserRouter>
  );
};

const SplineContainer = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <Spline
        scene="https://prod.spline.design/VesmLhzpdoKoAkRX/scene.splinecode"
        className="scale-[1.125]"
      />
    </div>
  );
};

const AudioContainer = () => {
  const [showCurrentSection, setShowCurrentSection] = useState(1);

  const { changeVolume } = useUnit({
    changeVolume: volumeChanged,
  });

  const { currentSection, sections, isAnimationPlaying, volume } = useUnit({
    currentSection: $activeSection,
    sections: $sections,
    isAnimationPlaying: $animationPlaying,
    volume: $volume,
  });

  useEffect(() => {
    setTimeout(() => {
      setShowCurrentSection(Number(currentSection.split('section').at(1)));
    }, 400);
  }, [currentSection]);

  const gradientText =
    'bg-gradient-to-t from-[#FFD01F] via-[#FFFD64] via-30% to-[#FFC61D] bg-clip-text text-transparent';

  return (
    <div className="fixed bottom-0 z-40 flex h-[5.625rem] w-full items-center justify-between bg-gradient-to-t from-black to-transparent px-5 pb-[1.5625rem] lg:bottom-[1.6875rem] lg:from-transparent lg:px-[3.75rem] lg:pb-0">
      <div className="relative z-50 ml-[2.75rem] flex items-center justify-center">
        <ChipIcon
          className={cn('absolute', isAnimationPlaying && 'animate-ease-spin')}
        />
        <p className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">
          <span className={gradientText}>{showCurrentSection}</span>/
          <span>{sections.length}</span>
        </p>
      </div>
      <img
        src="/audio-line.svg"
        className="absolute inset-0 top-1/2 h-[3px] w-full -translate-y-[0.75rem] lg:translate-y-1/2"
        width={1802}
        height={3}
      />
      <div className="absolute top-1/2 right-0 z-50 mr-5 flex -translate-y-[40%] items-start justify-center gap-x-4 object-cover lg:mr-[3.75rem] lg:-translate-y-[17.5%]">
        <p className="hidden text-[1rem] font-medium lg:flex">
          SOUND{' '}
          <span className={gradientText}>{volume === 0 ? 'OFF' : 'ON'}</span>
        </p>
        <Button
          onClick={() => changeVolume(volume === 0 ? 1 : 0)}
          variant="transparent"
          className="relative z-[999] size-[4rem] -translate-y-1/4 cursor-pointer">
          <AudioVilence />
        </Button>
      </div>
    </div>
  );
};

const Loader = () => {
  const isLoaderFinished = useUnit($loaderFinished);
  const finishLoader = useUnit(loaderFinished);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.location.pathname.includes('test')) {
      finishLoader();
      setProgress(100);
      return;
    }

    const timeout = setTimeout(() => {
      finishLoader();
    }, 5000);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 35);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [finishLoader]);

  if (isLoaderFinished) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black py-15">
      <div className="absolute relative top-1/2 -translate-y-1/2">
        <svg
          width="215"
          height="243"
          viewBox="0 0 215 243"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="logo-fill-mask">
              <path d="M143.096 26.6466H61.7774C49.0846 26.6466 38.4478 36.4388 37.5631 48.9409L25.7148 216.223H107.034C119.727 216.223 130.363 206.43 131.248 193.929L132.857 171.182H155.839C168.532 171.182 179.169 161.39 180.054 148.888L188.715 26.6466H143.096ZM129.434 39.5894L121.034 158.656H88.1279L95.8341 49.8144C95.9795 45.8385 99.7386 39.5894 107.232 39.5894H129.434ZM118.596 193.055C118.173 199.026 113.096 203.7 107.034 203.7H39.3174L50.4387 49.888C50.864 44.8456 54.2879 39.5894 61.7082 39.5894H86.0393C84.4107 42.5275 83.433 45.4122 83.1816 48.9409L74.5254 171.182H120.144L118.596 193.055ZM167.406 148.015C166.984 153.985 161.907 158.66 155.844 158.66H133.746L142.212 39.1685H175.117L167.406 148.015Z" />
            </clipPath>
            <clipPath id="logo-glow-mask">
              <rect
                x="0"
                y="0"
                width={(214.43 * progress) / 100}
                height="242.869"
              />
            </clipPath>
          </defs>

          <g filter="url(#filter0_f_56_132)" clipPath="url(#logo-glow-mask)">
            <path
              d="M145.612 20.0001H58.5912C45.0085 20.0001 33.6258 30.479 32.679 43.8577L20 222.869H107.021C120.604 222.869 131.987 212.39 132.933 199.012L134.655 174.671H159.249C172.832 174.671 184.214 164.192 185.161 150.813L194.43 20.0001H145.612ZM130.992 33.8505L122.002 161.266H86.7895L95.036 44.7925C95.1917 40.5378 99.2143 33.8505 107.233 33.8505H130.992ZM119.394 198.078C118.942 204.467 113.509 209.469 107.021 209.469H34.5564L46.4575 44.8712C46.9126 39.4752 50.5766 33.8505 58.5172 33.8505H84.5544C82.8117 36.9946 81.7654 40.0815 81.4963 43.8577L72.2332 174.671H121.051L119.394 198.078ZM171.627 149.879C171.175 156.268 165.742 161.271 159.254 161.271H135.607L144.666 33.4001H179.879L171.627 149.879Z"
              fill="url(#paint0_linear_56_132)"
            />
            <path
              d="M145.612 20.0001H58.5912C45.0085 20.0001 33.6258 30.479 32.679 43.8577L20 222.869H107.021C120.604 222.869 131.987 212.39 132.933 199.012L134.655 174.671H159.249C172.832 174.671 184.214 164.192 185.161 150.813L194.43 20.0001H145.612ZM130.992 33.8505L122.002 161.266H86.7895L95.036 44.7925C95.1917 40.5378 99.2143 33.8505 107.233 33.8505H130.992ZM119.394 198.078C118.942 204.467 113.509 209.469 107.021 209.469H34.5564L46.4575 44.8712C46.9126 39.4752 50.5766 33.8505 58.5172 33.8505H84.5544C82.8117 36.9946 81.7654 40.0815 81.4963 43.8577L72.2332 174.671H121.051L119.394 198.078ZM171.627 149.879C171.175 156.268 165.742 161.271 159.254 161.271H135.607L144.666 33.4001H179.879L171.627 149.879Z"
              fill="url(#paint1_linear_56_132)"
            />
          </g>
          <path
            d="M143.678 25.5365H60.6153C47.6503 25.5365 36.7854 35.4788 35.8817 48.1726L23.7793 218.019H106.843C119.808 218.019 130.672 208.076 131.576 195.383L133.219 172.288H156.695C169.66 172.288 180.525 162.346 181.428 149.652L190.275 25.5365H143.678ZM129.723 38.6777L121.142 159.569H87.531L95.4025 49.0595C95.5511 45.0227 99.3907 38.6777 107.045 38.6777H129.723ZM118.652 194.496C118.221 200.559 113.035 205.304 106.843 205.304H37.6736L49.0335 49.1342C49.4678 44.0144 52.9652 38.6777 60.5446 38.6777H85.3976C83.7341 41.6608 82.7354 44.5897 82.4786 48.1726L73.6367 172.288H120.234L118.652 194.496ZM168.51 148.765C168.078 154.827 162.892 159.574 156.7 159.574H134.128L142.775 38.2504H176.386L168.51 148.765Z"
            fill="#333"
            strokeWidth="0.5"
            stroke="#555"
          />
          <path
            d="M48.4134 59.5084C48.9279 52.2868 49.1851 48.676 50.6664 45.8789C52.2562 42.8768 54.8202 40.5017 57.935 39.1457C60.837 37.8823 64.4777 37.9017 71.7591 37.9404L86.4114 38.0184C88.8091 38.0312 90.7462 39.9785 90.7462 42.3763L84.641 144.276C84.3071 149.85 84.1401 152.636 84.8705 154.863C86.009 158.334 88.6321 161.119 92.0289 162.463C94.2083 163.326 97.0001 163.326 102.584 163.326C108.25 163.326 111.083 163.326 113.281 164.205C116.708 165.576 119.338 168.414 120.444 171.935C121.153 174.194 120.938 177.019 120.506 182.669L120.435 183.597C119.902 190.579 119.636 194.07 118.242 196.772C116.613 199.929 113.918 202.405 110.635 203.761C107.824 204.921 104.323 204.891 97.3211 204.831L38.4185 204.328C38.9841 192.355 45.3987 101.828 48.4134 59.5084Z"
            fill="url(#paint4_linear_56_132)"
            fillOpacity="0.1"
          />
          <path
            d="M93.5664 66.148C94.5291 52.9806 95.0105 46.3969 99.3281 42.3834C103.646 38.3699 110.258 38.3699 123.481 38.3699L176.217 38.3699L169.408 131.742C168.446 144.935 167.965 151.532 163.647 155.546C159.329 159.56 152.716 159.56 139.488 159.56H86.7915C87.3051 151.889 91.1288 99.4868 93.5664 66.148Z"
            fill="url(#paint5_linear_56_132)"
            fillOpacity="0.1"
          />

          <rect
            x="20"
            y="20"
            width={(175 * progress) / 100}
            height="223"
            fill="url(#paint6_linear_56_132)"
            clipPath="url(#logo-fill-mask)"
          />

          <defs>
            <filter
              id="filter0_f_56_132"
              x="0"
              y="0.00012207"
              width="214.43"
              height="242.869"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="10"
                result="effect1_foregroundBlur_56_132"
              />
            </filter>
            <linearGradient
              id="paint0_linear_56_132"
              x1="20"
              y1="121.435"
              x2="194.43"
              y2="121.435"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD01F" />
              <stop offset="0.302885" stopColor="#FFFD64" />
              <stop offset="1" stopColor="#FFC61D" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_56_132"
              x1="110.124"
              y1="121.435"
              x2="20"
              y2="121.435"
              gradientUnits="userSpaceOnUse">
              <stop />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_56_132"
              x1="23.7793"
              y1="121.778"
              x2="190.275"
              y2="121.778"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD01F" />
              <stop offset="0.302885" stopColor="#FFFD64" />
              <stop offset="1" stopColor="#FFC61D" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_56_132"
              x1="109.804"
              y1="121.778"
              x2="23.7793"
              y2="121.778"
              gradientUnits="userSpaceOnUse">
              <stop />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_56_132"
              x1="41.8031"
              y1="204.464"
              x2="135.945"
              y2="38.3552"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#4B4B4B" />
              <stop offset="0.337101" stopColor="#2A282B" />
              <stop offset="1" stopColor="#060606" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_56_132"
              x1="90.4136"
              y1="159.161"
              x2="143.639"
              y2="20.5125"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#4B4B4B" />
              <stop offset="0.337101" stopColor="#2A282B" />
              <stop offset="1" stopColor="#060606" />
            </linearGradient>
            <linearGradient
              id="paint6_linear_56_132"
              x1="25.7148"
              y1="121.435"
              x2="188.715"
              y2="121.435"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD01F" />
              <stop offset="0.302885" stopColor="#FFFD64" />
              <stop offset="1" stopColor="#FFC61D" />
            </linearGradient>
            <linearGradient
              id="paint7_linear_56_132"
              x1="25.7148"
              y1="121.435"
              x2="227.432"
              y2="137.203"
              gradientUnits="userSpaceOnUse">
              <stop offset="0.4" stopOpacity="0" />
              <stop offset="0.41" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative">
        <svg
          width="116"
          height="55"
          viewBox="0 0 116 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_i_56_211)">
            <rect
              width="116"
              height="55"
              rx="27.5"
              fill="url(#paint0_linear_56_211)"
              fillOpacity="0.05"
            />
            <rect
              x="0.75"
              y="0.75"
              width="114.5"
              height="53.5"
              rx="26.75"
              stroke="url(#paint1_linear_56_211)"
              strokeWidth="1.5"
            />
          </g>
          <defs>
            <filter
              id="filter0_i_56_211"
              x="-10"
              y="-10"
              width="136"
              height="75"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="7.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_56_211"
              />
            </filter>
            <linearGradient
              id="paint0_linear_56_211"
              x1="116"
              y1="28.3332"
              x2="-1.38283e-05"
              y2="28.3332"
              gradientUnits="userSpaceOnUse">
              <stop offset="0.046883" stopColor="#EEEEEE" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_56_211"
              x1="8.25828"
              y1="-7.84574e-06"
              x2="109.841"
              y2="53.1908"
              gradientUnits="userSpaceOnUse">
              <stop stopColor="#515150" />
              <stop offset="0.465842" stopColor="white" />
              <stop offset="1" stopColor="#515150" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};
