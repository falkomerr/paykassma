import { gateOpened } from '@/models/journey';
import Spline from '@splinetool/react-spline';
import { useUnit } from 'effector-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AnimatedButton } from '../ui/AnimatedButton';

export const Hero = () => {
  const openGate = useUnit(gateOpened);
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-[calc(100vh-120px)] flex-col items-center justify-center">
      <div className="-mt-[20rem] mb-4">
        <div className="h-[35rem] h-screen w-screen bg-black">
          <Spline
            scene="https://prod.spline.design/VesmLhzpdoKoAkRX/scene.splinecode"
            className=""
          />
        </div>
      </div>
      <div className="gilroy -mt-[33rem] mb-10 max-w-[480px] text-center text-[22px] leading-none font-normal text-[#ccc]">
        {t('hero.description')}
      </div>

      <div className="relative">
        <svg
          className="absolute -translate-x-1/4 -translate-y-1/3"
          width="591"
          height="319"
          viewBox="0 0 591 319"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_f_15_29353)">
            <ellipse
              cx="295.5"
              cy="159.5"
              rx="169.5"
              ry="33.5"
              fill="#FFA500"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_15_29353"
              x="0.800003"
              y="0.800003"
              width="589.4"
              height="317.4"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="62.6"
                result="effect1_foregroundBlur_15_29353"
              />
            </filter>
          </defs>
        </svg>
        <AnimatedButton
          variant="login"
          size="big"
          className="group"
          onClick={openGate}>
          <div className="relative h-[1.8rem] w-[20rem] overflow-hidden">
            <div className="absolute w-full text-xl transition-transform duration-300 group-hover:-translate-y-full">
              {t('buttons.submit')}
            </div>
            <div className="absolute w-full translate-y-full text-xl transition-transform duration-300 group-hover:translate-y-0">
              {t('buttons.submit')}
            </div>
          </div>
        </AnimatedButton>
      </div>
    </section>
  );
};
