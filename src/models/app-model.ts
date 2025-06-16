import { createEvent, createStore, sample } from 'effector';
import { once } from 'patronum';
import {
  initBgAudio,
  initButtonAudio,
  initClickAudio,
  initGateAudio,
  initSwipeCardAudio,
} from './audio';
import { initSections } from './journey';
import { changeLang } from './language';

export const appMounted = createEvent();
export const loaderToggled = createEvent<boolean>();

sample({
  clock: once(appMounted),
  target: [
    initSections,
    initGateAudio,
    initBgAudio,
    initButtonAudio,
    initClickAudio,
    initSwipeCardAudio,
  ],
});

export const $loaderFinished = createStore(false);

sample({
  clock: loaderToggled,
  target: $loaderFinished,
});

sample({
  clock: changeLang,
  fn: () => false,
  target: $loaderFinished,
});
