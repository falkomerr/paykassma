import { createEvent, createStore, sample } from 'effector';
import { debounce } from 'patronum';

// События для изменения языка
export const changeLang = createEvent<string>();

// Хранилище для текущего языка
export const $lang = createStore<string>('ru');

sample({
  clock: debounce(changeLang, 1000),
  target: $lang,
});
