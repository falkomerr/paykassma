import { useUnit } from 'effector-react';
import {
  $activeSection,
  $animationPlaying,
  $isChangingSection,
  $sections,
  goToNextSection,
  goToPrevSection,
} from '../../models/journey';

export const ScrollArrows = () => {
  const activeSection = useUnit($activeSection);
  const sections = useUnit($sections);
  const isAnimationPlaying = useUnit($animationPlaying);
  const isChangingSection = useUnit($isChangingSection);

  const isFirstSection = activeSection === sections[0];
  const isLastSection = activeSection === sections[sections.length - 1];

  const handlePrevSection = () => {
    if (isAnimationPlaying || isChangingSection) {
      return; // Блокируем переключение при воспроизведении анимации
    }
    goToPrevSection();
  };

  const handleNextSection = () => {
    if (isAnimationPlaying || isChangingSection) {
      return; // Блокируем переключение при воспроизведении анимации
    }
    goToNextSection();
  };

  return (
    <div
      className="scroll-arrows"
      style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>
      {!isFirstSection && (
        <button
          onClick={handlePrevSection}
          aria-label="Прокрутить вверх"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor:
              isAnimationPlaying || isChangingSection
                ? 'not-allowed'
                : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 3L15 10L13.6 11.4L8 5.8L2.4 11.4L1 10L8 3Z"
              fill="white"
            />
          </svg>
        </button>
      )}

      {!isLastSection && (
        <button
          onClick={handleNextSection}
          aria-label="Прокрутить вниз"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor:
              isAnimationPlaying || isChangingSection
                ? 'not-allowed'
                : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite',
          }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 13L1 6L2.4 4.6L8 10.2L13.6 4.6L15 6L8 13Z"
              fill="white"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
