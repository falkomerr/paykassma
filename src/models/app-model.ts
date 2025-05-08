import { createEvent, sample } from 'effector';
import { once } from 'patronum';
import { initSections } from './journey';
import { videoElementMounted } from './video';

export const appMounted = createEvent();

sample({
  clock: once(appMounted),
  target: [initSections, videoElementMounted],
});
