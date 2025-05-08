import { useUnit } from 'effector-react';
import { useEffect } from 'react';
import { $activeSection } from '../../models/journey';
import '../../styles/sections.css';
import { SectionNav } from './SectionNav';
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

  // Выполняем дополнительную инициализацию при монтировании компонента
  useEffect(() => {
    // Эта инициализация гарантирует, что первая секция будет показана
    const timer = setTimeout(() => {
      document
        .querySelector('.section-container:first-child')
        ?.classList.add('visible');
      document.querySelector('#section1')?.classList.add('active');
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <SectionNav />
      {/* Контейнер для секций */}
      <div id="sections-wrapper">
        {/* Используем классы для анимации и принудительно устанавливаем visible для первой секции */}
        <div
          className={`section-container ${activeSection === 'section1' ? 'visible' : ''}`}>
          <Section1 />
        </div>
        <div
          className={`section-container ${activeSection === 'section2' ? 'visible' : ''}`}>
          <Section2 />
        </div>
        <div
          className={`section-container ${activeSection === 'section3' ? 'visible' : ''}`}>
          <Section3 />
        </div>
        <div
          className={`section-container ${activeSection === 'section4' ? 'visible' : ''}`}>
          <Section4 />
        </div>
        <div
          className={`section-container ${activeSection === 'section5' ? 'visible' : ''}`}>
          <Section5 />
        </div>
      </div>
    </div>
  );
};
