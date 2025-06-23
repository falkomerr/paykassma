import { TRAFFICS_BACKWARD_ID, TRAFFICS_FORWARD_ID } from '@/constants';
import {
  $previousActiveSection,
  $sections,
  goToNextSection,
  goToPrevSection,
  animationEnded as journeyAnimationEnded,
} from '@/models/journey';
import { $videoMode as $journeyVideoMode } from '@/models/video';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { debounce } from 'patronum/debounce';

const SECTION_TIMECODES: Record<string, { start: number; end: number }> = {
  0: { start: 0, end: 3.4 },
  1: { start: 3.4, end: 9.68 },
};

const REVERSED_TIMECODES: Record<string, { start: number; end: number }> = {
  0: { start: 6.68, end: 9.91 },
  1: { start: 0, end: 6.68 },
};

export const trafficsTimeUpdated = createEvent<number>();
export const trafficsVideoElementMounted = createEvent();
export const prevtrafficSectionChanged = createEvent();
export const nextraffictSectionChanged = createEvent();
export const animationStarted = createEvent();
export const animationEnded = createEvent();
export const handleScroll = createEvent<{
  direction: 'forward' | 'backward';
}>();

export const $videoMode = createStore<'forward' | 'backward'>('forward');
$videoMode.on(debounce(handleScroll, 500), (_, { direction }) => direction);

sample({
  clock: $journeyVideoMode,
  target: $videoMode,
});

export const $currentSection = createStore<number>(-1);

sample({
  clock: $journeyVideoMode.updates,
  source: { $previousActiveSection, $journeyVideoMode },
  filter: (src) =>
    src.$journeyVideoMode === 'backward' &&
    src.$previousActiveSection === 'section9',
  fn: () => 1,
  target: [$currentSection, animationEnded],
});

sample({
  clock: nextraffictSectionChanged,
  source: $currentSection,
  fn: (src) => src + 1,
  target: $currentSection,
});

sample({
  clock: prevtrafficSectionChanged,
  source: $currentSection,
  fn: (src) => src - 1,
  target: $currentSection,
});

export const $animationPlaying = createStore<boolean>(false);
$animationPlaying.on(animationStarted, () => true);
$animationPlaying.on(animationEnded, () => false);

export const $trafficsVideoElements = createStore<{
  forward: HTMLVideoElement | null;
  backward: HTMLVideoElement | null;
}>({
  forward: null,
  backward: null,
});

export const linkVideoElementFx = createEffect(() => ({
  forward: document.getElementById(TRAFFICS_FORWARD_ID) as HTMLVideoElement,
  backward: document.getElementById(TRAFFICS_BACKWARD_ID) as HTMLVideoElement,
}));

export const stopVideoFx = createEffect(
  ({
    videoElements,
  }: {
    videoElements: {
      forward: HTMLVideoElement | null;
      backward: HTMLVideoElement | null;
    };
  }) => {
    if (videoElements.forward && videoElements.backward) {
      videoElements.forward.pause();
      videoElements.backward.pause();
    }
  },
);

export const playVideoTimecodeFx = createEffect(
  ({
    videoElements,
    timecode,
    videoMode,
  }: {
    videoElements: {
      forward: HTMLVideoElement | null;
      backward: HTMLVideoElement | null;
    };
    videoMode: 'forward' | 'backward';
    timecode: { start: number; end: number };
  }) => {
    if (
      videoMode === 'backward' &&
      videoElements.backward &&
      videoElements.forward
    ) {
      videoElements.backward.currentTime = timecode.start;

      setTimeout(() => {
        if (!videoElements.backward || !videoElements.forward) return;
        videoElements.backward.hidden = false;
        videoElements.forward.hidden = true;
        videoElements.backward.play();
      }, 400);
    } else if (
      videoMode === 'forward' &&
      videoElements.forward &&
      videoElements.backward
    ) {
      videoElements.forward.currentTime = timecode.start;

      if (timecode.start === 0) {
        videoElements.forward.hidden = false;
        videoElements.backward.hidden = true;
        videoElements.forward.play();
      } else {
        setTimeout(() => {
          if (!videoElements.forward || !videoElements.backward) return;
          videoElements.forward.hidden = false;
          videoElements.backward.hidden = true;
          videoElements.forward.play();
        }, 400);
      }
    }
  },
);

sample({
  clock: trafficsVideoElementMounted,
  target: linkVideoElementFx,
});

sample({
  clock: linkVideoElementFx.doneData,
  target: $trafficsVideoElements,
});

sample({
  clock: [$currentSection.updates],
  source: {
    videoElements: $trafficsVideoElements,
    activeSection: $currentSection,
    videoMode: $videoMode,
    sections: $sections,
    isAnimationPlaying: $animationPlaying,
  },
  filter: ({ videoMode, isAnimationPlaying }) =>
    videoMode === 'forward' && isAnimationPlaying === false,
  fn: ({ videoElements, activeSection, videoMode }) => ({
    videoElements,
    videoMode,
    timecode: SECTION_TIMECODES[activeSection],
  }),
  target: [playVideoTimecodeFx, animationStarted],
});

sample({
  clock: [$currentSection.updates],
  source: {
    videoElements: $trafficsVideoElements,
    activeSection: $currentSection,
    videoMode: $videoMode,
    sections: $sections,
    isAnimationPlaying: $animationPlaying,
  },
  filter: ({ videoMode, isAnimationPlaying }) =>
    videoMode === 'backward' && isAnimationPlaying === false,
  fn: ({ videoElements, activeSection, videoMode }) => ({
    videoElements,
    videoMode,
    timecode: REVERSED_TIMECODES[activeSection + 1],
  }),

  target: [playVideoTimecodeFx, animationStarted],
});

sample({
  clock: trafficsTimeUpdated,
  source: {
    activeSection: $currentSection,
    videoElements: $trafficsVideoElements,
    videoMode: $videoMode,
  },
  filter: (src, time) => {
    const timecode =
      src.videoMode === 'forward'
        ? SECTION_TIMECODES[src.activeSection]
        : REVERSED_TIMECODES[src.activeSection + 1];

    return !(time >= timecode.start && time < timecode.end);
  },
  fn: ({ videoElements }) => ({ videoElements }),
  target: [stopVideoFx, animationEnded],
});

sample({
  clock: animationEnded,
  source: { $videoMode, $currentSection, $animationPlaying },
  filter: ({ $videoMode, $currentSection }) =>
    $videoMode === 'forward' && $currentSection === 1,
  target: [goToNextSection, journeyAnimationEnded],
});

sample({
  clock: animationEnded,
  source: { $videoMode, $currentSection },
  filter: ({ $videoMode, $currentSection }) =>
    $videoMode === 'backward' && $currentSection === 0,
  target: [goToPrevSection, journeyAnimationEnded],
});

sample({
  clock: debounce(handleScroll, 500),
  source: { $videoMode, $currentSection, $animationPlaying },
  filter: ({ $videoMode, $currentSection, $animationPlaying }) =>
    $videoMode === 'forward' &&
    $currentSection === 1 &&
    $animationPlaying === false,
  target: [goToNextSection],
});

sample({
  clock: debounce(handleScroll, 500),
  source: { $videoMode, $currentSection, $animationPlaying },
  filter: ({ $videoMode, $currentSection, $animationPlaying }) =>
    $videoMode === 'backward' &&
    $currentSection === 0 &&
    $animationPlaying === false,
  target: [goToPrevSection],
});

sample({
  clock: debounce(handleScroll, 500),
  source: { $videoMode, $currentSection, $animationPlaying },
  filter: ({ $videoMode, $currentSection, $animationPlaying }) =>
    $videoMode === 'forward' &&
    $currentSection <= 0 &&
    $animationPlaying === false,
  target: [nextraffictSectionChanged],
});

sample({
  clock: debounce(handleScroll, 500),
  source: { $videoMode, $currentSection, $animationPlaying },
  filter: ({ $videoMode, $currentSection, $animationPlaying }) =>
    $videoMode === 'backward' &&
    $currentSection >= 1 &&
    $animationPlaying === false,
  target: [prevtrafficSectionChanged],
});
