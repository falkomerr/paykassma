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
      <div className="h-[35rem] h-screen w-screen bg-black">
        <Spline
          scene="https://prod.spline.design/VesmLhzpdoKoAkRX/scene.splinecode"
          className=""
        />
      </div>
      <div className="gilroy absolute top-[50%] mb-10 max-w-[650px] text-center text-[1.8vw] leading-none font-normal text-[#ccc]">
        {t('hero.description')}
      </div>

      <div className="group absolute top-[85%]">
        {/* <svg
          className="absolute -translate-x-1/4 -translate-y-1/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
        </svg> */}
        <AnimatedButton
          variant="login"
          size="big"
          hasOwnAnimation={true}
          className="group/button cursor-pointer"
          onClick={openGate}>
          <div className="relative flex h-[3.40104166667vw] w-[14.8541666667vw] items-center justify-center transition-all duration-500 group-hover/button:h-[3.1vw] group-hover/button:w-[14.1vw]">
            <div className="absolute inset-0 top-[34%] h-[1.2vw] w-full overflow-hidden">
              <div className="absolute w-full text-[1.15625vw] leading-[1] transition-transform duration-300 group-hover/button:-translate-y-full">
                {t('buttons.submit')}
              </div>
              <div className="absolute mt-0.5 w-full translate-y-full text-[1.15625vw] leading-[1] transition-transform duration-300 group-hover/button:translate-y-0">
                {t('buttons.submit')}
              </div>
            </div>
          </div>
        </AnimatedButton>
      </div>
    </section>
  );
};
