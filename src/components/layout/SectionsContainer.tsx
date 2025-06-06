import { useUnit } from 'effector-react';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import { $activeSection, $animationPlaying } from '../../models/journey';
import {
  Section1,
  Section10,
  Section2,
  Section3,
  Section4,
  Section5,
  Section6,
  Section7,
} from './sections/Sections';

// Анимационные варианты для секций

export const transition = {
  duration: 0.6,
  delay: 0.6,
  ease: 'easeInOut',
} as Transition;

export const sectionVariants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 50,
  },
};

export const SectionsContainer = () => {
  const activeSection = useUnit($activeSection);
  const isAnimationPlaying = useUnit($animationPlaying);

  const renderSection = (
    sectionId: string,
    children: React.ReactNode,
  ): React.ReactNode => {
    return (
      <motion.div key={sectionId} id={sectionId}>
        {children}
      </motion.div>
    );
  };

  return (
    <div className="absolute top-0 left-0 h-fit w-full">
      <AnimatePresence>
        {activeSection === 'section1' &&
          !isAnimationPlaying &&
          renderSection('section1', <Section1 />)}

        {activeSection === 'section2' &&
          !isAnimationPlaying &&
          renderSection('section2', <Section2 />)}

        {activeSection === 'section3' &&
          !isAnimationPlaying &&
          renderSection('section3', <Section3 />)}

        {activeSection === 'section4' &&
          !isAnimationPlaying &&
          renderSection('section4', <Section4 />)}

        {activeSection === 'section5' &&
          !isAnimationPlaying &&
          renderSection('section5', <Section5 />)}

        {activeSection === 'section6' &&
          !isAnimationPlaying &&
          renderSection('section6', <Section6 />)}

        {activeSection === 'section7' &&
          !isAnimationPlaying &&
          renderSection('section7', <Section7 />)}

        {activeSection === 'section8' &&
          !isAnimationPlaying &&
          renderSection('section8', <Section10 />)}
      </AnimatePresence>
    </div>
  );
};
