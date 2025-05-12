import { useUnit } from 'effector-react';
import {
  $activeSection,
  $animationPlaying,
  $isChangingSection,
  scrollToSection,
} from '../../models/journey';

type NavigationItem = {
  id: string;
  label: string;
};

export const SectionNav = () => {
  const activeSection = useUnit($activeSection);
  const isAnimationPlaying = useUnit($animationPlaying);
  const isChangingSection = useUnit($isChangingSection);

  const navigationItems: NavigationItem[] = [
    { id: 'section1', label: '01' },
    { id: 'section2', label: '02' },
    { id: 'section3', label: '03' },
    { id: 'section4', label: '04' },
    { id: 'section5', label: '05' },
  ];

  const handleSectionClick = (sectionId: string) => {
    if (isAnimationPlaying || isChangingSection) {
      return; // Блокируем переключение при воспроизведении анимации
    }
    scrollToSection(sectionId);
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
      {navigationItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleSectionClick(item.id)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              activeSection === item.id
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.2)',
            color: activeSection === item.id ? '#000' : '#fff',
            border: 'none',
            cursor:
              isAnimationPlaying || isChangingSection
                ? 'not-allowed'
                : 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
          {item.label}
        </button>
      ))}
    </div>
  );
};
