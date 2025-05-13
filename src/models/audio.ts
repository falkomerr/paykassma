import { createEvent, createStore, sample } from 'effector';

export const volumeChanged = createEvent<number>();

export const $volume = createStore<number>(0.5);

sample({
  clock: volumeChanged,
  target: $volume,
});
