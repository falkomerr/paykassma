import { useUnit } from 'effector-react';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import { $activeSection, $animationPlaying } from '../../models/journey';
import {
  Section1,
  Section2,
  Section3,
  Section4,
  Section5,
} from './sections/Sections';

// Анимационные варианты для секций

const transition = {
  duration: 0.3,
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

  return (
    <div className="absolute top-0 left-0 h-fit">
      <AnimatePresence>
        {activeSection === 'section1' && !isAnimationPlaying && (
          <motion.div
            key="section1"
            id="section1"
            variants={sectionVariants}
            animate="visible"
            initial="hidden"
            exit="exit"
            transition={transition}>
            <Section1 />
          </motion.div>
        )}

        {activeSection === 'section2' && !isAnimationPlaying && (
          <motion.div
            key="section2"
            id="section2"
            variants={sectionVariants}
            animate="visible"
            initial="hidden"
            exit="exit"
            transition={transition}>
            <Section2 />
          </motion.div>
        )}

        {activeSection === 'section3' && !isAnimationPlaying && (
          <motion.div
            key="section3"
            id="section3"
            variants={sectionVariants}
            animate="visible"
            initial="hidden"
            exit="exit"
            transition={transition}>
            <Section3 />
          </motion.div>
        )}
        {activeSection === 'section4' && !isAnimationPlaying && (
          <motion.div
            key="section4"
            id="section4"
            variants={sectionVariants}
            animate="visible"
            initial="hidden"
            exit="exit"
            transition={transition}>
            <Section4 />
          </motion.div>
        )}
        {activeSection === 'section5' && !isAnimationPlaying && (
          <motion.div
            key="section5"
            id="section5"
            variants={sectionVariants}
            animate="visible"
            initial="hidden"
            exit="exit"
            transition={transition}>
            <Section5 />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
