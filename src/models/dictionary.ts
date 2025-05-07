import { combine } from 'effector';
import { $lang } from './language';

// Типы для словаря
export type Translation = {
  ru: string;
  en: string;
  [key: string]: string;
};

export type NestedDictionary = {
  [key: string]: Translation | NestedDictionary;
};

// Словарь с переводами
export const dictionary: NestedDictionary = {
  // Общие фразы
  common: {
    title: {
      ru: 'Paykassa - Платежная система',
      en: 'Paykassa - Payment System',
    },
    loading: {
      ru: 'Загрузка...',
      en: 'Loading...',
    },
    error: {
      ru: 'Произошла ошибка',
      en: 'An error occurred',
    },
    notFound: {
      ru: 'Страница не найдена',
      en: 'Page not found',
    },
  },

  // Заголовки
  header: {
    title: {
      ru: 'Paykassa',
      en: 'Paykassa',
    },
  },

  // Навигация
  nav: {
    blog: {
      ru: 'Блог',
      en: 'Blog',
    },
    loyalty: {
      ru: 'Программа лояльности',
      en: 'Loyalty Program',
    },
    contacts: {
      ru: 'Контакты',
      en: 'Contacts',
    },
    advantages: {
      ru: 'Преимущества',
      en: 'Advantages',
    },
    home: {
      ru: 'Главная',
      en: 'Home',
    },
    account: {
      ru: 'Личный кабинет',
      en: 'Account',
    },
  },

  // Кнопки
  buttons: {
    login: {
      ru: 'Войти',
      en: 'Login',
    },
    register: {
      ru: 'Регистрация',
      en: 'Register',
    },
    submit: {
      ru: 'Начать путешествие',
      en: 'Start journey',
    },
    cancel: {
      ru: 'Отмена',
      en: 'Cancel',
    },
    close: {
      ru: 'Закрыть',
      en: 'Close',
    },
    save: {
      ru: 'Сохранить',
      en: 'Save',
    },
    delete: {
      ru: 'Удалить',
      en: 'Delete',
    },
    edit: {
      ru: 'Редактировать',
      en: 'Edit',
    },
    back: {
      ru: 'Назад',
      en: 'Back',
    },
    next: {
      ru: 'Далее',
      en: 'Next',
    },
  },

  // Формы
  forms: {
    username: {
      ru: 'Имя пользователя',
      en: 'Username',
    },
    password: {
      ru: 'Пароль',
      en: 'Password',
    },
    email: {
      ru: 'Электронная почта',
      en: 'Email',
    },
    firstName: {
      ru: 'Имя',
      en: 'First name',
    },
    lastName: {
      ru: 'Фамилия',
      en: 'Last name',
    },
    phone: {
      ru: 'Телефон',
      en: 'Phone',
    },
    country: {
      ru: 'Страна',
      en: 'Country',
    },
    city: {
      ru: 'Город',
      en: 'City',
    },
    address: {
      ru: 'Адрес',
      en: 'Address',
    },
  },

  // Главная страница
  hero: {
    title: {
      ru: 'Добро пожаловать на Paykassa',
      en: 'Welcome to Paykassa',
    },
    subtitle: {
      ru: 'Ваш надежный партнер в мире финансов',
      en: 'Your reliable partner in the world of finance',
    },
    description: {
      ru: 'CPA-сеть с одним из самых известных платёжных решений в igaming',
      en: 'CPA network with one of the most famous payment solutions in igaming',
    },
  },

  // Страницы
  pages: {
    blog: {
      title: {
        ru: 'Блог Paykassa',
        en: 'Paykassa Blog',
      },
      description: {
        ru: 'Читайте последние новости и статьи о криптовалютах и платежных системах',
        en: 'Read the latest news and articles about cryptocurrencies and payment systems',
      },
    },
    loyalty: {
      title: {
        ru: 'Программа лояльности',
        en: 'Loyalty Program',
      },
      description: {
        ru: 'Получайте бонусы и скидки за использование нашей платежной системы',
        en: 'Get bonuses and discounts for using our payment system',
      },
    },
    contacts: {
      title: {
        ru: 'Контакты',
        en: 'Contacts',
      },
      description: {
        ru: 'Свяжитесь с нами, если у вас есть вопросы или предложения',
        en: 'Contact us if you have any questions or suggestions',
      },
    },
    advantages: {
      title: {
        ru: 'Преимущества',
        en: 'Advantages',
      },
      description: {
        ru: 'Узнайте о преимуществах использования нашей платежной системы',
        en: 'Learn about the benefits of using our payment system',
      },
    },
  },
};

// Другие типы словаря
export type FlatDictionary = Record<string, Translation>;
export type TranslationFunction = (
  key: string,
  params?: Record<string, string>,
) => string;

// Функция для преобразования вложенного словаря в плоский
const flattenDictionary = (dict: NestedDictionary): FlatDictionary => {
  const result: FlatDictionary = {};

  const flatten = (obj: NestedDictionary, prefix = '') => {
    for (const key in obj) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (typeof value === 'object' && 'ru' in value && 'en' in value) {
        // Это Translation
        result[newKey] = value as Translation;
      } else {
        // Это вложенный объект
        flatten(value as NestedDictionary, newKey);
      }
    }
  };

  flatten(dict);
  return result;
};

// Преобразуем вложенный словарь в плоский
export const flatDictionary = flattenDictionary(dictionary);

// Создаем хранилище, которое зависит от текущего языка и возвращает словарь для этого языка
export const $translations = combine($lang, (lang) => {
  const result: Record<string, string> = {};

  for (const key in flatDictionary) {
    result[key] = flatDictionary[key][lang] || flatDictionary[key]['ru'] || key;
  }

  return result;
});

// Создаем функцию для получения переводов с поддержкой параметров
export const $translate = $translations.map((translations) => {
  return (key: string, params?: Record<string, string>) => {
    let text = translations[key] || key;

    if (params) {
      for (const param in params) {
        text = text.replace(`{${param}}`, params[param]);
      }
    }

    return text;
  };
});
