import { VIDEO_BACKWARD_ID, VIDEO_FORWARD_ID } from '@/constants';
import {
  $activeSection,
  $animationPlaying,
  $previousActiveSection,
  $sections,
  animationEnded,
  animationPlayed,
  goToNextSection,
  goToPrevSection,
} from '@/models/journey';
import { createEffect, createEvent, createStore, sample } from 'effector';

const SECTION_TIMECODES: Record<string, { start: number; end: number }> = {
  section1: { start: 0, end: 4.9 }, // 0 - 4.9 секунд
  section2: { start: 5, end: 11 }, // 5 - 11 секунд
  section3: { start: 11.1, end: 23.1 }, // 11.1 - 16.8 секунд
  section4: { start: 23.2, end: 28 }, // 22.4 - 28 секунд (конец видео)
};

const REVERSED_TIMECODES: Record<string, { start: number; end: number }> = {
  section4: { start: 14.36, end: 19.5 }, // 22.4 - 28 секунд (конец видео)
  section3: { start: 19.5, end: 31.7 }, // 16.8 - 22.4 секунд
  section2: { start: 31.8, end: 37.9 }, // 5 - 11 секунд
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
  clock: videoElementMounted,
  target: linkVideoElementFx,
});

sample({
  clock: linkVideoElementFx.doneData,
  target: $videoElements,
});

sample({
  clock: [goToNextSection, linkVideoElementFx.doneData],
  source: {
    videoElements: $videoElements,
    isAnimationPlaying: $animationPlaying,
    activeSection: $activeSection,
    videoMode: $videoMode,
    sections: $sections,
    previousActiveSection: $previousActiveSection,
  },
  filter: ({ isAnimationPlaying, previousActiveSection, videoMode }) =>
    !isAnimationPlaying &&
    previousActiveSection !== 'section4' &&
    videoMode === 'forward',
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
    videoMode: $videoMode,
    sections: $sections,
    previousActiveSection: $previousActiveSection,
  },
  filter: ({ isAnimationPlaying, previousActiveSection, videoMode }) =>
    !isAnimationPlaying &&
    previousActiveSection !== 'section5' &&
    videoMode === 'backward',
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
  clock: $previousActiveSection,
  filter: (prev) => parseInt(prev?.split('section')[1] ?? '100') > 4,
  fn: () => false,
  target: $animationPlaying,
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
