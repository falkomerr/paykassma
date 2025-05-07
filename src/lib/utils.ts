import { type ClassValue, clsx } from 'clsx';
import { createEffect } from 'effector';
import { twMerge } from 'tailwind-merge';

// Утилита для объединения классов Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Простая обертка для запросов к API с помощью Effector
export const createApiRequest = <Params, Result>(
  apiMethod: (params: Params) => Promise<Result>,
) => {
  return createEffect(async (params: Params) => {
    try {
      return await apiMethod(params);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  });
};
