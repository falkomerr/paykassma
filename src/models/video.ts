import { VIDEO_BACKWARD_ID, VIDEO_FORWARD_ID } from '@/constants';
import {
  $activeSection,
  $animationPlaying,
  $blockChangeSection,
  $previousActiveSection,
  $sections,
  animationEnded,
  animationPlayed,
  gateOpened,
  goToNextSection,
  goToPrevSection,
} from '@/models/journey';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { combineEvents } from 'patronum';

const SECTION_TIMECODES: Record<string, { start: number; end: number }> = {
  section1: { start: 0, end: 4.8 },
  section2: { start: 5, end: 10.8 },
  section3: { start: 10.8, end: 16.5 },
  section4: { start: 16.7, end: 22.9 },
  section5: { start: 23.067, end: 27.5 },
};

const REVERSED_TIMECODES: Record<string, { start: number; end: number }> = {
  section2: { start: 16.79, end: 22.81 },
  section3: { start: 11, end: 16.79 },
  section4: { start: 4.67, end: 11 },
  section5: { start: 0, end: 4.67 },
};

export const timeUpdated = createEvent<number>();
export const videoElementMounted = createEvent();

export const $videoMode = createStore<'forward' | 'backward'>('forward');
$videoMode.on(goToNextSection, () => 'forward');
$videoMode.on(goToPrevSection, () => 'backward');

export const $videoElements = createStore<{
  forward: HTMLVideoElement | null;
  backward: HTMLVideoElement | null;
}>({
  forward: null,
  backward: null,
});

export const linkVideoElementFx = createEffect(() => ({
  forward: document.getElementById(VIDEO_FORWARD_ID) as HTMLVideoElement,
  backward: document.getElementById(VIDEO_BACKWARD_ID) as HTMLVideoElement,
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
    //TODO: test
    if (window.location.pathname.includes('test')) {
      videoElements.forward!.playbackRate = 10;
      videoElements.backward!.playbackRate = 10;
    }

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
      }, 500);
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
  clock: videoElementMounted,
  target: linkVideoElementFx,
});

sample({
  clock: linkVideoElementFx.doneData,
  target: $videoElements,
});

sample({
  clock: [
    goToNextSection,
    combineEvents([linkVideoElementFx.doneData, gateOpened]),
  ],
  source: {
    videoElements: $videoElements,
    isAnimationPlaying: $animationPlaying,
    activeSection: $activeSection,
    videoMode: $videoMode,
    sections: $sections,
    blockChangeSection: $blockChangeSection,
    previousActiveSection: $previousActiveSection,
    activeSectionIndex: $activeSection.map((section) =>
      parseInt(section?.split('section')[1] ?? '100'),
    ),
  },
  filter: ({
    isAnimationPlaying,
    previousActiveSection,
    videoMode,
    blockChangeSection,
    activeSectionIndex,
  }) =>
    !isAnimationPlaying &&
    previousActiveSection !== 'section6' &&
    !(activeSectionIndex > 5) &&
    videoMode === 'forward' &&
    !blockChangeSection,
  fn: ({ videoElements, activeSection, videoMode }) => ({
    videoElements,
    videoMode,
    timecode: SECTION_TIMECODES[activeSection],
  }),
  target: [playVideoTimecodeFx, animationPlayed],
});

sample({
  clock: goToPrevSection,
  source: {
    videoElements: $videoElements,
    activeSection: $activeSection,
    isAnimationPlaying: $animationPlaying,
    blockChangeSection: $blockChangeSection,
    videoMode: $videoMode,
    sections: $sections,
    previousActiveSection: $previousActiveSection,
    activeSectionIndex: $activeSection.map((section) =>
      parseInt(section?.split('section')[1] ?? '100'),
    ),
  },
  filter: ({
    isAnimationPlaying,
    previousActiveSection,
    videoMode,
    blockChangeSection,
    activeSectionIndex,
  }) =>
    !isAnimationPlaying &&
    previousActiveSection !== 'section6' &&
    !(activeSectionIndex > 6) &&
    videoMode === 'backward' &&
    !blockChangeSection,
  fn: ({ videoElements, activeSection, videoMode }) => ({
    videoElements,
    videoMode,
    timecode:
      REVERSED_TIMECODES[
        'section' + (parseInt(activeSection.split('section')[1]) + 1)
      ],
  }),
  target: [playVideoTimecodeFx, animationPlayed],
});

sample({
  clock: [$activeSection.updates],
  filter: (prev) => parseInt(prev?.split('section')[1] ?? '100') > 5,
  fn: () => false,
  target: animationEnded,
});

sample({
  clock: timeUpdated,
  source: {
    activeSection: $activeSection,
    videoElements: $videoElements,
    videoMode: $videoMode,
  },
  filter: (src, time) => {
    const timecode =
      src.videoMode === 'forward'
        ? SECTION_TIMECODES[src.activeSection]
        : REVERSED_TIMECODES[
            'section' + (parseInt(src.activeSection.split('section')[1]) + 1)
          ];

    return !(time >= timecode.start && time < timecode.end);
  },
  fn: ({ videoElements }) => ({ videoElements }),
  target: [stopVideoFx, animationEnded],
});
