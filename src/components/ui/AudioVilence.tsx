import { useUnit } from 'effector-react';
import { useEffect, useRef, useState } from 'react';
import { $volume } from '../../models/audio';

export const AudioVilence = () => {
  // Получаем состояния из глобальных сторов
  const volume = useUnit($volume);

  // Локальные состояния для анимации
  const lineHeights = [
    { min: 29.49, max: 35.51 }, // Линия 1
    { min: 24.98, max: 40.02 }, // Линия 2
    { min: 19.72, max: 45.28 }, // Линия 3
    { min: 25.4, max: 39.6 }, // Линия 4
    { min: 28.95, max: 36.05 }, // Линия 5
    { min: 31.0, max: 34.0 }, // Линия 6
  ];

  // Преобразуем диапазоны в абсолютные значения для более выраженной анимации
  const fullRangeLines = lineHeights.map((line) => {
    const range = line.max - line.min;
    return {
      min: line.min - range * 0.2, // Увеличиваем расширение диапазона (было 0.15)
      mid: (line.min + line.max) / 2,
      max: line.max + range * 0.2, // Увеличиваем расширение диапазона (было 0.15)
    };
  });

  const [currentHeights, setCurrentHeights] = useState(
    fullRangeLines.map((line) => ({
      y1: line.mid - 0.5,
      y2: line.mid + 0.5,
    })),
  );

  // Сохраняем случайные значения для каждой линии, чтобы избежать
  // мерцания при каждом обновлении кадра
  const randomFactorsRef = useRef(
    Array(lineHeights.length)
      .fill(0)
      .map(() => Math.random()),
  );

  const [isActive, setIsActive] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);

  // Эффект для управления анимацией - теперь зависит только от громкости
  useEffect(() => {
    if (volume > 0) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [volume]);

  // Эффект для генерации анимации
  useEffect(() => {
    const updateLines = () => {
      // Увеличиваем счетчик кадров
      frameCountRef.current += 1;

      if (isActive) {
        // Каждые 20 кадров обновляем случайные факторы
        if (frameCountRef.current % 20 === 0) {
          randomFactorsRef.current = randomFactorsRef.current.map(() =>
            Math.random(),
          );
        }

        // Делаем анимацию более случайной и с разными фазами для каждой линии
        setCurrentHeights(
          fullRangeLines.map((line, index) => {
            // Создаем разные фазы для каждой линии, чтобы они двигались асинхронно
            const phase = frameCountRef.current * 0.03 + index * 0.5; // Еще сильнее уменьшаем скорость (было 0.05)

            // Используем разные функции для разнообразия движения
            // Для четных и нечетных линий используем разные тригонометрические функции
            const waveValue =
              index % 2 === 0
                ? Math.sin(phase)
                : Math.cos(phase + randomFactorsRef.current[index] * Math.PI);

            // Расчет динамического диапазона, чтобы линии двигались по-разному
            // Увеличиваем случайность с помощью сохраненных случайных факторов
            const dynamicFactor = 0.25 + randomFactorsRef.current[index] * 0.6; // Больше случайности в диапазоне

            // Увеличиваем амплитуду для более высоких столбиков
            const amplitude = (line.max - line.min) * 0.3 * dynamicFactor; // Увеличиваем амплитуду (было 0.2)

            // Добавляем небольшое случайное отклонение к средней точке
            const midPointOffset = (Math.random() - 0.5) * 0.5; // Случайное смещение ±0.25
            const midPoint = line.mid + midPointOffset;

            return {
              y1: midPoint - amplitude * Math.abs(waveValue),
              y2: midPoint + amplitude * Math.abs(waveValue),
            };
          }),
        );
      } else {
        // Плавно возвращаем линии к среднему положению при выключении
        setCurrentHeights((prev) =>
          prev.map((current, idx) => {
            const line = fullRangeLines[idx];
            const targetY1 = line.mid - 0.5;
            const targetY2 = line.mid + 0.5;

            // Постепенное возвращение к исходным значениям
            return {
              y1: current.y1 + (targetY1 - current.y1) * 0.1,
              y2: current.y2 + (targetY2 - current.y2) * 0.1,
            };
          }),
        );
      }

      animationFrameRef.current = requestAnimationFrame(updateLines);
    };

    animationFrameRef.current = requestAnimationFrame(updateLines);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, fullRangeLines]);

  // Координаты X для линий (из исходного SVG)
  const linePositions = [19.01, 24.41, 29.8, 35.2, 40.59, 45.99];

  return (
    <svg
      width="65"
      height="65"
      viewBox="0 0 65 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="0.5"
        y="0.5"
        width="64"
        height="64"
        rx="32"
        fill="url(#paint0_linear_74_2619)"
        fillOpacity="0.05"
      />
      <rect
        x="0.5"
        y="0.5"
        width="64"
        height="64"
        rx="32"
        stroke="url(#paint1_linear_74_2619)"
      />

      {/* Динамические линии */}
      {currentHeights.map((height, idx) => (
        <path
          key={idx}
          d={`M${linePositions[idx]} ${height.y1}V${height.y2}`}
          stroke="url(#paint2_linear_74_2619)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'opacity 0.3s ease',
            opacity: volume > 0 ? 1 : 0.5,
          }}
        />
      ))}

      {/* Определения градиентов для заливки и обводки */}
      <defs>
        <linearGradient
          id="paint0_linear_74_2619"
          x1="65"
          y1="33.4847"
          x2="-7.7486e-06"
          y2="33.4847"
          gradientUnits="userSpaceOnUse">
          <stop offset="0.046883" stopColor="#FFFD64" />
          <stop offset="1" stopColor="#FFB901" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_74_2619"
          x1="4.62749"
          y1="-9.27224e-06"
          x2="72.9447"
          y2="16.9609"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#515150" />
          <stop offset="0.465842" stopColor="#FFFD64" />
          <stop offset="1" stopColor="#515150" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_74_2619"
          x1="31.0153"
          y1="15.7725"
          x2="31.4991"
          y2="50.2884"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBD804" />
          <stop offset="1" stopColor="#F26502" stopOpacity="0.98" />
        </linearGradient>
      </defs>
    </svg>
  );
};
