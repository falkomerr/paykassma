import { createEffect, createEvent, createStore, sample } from 'effector';
import { reset } from 'patronum';

type Journey =
  | 'start'
  | 'chapter1'
  | 'chapter2'
  | 'chapter3'
  | 'chapter4'
  | 'chapter5';

export const jorneyReseted = createEvent();
export const journeyStarted = createEvent();
export const chapter2Started = createEvent();
export const chapter3Started = createEvent();
export const chapter4Started = createEvent();
export const chapter5Started = createEvent();

export const $journey = createStore<Journey>('start');

reset({
  clock: jorneyReseted,
  target: $journey,
});

sample({
  clock: journeyStarted,
  fn: () => 'chapter1' as const,
  target: $journey,
});

sample({
  clock: chapter2Started,
  fn: () => 'chapter2' as const,
  target: $journey,
});

sample({
  clock: chapter3Started,
  fn: () => 'chapter3' as const,
  target: $journey,
});

sample({
  clock: chapter4Started,
  fn: () => 'chapter4' as const,
  target: $journey,
});

sample({
  clock: chapter5Started,
  fn: () => 'chapter5' as const,
  target: $journey,
});

// События для смены секций
export const sectionChanged = createEvent<string>();
export const goToNextSection = createEvent();
export const goToPrevSection = createEvent();
export const scrollToSection = createEvent<string>();
export const animationPlayed = createEvent();
export const animationEnded = createEvent();
export const initSections = createEvent();
export const gateOpened = createEvent();
export const initGateAudio = createEvent();
export const $animationPlaying = createStore(false);
export const $gateOpened = createStore(false);

// Константа для всех задержек, чтобы они были согласованы
export const SECTION_TRANSITION_DELAY = 800; // мс

// Эффекты для переключения секций
export const changeSectionFx = createEffect(async () => {
  // Удаляем обновление URL - больше не сохраняем текущую секцию

  // Имитируем задержку для анимаций
  return new Promise<void>((resolve) => {
    setTimeout(resolve, SECTION_TRANSITION_DELAY);
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
]);
export const $gateAudioElement = createStore<HTMLAudioElement | null>(null);

// Текущая активная секция
export const $activeSection = createStore('section1').on(
  sectionChanged,
  (_, sectionId) => sectionId,
);

export const playFx = createEffect((audio: HTMLAudioElement) => {
  audio.play();
});

//Audio
sample({
  clock: initGateAudio,
  fn: () => new Audio('/gate.mp3'),
  target: $gateAudioElement,
});

sample({
  clock: gateOpened,
  fn: () => true,
  target: $gateOpened,
});

sample({
  clock: gateOpened,
  source: $gateAudioElement,
  filter: Boolean,
  target: playFx,
});

// Обработка перехода к следующей секции
sample({
  clock: goToNextSection,
  source: {
    sections: $sections,
    activeSection: $activeSection,
    isChanging: $isChangingSection,
    animationPlaying: $animationPlaying,
  },
  filter: ({ isChanging, animationPlaying, sections, activeSection }) => {
    const currentIndex = sections.indexOf(activeSection);
    const isLastSection = currentIndex === sections.length - 1;
    // Не выполняем действие, если анимация играет, секция меняется или мы на последней секции
    return !isChanging && !animationPlaying && !isLastSection;
  },
  fn: ({ sections, activeSection }) => {
    const currentIndex = sections.indexOf(activeSection);
    return sections[currentIndex + 1];
  },
  target: scrollToSection,
});

// Обработка перехода к предыдущей секции
sample({
  clock: goToPrevSection,
  source: {
    sections: $sections,
    activeSection: $activeSection,
    isChanging: $isChangingSection,
    animationPlaying: $animationPlaying,
  },
  filter: ({ isChanging, animationPlaying, sections, activeSection }) => {
    const currentIndex = sections.indexOf(activeSection);
    const isFirstSection = currentIndex === 0;
    // Не выполняем действие, если анимация играет, секция меняется или мы на первой секции
    return !isChanging && !animationPlaying && !isFirstSection;
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
  },
  filter: ({ isChanging, animationPlaying }) =>
    !isChanging && !animationPlaying,
  fn: (_, sectionId) => sectionId,
  target: [changeSectionFx, sectionChanged],
});

// Эффект для установки класса active у текущей секции
export const updateActiveSectionClassFx = createEffect((sectionId: string) => {
  const sections = document.querySelectorAll('.section');
  sections.forEach((section) => {
    if (section.id === sectionId) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });
});

// Обновление классов при изменении активной секции
$activeSection.watch(updateActiveSectionClassFx);

// Инициализация обработчиков событий
export const initJourneyFx = createEffect(() => {
  // Переменная для дебаунса событий прокрутки
  let wheelDelayTimer: ReturnType<typeof setTimeout> | null = null;
  let isWheelHandled = false;
  // Идентификатор последнего действия для предотвращения множественных переключений
  let lastActionTime = 0;
  const MIN_ACTION_INTERVAL = SECTION_TRANSITION_DELAY; // Используем общую константу
  // Переменная для отслеживания, находимся ли мы в процессе прокрутки
  let isScrolling = false;

  // Обработчик колесика мыши
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    const now = Date.now();

    // Проверяем, не заблокирована ли смена секций, не находимся ли в процессе прокрутки,
    // и достаточно ли времени прошло с последнего действия
    if (
      $isChangingSection.getState() ||
      $animationPlaying.getState() ||
      isWheelHandled ||
      now - lastActionTime < MIN_ACTION_INTERVAL ||
      isScrolling
    )
      return;

    const activeSection = $activeSection.getState();
    const sections = $sections.getState();
    const currentIndex = sections.indexOf(activeSection);
    const isFirstSection = currentIndex === 0;
    const isLastSection = currentIndex === sections.length - 1;

    // Проверяем только направление скроллинга и возможность перехода
    if (e.deltaY > 0 && !isLastSection) {
      // Устанавливаем флаг обработки и прокрутки только если можно выполнить переход
      isWheelHandled = true;
      isScrolling = true;
      // Записываем время действия
      lastActionTime = now;
      goToNextSection();
    } else if (e.deltaY < 0 && !isFirstSection) {
      // Устанавливаем флаг обработки и прокрутки только если можно выполнить переход
      isWheelHandled = true;
      isScrolling = true;
      // Записываем время действия
      lastActionTime = now;
      goToPrevSection();
    }

    // Сбрасываем флаг обработки через задержку только если он был установлен
    if (isWheelHandled && wheelDelayTimer) {
      clearTimeout(wheelDelayTimer);
    }

    if (isWheelHandled) {
      wheelDelayTimer = setTimeout(() => {
        isWheelHandled = false;
        isScrolling = false;
      }, MIN_ACTION_INTERVAL); // Используем константу для согласованности
    }
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e: KeyboardEvent) => {
    const now = Date.now();

    // Проверяем, не заблокировано ли переключение
    // и достаточно ли времени прошло с последнего действия
    if (
      $isChangingSection.getState() ||
      $animationPlaying.getState() ||
      now - lastActionTime < MIN_ACTION_INTERVAL
    )
      return;

    const activeSection = $activeSection.getState();
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

  // Отключение стандартной прокрутки
  document.body.style.overflow = 'hidden';

  // Добавление обработчиков событий
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeyDown);

  // Всегда устанавливаем первую секцию как активную при инициализации
  setTimeout(() => {
    sectionChanged('section1');
  }, 100);

  // Сразу устанавливаем классы для первой секции
  updateActiveSectionClassFx('section1');

  // Добавляем подписку на изменение активной секции для сброса флага прокрутки
  const unsubscribe = $activeSection.watch(() => {
    // Сбрасываем флаг прокрутки с задержкой
    setTimeout(() => {
      isScrolling = false;
    }, 100);
  });

  // Возвращаем функцию очистки
  return () => {
    document.body.style.overflow = '';
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('keydown', handleKeyDown);
    unsubscribe(); // Отписываемся от $activeSection
    if (wheelDelayTimer) {
      clearTimeout(wheelDelayTimer);
    }
  };
});

// Явно активируем первую секцию сразу после инициализации
sample({
  clock: initSections,
  fn: () => 'section1',
  target: [sectionChanged, updateActiveSectionClassFx],
});

// Инициализация при монтировании приложения
sample({
  clock: initSections,
  target: initJourneyFx,
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
