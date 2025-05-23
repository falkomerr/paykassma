import { $hovered, hoveredOrBlured } from '@/models/hero-model';
import { gateOpened } from '@/models/journey';
import Spline from '@splinetool/react-spline';
import { useUnit } from 'effector-react';
import { AnimatePresence, motion } from 'framer-motion';
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
      <div className="h-[35rem] h-screen w-screen bg-black">
        <Spline
          scene="https://prod.spline.design/VesmLhzpdoKoAkRX/scene.splinecode"
          className=""
        />
      </div>
      <div className="gilroy absolute top-[50%] mb-10 max-w-[650px] text-center text-[1.8vw] leading-none font-normal text-[#ccc]">
        {t('hero.description')}
      </div>

      <AnimatePresence mode="wait">
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            className="absolute inset-x-0 bottom-0 z-10 h-200">
            <HoverButtonEffectSpline />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="group absolute top-[85%]">
        <AnimatedButton
          onMouseEnter={() => hoverOrBlur(true)}
          onMouseLeave={() => hoverOrBlur(false)}
          variant="login"
          size="big"
          hasOwnAnimation={true}
          className="group/button relative z-20 cursor-pointer"
          onClick={openGate}>
          <div className="relative flex h-[3.40104166667vw] w-[14.8541666667vw] items-center justify-center transition-all duration-500 group-hover/button:h-[3.1vw] group-hover/button:w-[14.1vw]">
            <div className="absolute inset-0 top-[34%] h-[1.11625vw] w-full overflow-hidden">
              <div className="absolute w-full text-[1.15625vw] leading-[1] transition-transform duration-300 group-hover/button:-translate-y-full">
                {t('buttons.submit')}
              </div>
              <div className="absolute mt-0.5 w-full translate-y-full text-[1.15625vw] leading-[1] transition-transform duration-300 group-hover/button:-translate-y-0.5">
                {t('buttons.submit')}
              </div>
            </div>
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
