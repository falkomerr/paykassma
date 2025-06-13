import { createEffect, createEvent, createStore, sample } from 'effector';

export const initBgAudio = createEvent();
export const initGateAudio = createEvent();
export const initButtonAudio = createEvent();
export const initClickAudio = createEvent();

export const playBgAudio = createEvent();
export const playGateAudio = createEvent();
export const playClickAudio = createEvent();
export const playHoverButtonAudio = createEvent();

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

export const playFx = createEffect((audio: HTMLAudioElement) => {
  audio.play();
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
  clock: playHoverButtonAudio,
  source: $hoverButtonAudioElement,
  filter: Boolean,
  target: playFx,
});

sample({
  clock: playClickAudio,
  source: $clickButtonAudioElement,
  filter: Boolean,
  target: playFx,
});

sample({
  clock: $bgAudio,
  filter: Boolean,
  target: playFx,
});

sample({
  clock: playBgAudio,
  source: $bgAudio,
  filter: Boolean,
  target: playFx,
});

sample({
  clock: playGateAudio,
  source: $gateAudioElement,
  filter: Boolean,
  target: playFx,
});

sample({
  clock: volumeChanged,
  source: [$bgAudio, $gateAudioElement],
  target: syncVolumeFx,
});
