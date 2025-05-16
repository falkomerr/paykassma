import { createEvent, sample } from 'effector';
import { once } from 'patronum';
import { initGateAudio, initSections } from './journey';

export const appMounted = createEvent();

sample({
  clock: once(appMounted),
  target: [initSections, initGateAudio],
});
