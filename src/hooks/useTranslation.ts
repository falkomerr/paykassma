import { useUnit } from 'effector-react';
import { $translate, TranslationFunction } from '../models/dictionary';

export const useTranslation = (): {
  t: TranslationFunction;
} => {
  // Получаем функцию перевода из стора
  const t = useUnit($translate);

  return { t };
};
