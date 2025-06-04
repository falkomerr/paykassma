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

const transition = {
  duration: 0.3,
  delay: 0.4,
  ease: 'easeInOut',
} as Transition;

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -50,
  },
};

export const SectionsContainer = () => {
  const activeSection = useUnit($activeSection);
  const isAnimationPlaying = useUnit($animationPlaying);

  const sectionMotion = {
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    transition: transition,
    variants: sectionVariants,
  };

  const renderSection = (sectionId: string, children: React.ReactNode) => {
    return (
      <motion.div key={sectionId} id={sectionId} {...sectionMotion}>
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
          renderSection('section6', <Section6 />)}

        {activeSection === 'section7' &&
          renderSection('section7', <Section7 />)}

        {activeSection === 'section8' &&
          renderSection('section8', <Section10 />)}
      </AnimatePresence>
    </div>
  );
};
