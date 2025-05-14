import { gateOpened } from '@/models/journey';
import { useUnit } from 'effector-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AnimatedButton } from '../ui/AnimatedButton';
import { LogoBig } from '../ui/LogoBig';

export const Hero = () => {
  const openGate = useUnit(gateOpened);
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-[calc(100vh-120px)] flex-col items-center justify-center">
      <div className="mb-4">
        <LogoBig />
      </div>
      <div className="gilroy mb-10 max-w-[480px] text-center text-[22px] leading-none font-normal text-[#ccc]">
        {t('hero.description')}
      </div>
      <AnimatedButton variant="login" size="big" onClick={openGate}>
        {t('buttons.submit')}
      </AnimatedButton>
    </section>
  );
};
