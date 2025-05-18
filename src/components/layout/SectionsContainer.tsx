import { useUnit } from 'effector-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  $activeSection,
  $animationPlaying,
  $gateOpened,
  animationEnded,
  animationPlayed,
} from '../../models/journey';
import '../../styles/sections.css';
// import { SectionNav } from './SectionNav';
import {
  Section1,
  Section2,
  Section3,
  Section4,
  Section5,
} from './sections/Sections';

// Анимационные варианты для секций
const sectionContainerVariants = {
  hidden: { opacity: 0, visibility: 'hidden' as const },
  visible: {
    opacity: 1,
    visibility: 'visible' as const,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    visibility: 'hidden' as const,
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

export const SectionsContainer = () => {
  // Получаем текущую активную секцию для правильного отображения
  const activeSection = useUnit($activeSection);
  const gateOpened = useUnit($gateOpened);
  const isAnimationPlaying = useUnit($animationPlaying);
  const finishAnimation = useUnit(animationEnded);
  const startAnimation = useUnit(animationPlayed);

  // Упрощаем состояния для управления анимациями
  const [showAnimation, setShowAnimation] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFirstSectionContent, setShowFirstSectionContent] = useState(false);

  // Рефы для отслеживания состояний
  const prevActiveSection = useRef('section1');
  const gateAnimationCompleted = useRef(false);

  // Таймеры для анимаций
  const timers = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

  // Очистка всех таймеров
  const clearAllTimers = () => {
    Object.keys(timers.current).forEach((key) => {
      if (timers.current[key]) {
        clearTimeout(timers.current[key]!);
        timers.current[key] = null;
      }
    });
  };

  // Эффект для анимации ворот - первичной загрузки
  useEffect(() => {
    if (gateOpened) {
      console.log('Ворота открылись, настраиваем анимацию');

      // Сначала скрываем весь контент
      setShowContent(false);
      setShowFirstSectionContent(false);

      // Очищаем все таймеры
      clearAllTimers();

      // Активируем анимацию с задержками используя Framer Motion
      timers.current.activateSection = setTimeout(() => {
        setShowAnimation(true);

        // По завершении анимации ворот показываем контент
        timers.current.showContentAfterGate = setTimeout(() => {
          console.log('Анимация ворот завершена');
          gateAnimationCompleted.current = true;

          // Завершаем анимацию
          finishAnimation();

          // После небольшой паузы показываем текст
          timers.current.showFirstSectionText = setTimeout(() => {
            console.log('Показываем контент первой секции');
            setShowFirstSectionContent(true);
          }, 200);
        }, 1200);
      }, 300);

      return clearAllTimers;
    }
  }, [gateOpened, finishAnimation]);

  // Эффект для переключения секций
  useEffect(() => {
    // Если меняется секция
    if (prevActiveSection.current !== activeSection) {
      console.log(
        `Переключение секции: ${prevActiveSection.current} -> ${activeSection}`,
      );

      // Начинаем анимацию исчезновения для предыдущей секции
      startAnimation();

      // Скрываем контент с анимацией
      if (prevActiveSection.current === 'section1') {
        setShowFirstSectionContent(false);
      } else {
        setShowContent(false);
      }

      // Обновляем текущую секцию
      prevActiveSection.current = activeSection;
    }
  }, [activeSection, startAnimation]);

  // Эффект для окончания анимации переключения
  useEffect(() => {
    if (!isAnimationPlaying && activeSection) {
      // Когда анимация завершена, показываем контент с небольшой задержкой
      clearTimeout(timers.current.showContentAfterTransition!);

      timers.current.showContentAfterTransition = setTimeout(() => {
        if (activeSection === 'section1') {
          console.log('Показываем контент первой секции после перехода');
          setShowFirstSectionContent(true);
        } else {
          console.log(`Показываем контент секции ${activeSection}`);
          setShowContent(true);
        }
      }, 400); // Задержка перед показом контента
    }

    return () => {
      if (timers.current.showContentAfterTransition) {
        clearTimeout(timers.current.showContentAfterTransition);
      }
    };
  }, [isAnimationPlaying, activeSection]);

  // Очистка всех таймеров при размонтировании
  useEffect(() => {
    return clearAllTimers;
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Контейнер для секций */}
      <div id="sections-wrapper">
        {/* Первая секция */}
        <AnimatePresence mode="wait">
          <motion.div
            key="section1"
            initial="hidden"
            animate={
              activeSection === 'section1' ||
              (gateOpened && activeSection === 'section1')
                ? 'visible'
                : 'hidden'
            }
            exit="exit"
            variants={sectionContainerVariants}
            className="section-container"
            data-section="section1">
            <Section1
              showAnimation={showAnimation}
              showContent={showFirstSectionContent} // Отдельное состояние для первой секции
            />
          </motion.div>
        </AnimatePresence>

        {/* Остальные секции */}
        <AnimatePresence mode="wait">
          <motion.div
            key="section2"
            initial="hidden"
            animate={activeSection === 'section2' ? 'visible' : 'hidden'}
            exit="exit"
            variants={sectionContainerVariants}
            className="section-container"
            data-section="section2">
            <Section2 showContent={showContent} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key="section3"
            initial="hidden"
            animate={activeSection === 'section3' ? 'visible' : 'hidden'}
            exit="exit"
            variants={sectionContainerVariants}
            className="section-container"
            data-section="section3">
            <Section3 showContent={showContent} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key="section4"
            initial="hidden"
            animate={activeSection === 'section4' ? 'visible' : 'hidden'}
            exit="exit"
            variants={sectionContainerVariants}
            className="section-container"
            data-section="section4">
            <Section4 showContent={showContent} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key="section5"
            initial="hidden"
            animate={activeSection === 'section5' ? 'visible' : 'hidden'}
            exit="exit"
            variants={sectionContainerVariants}
            className="section-container"
            data-section="section5">
            <Section5 showContent={showContent} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
