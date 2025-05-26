import { $hovered, hoveredOrBlured } from '@/models/hero-model';
import { gateOpened } from '@/models/journey';
import Spline from '@splinetool/react-spline';
import { useUnit } from 'effector-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { AnimatedButton } from '../ui/AnimatedButton';

export const Hero = () => {
  const { openGate, hoverOrBlur } = useUnit({
    openGate: gateOpened,
    hoverOrBlur: hoveredOrBlured,
  });
  const { hovered } = useUnit({
    hovered: $hovered,
  });
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative z-20 flex max-h-screen min-h-[calc(100vh-120px)] flex-col items-center justify-center">
      <div className="h-[35rem] h-screen w-screen bg-black max-lg:hidden">
        <Spline
          scene="https://prod.spline.design/VesmLhzpdoKoAkRX/scene.splinecode"
          className=""
        />
      </div>
      <div className="lg:hidden">
        <img
          src="/mobile-logo.svg"
          alt="hero"
          className="flex-1 object-cover"
        />
      </div>
      <div className="gilroy top-[50%] mb-10 max-w-[350px] text-center text-[4.2vw] leading-none font-normal text-[#ccc] lg:absolute lg:max-w-[650px] lg:text-[1.8vw]">
        {t('hero.description')}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 2.5, ease: 'linear' }}
        className="absolute inset-x-0 bottom-0 z-10 h-[40vh]">
        <HoverButtonEffectSpline />
      </motion.div>
      <div className="group top-[85%] lg:absolute">
        <AnimatedButton
          onMouseEnter={() => hoverOrBlur(true)}
          onMouseLeave={() => hoverOrBlur(false)}
          variant="login"
          size="big"
          hasOwnAnimation={true}
          className="group/button relative z-20 cursor-pointer"
          onClick={openGate}>
          <div className="relative flex hidden items-center justify-center transition-all duration-500 group-hover/button:h-[3.1vw] group-hover/button:w-[14.1vw] lg:block lg:h-[3.40104166667vw] lg:w-[14.8541666667vw]">
            <div className="absolute inset-0 top-1/2 h-[1.11625vw] w-full -translate-y-1/2 overflow-hidden">
              <div className="absolute w-full text-[1.15625vw] leading-[1] opacity-100 transition-all duration-300 group-hover/button:-translate-y-full group-hover/button:opacity-0">
                {t('buttons.submit')}
              </div>
              <div className="absolute mt-0.5 w-full translate-y-full text-[4.5vw] leading-[1] transition-transform duration-300 group-hover/button:-translate-y-0.5 lg:text-[1.15625vw]">
                {t('buttons.submit')}
              </div>
            </div>
          </div>
          <div className="block px-10 py-3 text-[4.5vw] lg:hidden">
            {t('buttons.submit')}
          </div>
        </AnimatedButton>
      </div>
    </section>
  );
};

const HoverButtonEffectSpline = () => {
  return (
    <Spline scene="https://prod.spline.design/flZ40S72FHxLA7Nv/scene.splinecode" />
  );
};
