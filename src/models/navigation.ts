import { combine } from 'effector';
import { $translations } from './dictionary';

export type NavLink = {
  label: string;
  href: string;
  translationKey: string;
};

// Константа с ключами для навигации - теперь это якорные ссылки
const navigationItems = [
  { translationKey: 'nav.blog', href: '#blog' },
  { translationKey: 'nav.loyalty', href: '#loyalty' },
  { translationKey: 'nav.contacts', href: '#contacts' },
  { translationKey: 'nav.advantages', href: '#advantages' },
];

// Создаем хранилище, которое будет обновляться при изменении языка
export const $navLinks = combine($translations, (translations) => {
  return navigationItems.map((item) => ({
    label: translations[item.translationKey] || item.translationKey,
    href: item.href,
    translationKey: item.translationKey,
  }));
});
