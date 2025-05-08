import { useUnit } from 'effector-react';
import { $translate, TranslationFunction } from '../models/dictionary';

export const useTranslation = (): {
  t: TranslationFunction;
} => {
  const t = useUnit($translate);

  return { t };
};
