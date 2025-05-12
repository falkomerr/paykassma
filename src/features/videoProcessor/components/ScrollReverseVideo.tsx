import { useEffect, useRef, useState } from 'react';

interface ScrollReverseVideoProps {
  videoSrc: string;
  className?: string;
}

export const ScrollReverseVideo = ({
  videoSrc,
  className = '',
}: ScrollReverseVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReversed, setIsReversed] = useState(false);
  const lastScrollY = useRef(window.scrollY);
  const scrollTimeout = useRef<number | null>(null);

  // Для точного управления временем видео
  const frameRate = 30; // Предполагаемая частота кадров
  const scrollSensitivity = 0.5; // Насколько быстро видео реагирует на скролл

  useEffect(() => {
    // Обработчик скролла
    const handleScroll = () => {
      if (!videoRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Направление скролла
      const isScrollingUp = scrollDelta < 0;

      // Если направление изменилось, обновляем флаг
      if (isScrollingUp !== isReversed) {
        setIsReversed(isScrollingUp);
      }

      // Вычисляем время для перемотки с учетом направления
      const video = videoRef.current;
      const duration = video.duration || 1;
      const currentTime = video.currentTime;

      // Масштабируем дельту скролла для скорости перемотки
      // Абсолютное значение для скорости и сохранение знака для направления
      const timeChange =
        Math.abs(scrollDelta) * scrollSensitivity * (1 / frameRate);

      // При скролле вверх воспроизводим назад
      if (isScrollingUp) {
        const newTime = Math.max(0, currentTime - timeChange);
        video.currentTime = newTime;
      }
      // При скролле вниз воспроизводим вперед
      else {
        const newTime = Math.min(duration, currentTime + timeChange);
        video.currentTime = newTime;
      }

      // Сохраняем текущую позицию скролла
      lastScrollY.current = currentScrollY;

      // Сбрасываем таймер и устанавливаем новый
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }

      // Если скролл прекратится, ставим видео на паузу
      scrollTimeout.current = window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }, 150) as unknown as number; // setTimeout возвращает NodeJS.Timeout в некоторых типах
    };

    // Обработчик загрузки видео
    const handleVideoLoad = () => {
      if (videoRef.current) {
        // При загрузке видео ставим его на паузу
        videoRef.current.pause();
      }
    };

    // Добавляем обработчики событий
    window.addEventListener('scroll', handleScroll, { passive: true });
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('loadeddata', handleVideoLoad);
    }

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (videoElement) {
        videoElement.removeEventListener('loadeddata', handleVideoLoad);
      }
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
    };
  }, [isReversed]);

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        src={videoSrc}
        className={`w-full ${className}`}
        muted
        playsInline
        loop
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-black/60 px-4 py-2 text-white">
          {isReversed
            ? 'Скролл вверх: реверс видео'
            : 'Скролл вниз: обычное воспроизведение'}
        </div>
      </div>
    </div>
  );
};
