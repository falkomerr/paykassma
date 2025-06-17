import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';

export const initBgAudio = createEvent();
export const initGateAudio = createEvent();
export const initButtonAudio = createEvent();
export const initClickAudio = createEvent();
export const initSwipeCardAudio = createEvent();

export const playBgAudio = createEvent();
export const playGateAudio = createEvent();
export const playClickAudio = createEvent();
export const playHoverButtonAudio = createEvent();
export const playSwipeCardAudio = createEvent();

export const volumeChanged = createEvent<number>();

export const $volume = createStore<number>(1);
export const $bgAudio = createStore<HTMLAudioElement | null>(null);
export const $gateAudioElement = createStore<HTMLAudioElement | null>(null);
export const $hoverButtonAudioElement = createStore<HTMLAudioElement | null>(
  null,
);
export const $clickButtonAudioElement = createStore<HTMLAudioElement | null>(
  null,
);
export const $swipeCardAudioElement = createStore<HTMLAudioElement | null>(
  null,
);

export const playFx = attach({
  source: $volume,
  effect: (
    volume,
    {
      audio,
      loop = false,
    }: {
      audio: HTMLAudioElement;
      loop?: boolean;
    },
  ) => {
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play();
    if (loop) {
      audio.volume = volume !== 0 ? volume - 0.3 : 0;
      audio.loop = true;
    }
  },
});

export const syncVolumeFx = createEffect(
  (audios: (HTMLAudioElement | null)[]) => {
    audios.forEach((audio) => {
      if (audio) {
        audio.volume = $volume.getState();
      }
    });
  },
);

sample({
  clock: volumeChanged,
  target: $volume,
});

sample({
  clock: initBgAudio,
  fn: () => new Audio('/bg_music.mp3'),
  target: $bgAudio,
});

sample({
  clock: initGateAudio,
  fn: () => new Audio('/gate.mp3'),
  target: $gateAudioElement,
});

sample({
  clock: initButtonAudio,
  fn: () => new Audio('/zvuknavedeniya.wav'),
  target: $hoverButtonAudioElement,
});

sample({
  clock: initClickAudio,
  fn: () => new Audio('/zvuk_click.wav'),
  target: $clickButtonAudioElement,
});

sample({
  clock: initSwipeCardAudio,
  fn: () => new Audio('/zvuk_swipe.mp3'),
  target: $swipeCardAudioElement,
});

sample({
  clock: playHoverButtonAudio,
  source: $hoverButtonAudioElement,
  filter: Boolean,
  fn: (audio) => ({ audio }),
  target: playFx,
});

sample({
  clock: playClickAudio,
  source: $clickButtonAudioElement,
  filter: Boolean,
  fn: (audio) => ({ audio }),
  target: playFx,
});

sample({
  clock: playSwipeCardAudio,
  source: $swipeCardAudioElement,
  filter: Boolean,
  fn: (audio) => ({ audio }),
  target: playFx,
});

sample({
  clock: $bgAudio,
  filter: Boolean,
  fn: (audio) => ({ audio }),
  target: playFx,
});

sample({
  clock: playBgAudio,
  source: $bgAudio,
  filter: Boolean,
  fn: (audio) => ({ audio, loop: true }),
  target: playFx,
});

sample({
  clock: playGateAudio,
  source: $gateAudioElement,
  filter: Boolean,
  fn: (audio) => ({ audio }),
  target: playFx,
});

sample({
  clock: volumeChanged,
  source: [$bgAudio, $gateAudioElement],
  target: syncVolumeFx,
});
