import { createEvent, sample } from 'effector';
import { once } from 'patronum';
import { initSections } from './journey';

export const appMounted = createEvent();

sample({
  clock: once(appMounted),
  target: [initSections],
});
