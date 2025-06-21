import { MONEY_BACKWARD_ID, MONEY_FORWARD_ID } from '@/constants';
import { $sections } from '@/models/journey';
import { createEffect, createEvent, createStore, sample } from 'effector';

const SECTION_TIMECODES: Record<string, { start: number; end: number }> = {
  1: { start: 0, end: 3.58 },
  2: { start: 3.58, end: 5.58 },
  3: { start: 5.733, end: 8.5 },
};

const REVERSED_TIMECODES: Record<string, { start: number; end: number }> = {
  1: { start: 2.767, end: 4.4 },
  2: { start: 0, end: 2.8 },
};

export const moneyTimeUpdated = createEvent<number>();
export const moneyVideoElementMounted = createEvent();
export const sectionChanged = createEvent<number>();
export const prevSectionChanged = createEvent();
export const nextSectionChanged = createEvent();
export const exitSectionChanged = createEvent();
export const animationStarted = createEvent();
export const animationEnded = createEvent();

export const $moneyVideoMode = createStore<'forward' | 'backward'>('forward');
$moneyVideoMode.on(exitSectionChanged, () => 'forward');
$moneyVideoMode.on(nextSectionChanged, () => 'forward');
$moneyVideoMode.on(prevSectionChanged, () => 'backward');
export const $currentSection = createStore<number>(0);
$currentSection.on(exitSectionChanged, () => 0);

export const $animationPlaying = createStore<boolean>(false);
$animationPlaying.on(animationStarted, () => true);
$animationPlaying.on(animationEnded, () => false);
$animationPlaying.on(exitSectionChanged, () => false);
export const $moneyVideoElements = createStore<{
  forward: HTMLVideoElement | null;
  backward: HTMLVideoElement | null;
}>({
  forward: null,
  backward: null,
});

export const linkVideoElementFx = createEffect(() => ({
  forward: document.getElementById(MONEY_FORWARD_ID) as HTMLVideoElement,
  backward: document.getElementById(MONEY_BACKWARD_ID) as HTMLVideoElement,
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
  clock: sectionChanged,
  target: $currentSection,
});

sample({
  clock: moneyVideoElementMounted,
  target: linkVideoElementFx,
});

sample({
  clock: linkVideoElementFx.doneData,
  target: $moneyVideoElements,
});

sample({
  clock: [sectionChanged, linkVideoElementFx.doneData],
  source: {
    videoElements: $moneyVideoElements,
    activeSection: $currentSection,
    videoMode: $moneyVideoMode,
    sections: $sections,
  },
  filter: ({ videoMode }) => videoMode === 'forward',
  fn: ({ videoElements, activeSection, videoMode }) => ({
    videoElements,
    videoMode,
    timecode: SECTION_TIMECODES[activeSection + 1],
  }),
  target: [playVideoTimecodeFx, animationStarted],
});

sample({
  clock: [sectionChanged],
  source: {
    videoElements: $moneyVideoElements,
    activeSection: $currentSection,
    videoMode: $moneyVideoMode,
    sections: $sections,
  },
  filter: ({ videoMode }) => videoMode === 'backward',
  fn: ({ videoElements, activeSection, videoMode }) => ({
    videoElements,
    videoMode,
    timecode: REVERSED_TIMECODES[activeSection + 1],
  }),
  target: [playVideoTimecodeFx, animationStarted],
});

sample({
  clock: moneyTimeUpdated,
  source: {
    activeSection: $currentSection,
    videoElements: $moneyVideoElements,
    videoMode: $moneyVideoMode,
  },
  filter: (src, time) => {
    const timecode =
      src.videoMode === 'forward'
        ? SECTION_TIMECODES[src.activeSection + 1]
        : REVERSED_TIMECODES[src.activeSection + 1];

    return !(time >= timecode.start && time < timecode.end);
  },
  fn: ({ videoElements }) => ({ videoElements }),
  target: [stopVideoFx, animationEnded],
});
