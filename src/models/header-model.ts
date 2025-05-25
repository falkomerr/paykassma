import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

export const burgerClicked = createEvent();

export const $isBurgerOpen = createStore(false);

sample({
  clock: burgerClicked,
  source: not($isBurgerOpen),
  target: $isBurgerOpen,
});
