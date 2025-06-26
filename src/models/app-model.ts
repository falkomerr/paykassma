import { createEvent, createStore, sample } from 'effector';
import { combineEvents, once } from 'patronum';
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

export const bgLoaded = createEvent();
export const bgBackwardLoaded = createEvent();

export const $isBgLoaded = createStore(false);

sample({
  clock: combineEvents([bgLoaded, bgBackwardLoaded]),
  fn: () => true,
  target: $isBgLoaded,
});

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
