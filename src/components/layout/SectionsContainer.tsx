import { useUnit } from 'effector-react';
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

      // Делаем контейнер видимым
      timers.current.showContainer = setTimeout(() => {
        const container = document.querySelector(
          '.section-container:first-child',
        );
        if (container) {
          container.classList.add('visible');
        }

        // Активируем анимацию секции
        timers.current.activateSection = setTimeout(() => {
          const section = document.querySelector('#section1');
          if (section) {
            section.classList.add('active');
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
          }
        }, 300);
      }, 1000);

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
        <div
          className={`section-container ${
            activeSection === 'section1' ||
            (gateOpened && activeSection === 'section1')
              ? 'visible'
              : ''
          }`}
          data-section="section1">
          <Section1
            showAnimation={showAnimation}
            showContent={showFirstSectionContent} // Отдельное состояние для первой секции
          />
        </div>

        {/* Остальные секции */}
        <div
          className={`section-container ${activeSection === 'section2' ? 'visible' : ''}`}
          data-section="section2">
          <Section2 showContent={showContent} />
        </div>
        <div
          className={`section-container ${activeSection === 'section3' ? 'visible' : ''}`}
          data-section="section3">
          <Section3 showContent={showContent} />
        </div>
        <div
          className={`section-container ${activeSection === 'section4' ? 'visible' : ''}`}
          data-section="section4">
          <Section4 showContent={showContent} />
        </div>
        <div
          className={`section-container ${activeSection === 'section5' ? 'visible' : ''}`}
          data-section="section5">
          <Section5 showContent={showContent} />
        </div>
      </div>
    </div>
  );
};
