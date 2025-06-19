import { TRAFFICS_BACKWARD_ID, TRAFFICS_FORWARD_ID } from '@/constants';
import { $sections } from '@/models/journey';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { $videoMode } from './video';

const SECTION_TIMECODES: Record<string, { start: number; end: number }> = {
  1: { start: 0, end: 3.4 },
  2: { start: 3.4, end: 9.68 },
};

const REVERSED_TIMECODES: Record<string, { start: number; end: number }> = {
  1: { start: 6.68, end: 9.91 },
  2: { start: 0, end: 6.68 },
};

export const trafficsTimeUpdated = createEvent<number>();
export const trafficsVideoElementMounted = createEvent();
export const prevtrafficSectionChanged = createEvent();
export const nextraffictSectionChanged = createEvent();
export const animationStarted = createEvent();
export const animationEnded = createEvent();

export const $currentSection = createStore<number>(-1);

sample({
  clock: nextraffictSectionChanged,
  fn: () => 1,
  target: $currentSection,
});

sample({
  clock: prevtrafficSectionChanged,
  fn: () => 0,
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
  clock: [$currentSection.updates, linkVideoElementFx.doneData],
  source: {
    videoElements: $trafficsVideoElements,
    activeSection: $currentSection,
    videoMode: $videoMode,
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
  clock: [$currentSection.updates],
  source: {
    videoElements: $trafficsVideoElements,
    activeSection: $currentSection,
    videoMode: $videoMode,
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
  clock: trafficsTimeUpdated,
  source: {
    activeSection: $currentSection,
    videoElements: $trafficsVideoElements,
    videoMode: $videoMode,
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

$currentSection.watch((section) => {
  console.log('sectionst', section);
});
