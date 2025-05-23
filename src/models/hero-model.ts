import { createEvent, createStore } from 'effector';

export const hoveredOrBlured = createEvent<boolean>();

export const $hovered = createStore<boolean>(false).on(
  hoveredOrBlured,
  (_, hovered) => hovered,
);
