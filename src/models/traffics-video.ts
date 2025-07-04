import { TRAFFICS_BACKWARD_ID, TRAFFICS_FORWARD_ID } from '@/constants';
import {
  $activeSection,
  $previousActiveSection,
  goToNextSection,
  goToPrevSection,
} from '@/models/journey';
import { $videoMode as $journeyVideoMode, $videoMode } from '@/models/video';
import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { debounce } from 'patronum';

const FORWARD_STOP_TIMECODE = 3.4;
const BACKWARD_STOP_TIMECODE = 6.68;

export const trafficsTimeUpdated = createEvent<number>();
export const trafficsVideoElementMounted = createEvent();
export const prevtrafficSectionChanged = createEvent();
export const nextraffictSectionChanged = createEvent();
export const animationStarted = createEvent();
export const animationEnded = createEvent();
export const handleScroll = createEvent();

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
export const playVideoTimecodeFx = attach({
  source: { videoMode: $videoMode, videoElements: $trafficsVideoElements },
  effect: ({
    videoElements,
    videoMode,
  }: {
    videoElements: {
      forward: HTMLVideoElement | null;
      backward: HTMLVideoElement | null;
    };
    videoMode: 'forward' | 'backward';
  }) => {
    let alreadyStopped = false;

    const handleForwardTimeUpdate = () => {
      if (!videoElements.forward || !videoElements.backward) return;

      if (videoElements.forward.currentTime >= FORWARD_STOP_TIMECODE) {
        if (alreadyStopped) return;
        videoElements.forward.pause();
        alreadyStopped = true;
        const timeout = setTimeout(() => {
          videoElements.forward?.play();
          clearTimeout(timeout);
        }, 1500);
      }
    };

    const handleBackwardTimeUpdate = () => {
      if (!videoElements.forward || !videoElements.backward) return;

      if (videoElements.backward.currentTime >= BACKWARD_STOP_TIMECODE) {
        if (alreadyStopped) return;
        videoElements.backward.pause();
        alreadyStopped = true;
        const timeout = setTimeout(() => {
          videoElements.backward?.play();
          clearTimeout(timeout);
        }, 1500);
      }
    };

    const handleNextSection = () => {
      videoElements.forward?.removeEventListener(
        'timeupdate',
        handleForwardTimeUpdate,
      );
      goToNextSection();
    };
    const handlePrevSection = () => {
      videoElements.backward?.removeEventListener(
        'timeupdate',
        handleBackwardTimeUpdate,
      );
      goToPrevSection();
    };

    if (videoElements.forward && videoElements.backward) {
      alreadyStopped = false;
      if (videoMode === 'forward') {
        videoElements.backward.style.display = 'none';
        videoElements.forward.style.display = 'fixed';
        videoElements.backward.pause();
        videoElements.forward.style.zIndex = '1000';
        videoElements.backward.style.zIndex = '0';

        videoElements.forward.currentTime = 0;
        videoElements.forward.play();

        videoElements.forward.addEventListener(
          'timeupdate',
          handleForwardTimeUpdate,
        );
        videoElements.forward.addEventListener('ended', handleNextSection);
      } else {
        videoElements.forward.style.display = 'none';
        videoElements.backward.style.display = 'fixed';
        videoElements.forward.style.zIndex = '0';
        videoElements.backward.style.zIndex = '1000';
        videoElements.forward.pause();

        videoElements.backward.currentTime = 0;
        videoElements.backward.play();

        videoElements.backward.addEventListener(
          'timeupdate',
          handleBackwardTimeUpdate,
        );
        videoElements.backward.addEventListener('ended', handlePrevSection);
      }
    }
  },
});

sample({
  clock: trafficsVideoElementMounted,
  target: linkVideoElementFx,
});

sample({
  clock: linkVideoElementFx.doneData,
  target: $trafficsVideoElements,
});

sample({
  clock: debounce(handleScroll, 500),
  source: $activeSection,
  filter: (src) => src === 'section8',
  target: playVideoTimecodeFx,
});
