import {
  createEffect,
  createEvent,
  createStore,
  sample,
  Store,
} from 'effector';
import { playGateAudio } from './audio';

function previous<T>($store: Store<T>) {
  const $stack = createStore([$store.defaultState]);

  sample({
    clock: $store,
    source: $stack,
    fn: ([current], value) => [value, current],
    target: $stack,
  });

  return $stack.map((values) => values[1]) as Store<T>;
}

// События для смены секций
export const sectionChanged = createEvent<string>();
export const goToNextSection = createEvent();
export const goToPrevSection = createEvent();
export const scrollToSection = createEvent<string>();
export const animationPlayed = createEvent();
export const animationEnded = createEvent();
export const initSections = createEvent();
export const gateOpened = createEvent();
export const $animationPlaying = createStore(false);
export const $gateOpened = createStore(false);

export const blockChangeSectionEnabled = createEvent();
export const blockChangeSectionDisabled = createEvent();

export const $blockChangeSection = createStore(false);

$blockChangeSection.on(blockChangeSectionEnabled, () => true);
$blockChangeSection.on(blockChangeSectionDisabled, () => false);

export const ANIMATED_SECTIONS = [
  'section1',
  'section2',
  'section3',
  'section4',
  'section5',
];

// Константа для всех задержек, чтобы они были согласованы
export const SECTION_TRANSITION_DELAY = 800; // мс
// Минимальная задержка между переключениями для НЕ-анимированных секций
export const NON_ANIMATED_TRANSITION_DELAY = 400; // мс

// Эффекты для переключения секций
export const changeSectionFx = createEffect(async (sectionId: string) => {
  // Проверяем, является ли секция анимированной
  const isAnimatedSection = ANIMATED_SECTIONS.includes(sectionId);
  const delay = isAnimatedSection
    ? SECTION_TRANSITION_DELAY
    : NON_ANIMATED_TRANSITION_DELAY;

  // Имитируем задержку для анимаций или просто для стабильности переключения
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delay);
  });
});

// Блокировщик для предотвращения частых переключений
export const $isChangingSection = createStore(false)
  .on(changeSectionFx, () => true)
  .on(changeSectionFx.done, () => false)
  .on(changeSectionFx.fail, () => false);

// Список всех секций
export const $sections = createStore<string[]>([
  'section1',
  'section2',
  'section3',
  'section4',
  'section5',
  'section6',
  'section7',
  'section8',
  'section9',
  'section10',
]);

// Текущая активная секция
export const $activeSection = createStore('section1').on(
  sectionChanged,
  (_, sectionId) => sectionId,
);

export const $previousActiveSection = previous($activeSection);

sample({
  clock: gateOpened,
  fn: () => true,
  target: [$gateOpened, playGateAudio],
});

sample({
  clock: goToNextSection,
  source: {
    block: $blockChangeSection,
    sections: $sections,
    activeSection: $activeSection,
    isChanging: $isChangingSection,
    animationPlaying: $animationPlaying,
  },
  filter: ({
    block,
    isChanging,
    animationPlaying,
    sections,
    activeSection,
  }) => {
    const currentIndex = sections.indexOf(activeSection);
    const isLastSection = currentIndex === sections.length - 1;
    const isAnimatedSection = ANIMATED_SECTIONS.includes(activeSection);

    // Не выполняем действие, если секция меняется или мы на последней секции
    // Проверяем animationPlaying только если текущая секция анимированная
    return (
      !isChanging &&
      !(isAnimatedSection && animationPlaying) &&
      !isLastSection &&
      !block
    );
  },
  fn: ({ sections, activeSection }) => {
    const currentIndex = sections.indexOf(activeSection);
    return sections[currentIndex + 1];
  },
  target: scrollToSection,
});

sample({
  clock: goToPrevSection,
  source: {
    block: $blockChangeSection,
    sections: $sections,
    activeSection: $activeSection,
    isChanging: $isChangingSection,
    animationPlaying: $animationPlaying,
  },
  filter: ({
    block,
    isChanging,
    animationPlaying,
    sections,
    activeSection,
  }) => {
    const currentIndex = sections.indexOf(activeSection);
    const isFirstSection = currentIndex === 0;
    const isAnimatedSection = ANIMATED_SECTIONS.includes(activeSection);

    // Не выполняем действие, если секция меняется или мы на первой секции
    // Проверяем animationPlaying только если текущая секция анимированная
    return (
      !isChanging &&
      !(isAnimatedSection && animationPlaying) &&
      !isFirstSection &&
      !block
    );
  },
  fn: ({ sections, activeSection }) => {
    const currentIndex = sections.indexOf(activeSection);
    return sections[currentIndex - 1];
  },
  target: scrollToSection,
});

// Переключение на конкретную секцию
sample({
  clock: scrollToSection,
  source: {
    isChanging: $isChangingSection,
    animationPlaying: $animationPlaying,
    activeSection: $activeSection,
  },
  filter: ({ isChanging, animationPlaying, activeSection }) => {
    const isAnimatedSection = ANIMATED_SECTIONS.includes(activeSection);
    return !isChanging && !(isAnimatedSection && animationPlaying);
  },
  fn: (_, sectionId) => sectionId,
  target: [changeSectionFx, sectionChanged],
});

// Инициализация обработчиков событий
export const initJourneyFx = createEffect(() => {
  if ($blockChangeSection.getState()) return;

  // Переменная для дебаунса событий прокрутки
  let wheelDelayTimer: ReturnType<typeof setTimeout> | null = null;
  let isWheelHandled = false;
  // Переменная для накопления прокрутки от тачпада
  let accumulatedDelta = 0;
  const DELTA_THRESHOLD = 50; // Порог для события прокрутки
  // Идентификатор последнего действия для предотвращения множественных переключений
  let lastActionTime = 0;
  const MIN_ACTION_INTERVAL = SECTION_TRANSITION_DELAY; // Используем общую константу
  // Переменная для отслеживания, находимся ли мы в процессе прокрутки
  let isScrolling = false;

  // Переменные для отслеживания сенсорных событий (для мобильных устройств)
  let touchStartY = 0;
  let touchEndY = 0;
  const TOUCH_THRESHOLD = 80; // Порог для определения свайпа (в пикселях)
  let isTouchHandled = false;

  // Обработчик колесика мыши
  const handleWheel = (e: WheelEvent) => {
    if (e.deltaX !== 0) return;
    console.log('handleWheel');
    e.preventDefault();

    const now = Date.now();
    const activeSection = $activeSection.getState();
    const isAnimatedSection = ANIMATED_SECTIONS.includes(activeSection);

    // Проверяем, не заблокирована ли смена секций, не находимся ли в процессе прокрутки,
    // и достаточно ли времени прошло с последнего действия
    if (
      $isChangingSection.getState() ||
      (isAnimatedSection && $animationPlaying.getState()) ||
      isWheelHandled ||
      now - lastActionTime < MIN_ACTION_INTERVAL ||
      isScrolling
    )
      return;

    const sections = $sections.getState();
    const currentIndex = sections.indexOf(activeSection);
    const isFirstSection = currentIndex === 0;
    const isLastSection = currentIndex === sections.length - 1;

    // Аккумулируем дельту прокрутки (особенно важно для тачпада)
    accumulatedDelta += e.deltaY;

    // Сбрасываем накопленную дельту через задержку
    if (wheelDelayTimer) {
      clearTimeout(wheelDelayTimer);
    }

    wheelDelayTimer = setTimeout(() => {
      accumulatedDelta = 0;
      isWheelHandled = false;
      isScrolling = false;
    }, 150); // Короткая задержка для сброса накопленной дельты

    // Проверяем только направление скроллинга и возможность перехода,
    // используя накопленную дельту прокрутки для предотвращения случайных скроллов
    if (
      accumulatedDelta > DELTA_THRESHOLD &&
      !isLastSection &&
      !isWheelHandled
    ) {
      // Устанавливаем флаг обработки и прокрутки только если можно выполнить переход
      isWheelHandled = true;
      isScrolling = true;
      // Записываем время действия
      lastActionTime = now;
      // Сбрасываем накопленную дельту
      accumulatedDelta = 0;
      goToNextSection();
    } else if (
      accumulatedDelta < -DELTA_THRESHOLD &&
      !isFirstSection &&
      !isWheelHandled
    ) {
      // Устанавливаем флаг обработки и прокрутки только если можно выполнить переход
      isWheelHandled = true;
      isScrolling = true;
      // Записываем время действия
      lastActionTime = now;
      // Сбрасываем накопленную дельту
      accumulatedDelta = 0;
      goToPrevSection();
    }
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e: KeyboardEvent) => {
    const now = Date.now();
    const activeSection = $activeSection.getState();
    const isAnimatedSection = ANIMATED_SECTIONS.includes(activeSection);

    // Проверяем, не заблокировано ли переключение
    // и достаточно ли времени прошло с последнего действия
    // Проверяем animationPlaying только если текущая секция анимированная
    if (
      $isChangingSection.getState() ||
      (isAnimatedSection && $animationPlaying.getState()) ||
      now - lastActionTime < MIN_ACTION_INTERVAL
    )
      return;

    const sections = $sections.getState();
    const currentIndex = sections.indexOf(activeSection);
    const isFirstSection = currentIndex === 0;
    const isLastSection = currentIndex === sections.length - 1;

    if (e.key === 'ArrowDown' && !isLastSection) {
      e.preventDefault();
      goToNextSection();
      // Записываем время действия
      lastActionTime = now;
    } else if (e.key === 'ArrowUp' && !isFirstSection) {
      e.preventDefault();
      goToPrevSection();
      // Записываем время действия
      lastActionTime = now;
    }
  };

  // Обработчик начала касания (для мобильных устройств)
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0].clientY;
    isTouchHandled = false;
  };

  // Обработчик перемещения при касании
  const handleTouchMove = (e: TouchEvent) => {
    // Предотвращаем стандартный скролл страницы
    e.preventDefault();
  };

  // Обработчик завершения касания
  const handleTouchEnd = (e: TouchEvent) => {
    const now = Date.now();
    const activeSection = $activeSection.getState();
    const isAnimatedSection = ANIMATED_SECTIONS.includes(activeSection);

    touchEndY = e.changedTouches[0].clientY;

    // Проверяем, можно ли выполнить переход между секциями
    if (
      $isChangingSection.getState() ||
      (isAnimatedSection && $animationPlaying.getState()) ||
      isTouchHandled ||
      now - lastActionTime < MIN_ACTION_INTERVAL ||
      isScrolling
    )
      return;

    const sections = $sections.getState();
    const currentIndex = sections.indexOf(activeSection);
    const isFirstSection = currentIndex === 0;
    const isLastSection = currentIndex === sections.length - 1;

    // Определяем направление свайпа и его силу
    const touchDelta = touchStartY - touchEndY;

    // Свайп вниз (для перехода к предыдущей секции)
    if (touchDelta < -TOUCH_THRESHOLD && !isFirstSection && !isTouchHandled) {
      isTouchHandled = true;
      isScrolling = true;
      lastActionTime = now;
      goToPrevSection();
    }
    // Свайп вверх (для перехода к следующей секции)
    else if (
      touchDelta > TOUCH_THRESHOLD &&
      !isLastSection &&
      !isTouchHandled
    ) {
      isTouchHandled = true;
      isScrolling = true;
      lastActionTime = now;
      goToNextSection();
    }
  };

  // Отключение стандартной прокрутки
  document.body.style.overflow = 'hidden';

  // Добавление обработчиков событий
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeyDown);

  // Добавление обработчиков сенсорных событий для мобильных устройств
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Добавляем подписку на изменение активной секции для сброса флага прокрутки
  const unsubscribe = $activeSection.watch(() => {
    // Сбрасываем флаг прокрутки с задержкой
    setTimeout(() => {
      isScrolling = false;
      accumulatedDelta = 0; // Также сбрасываем накопленную дельту
      isTouchHandled = false; // Сбрасываем флаг обработки сенсорных событий
    }, 100);
  });

  // Возвращаем функцию очистки
  return () => {
    document.body.style.overflow = '';
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
    unsubscribe(); // Отписываемся от $activeSection
    if (wheelDelayTimer) {
      clearTimeout(wheelDelayTimer);
    }
  };
});

// Инициализация при монтировании приложения
sample({
  clock: initSections,
  target: initJourneyFx,
});

// Устанавливаем первую секцию как активную при инициализации сразу
sample({
  clock: initSections,
  fn: () => 'section1',
  target: sectionChanged,
});

sample({
  clock: animationPlayed,
  fn: () => true,
  target: $animationPlaying,
});

sample({
  clock: animationEnded,
  fn: () => false,
  target: $animationPlaying,
});
