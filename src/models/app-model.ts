import { createEvent, createStore, sample } from 'effector';
import { once } from 'patronum';
import { initGateAudio, initSections } from './journey';

export const appMounted = createEvent();
export const loaderFinished = createEvent();

sample({
  clock: once(appMounted),
  target: [initSections, initGateAudio],
});

export const $loaderFinished = createStore(false);
