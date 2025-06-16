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
    percent: {
      ru: '%',
      en: '%',
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

  // Аудио контейнер
  audio: {
    sound: {
      ru: 'ЗВУК',
      en: 'SOUND',
    },
    on: {
      ru: 'ВКЛ',
      en: 'ON',
    },
    off: {
      ru: 'ВЫКЛ',
      en: 'OFF',
    },
  },

  // Секции
  sections: {
    // Заголовки глав
    chapters: {
      advantages: {
        ru: 'Глава 1: Преимущества',
        en: 'Chapter 1: Advantages',
      },
      conferences: {
        ru: 'Глава 2: Конференции',
        en: 'Chapter 2: Conferences',
      },
      finance: {
        ru: 'Глава 3: Финансовые взаимодействия',
        en: 'Chapter 3: Financial Interactions',
      },
      trafficTypes: {
        ru: 'Глава 4: Типы трафика',
        en: 'Chapter 4: Traffic Types',
      },
    },

    // Секция 1
    section1: {
      title: {
        ru: 'Секция 1',
        en: 'Section 1',
      },
      content: {
        ru: 'Мы масштабируем \nвашу прибыль',
        en: 'We scale \nyour profit',
      },
    },

    // Секция 2
    section2: {
      title: {
        ru: 'Секция 2',
        en: 'Section 2',
      },
      content: {
        ru: ' с которых \nпрямо сейчас идет \nпрофит',
        en: ' that bring \nprofit right \nnow',
      },
    },

    // Секция 3
    section3: {
      title: {
        ru: 'Секция 3',
        en: 'Section 3',
      },
      content: {
        ru: ' с которых \nпрямо сейчас идет \nпрофит',
        en: ' that bring \nprofit right \nnow',
      },
    },

    // Секция 4
    section4: {
      title: {
        ru: 'Секция 4',
        en: 'Section 4',
      },
      content: {
        ru: 'Более 300 офферов \nот топовых \nрекламодателей \nв одном месте',
        en: 'More than 300 offers \nfrom top advertisers \nin one place',
      },
      features: {
        diversify: {
          ru: 'Диверсифицируй риски',
          en: 'Diversify risks',
        },
        switchTraffic: {
          ru: 'Переключай потоки',
          en: 'Switch traffic flows',
        },
        testOffers: {
          ru: 'Тестируй топовые офферы без KPI',
          en: 'Test top offers without KPI',
        },
        guaranteedPayments: {
          ru: 'Получай гарантированные выплаты',
          en: 'Get guaranteed payments',
        },
      },
    },

    // Секция 5
    section5: {
      title: {
        ru: 'Секция 5',
        en: 'Section 5',
      },
      content: {
        ru: 'Усиливаем бюджеты \nарбитражных команд',
        en: 'We strengthen the budgets of \narbitrage teams',
      },
      description: {
        ru: 'Масштабируем ваши успешные связки предоставляя бюджеты \nдля получения  максимального профита с рекламной кампании',
        en: 'We scale your successful bundles  by providing budgets \nto get maximum profit from your advertising campaign',
      },
      radialText: {
        ru: 'Масштабируем ваши',
        en: 'Scale your',
      },
      radialTextDescription: {
        ru: 'успешные связки предоставляя бюджеты для получения\n  максимального профита с рекламной кампании',
        en: 'successful bundles by providing budgets to get \n maximum profit from your advertising campaign',
      },
    },

    // Секция 6
    section6: {
      title: {
        ru: 'Секция 6',
        en: 'Section 6',
      },
      content: {
        ru: 'Место встречи изменить нельзя, \nувидимся на конференциях',
        en: 'The meeting place cannot be changed, \nsee you at the conferences',
      },
    },

    // Финансовая карусель (ex-section7,8,9)
    financeCarousel: {
      title: {
        ru: 'Финансовая карусель',
        en: 'Financial carousel',
      },
      content: {
        ru: '\nфинансовых \nвзаимодействий',
        en: 'Our variety of financial \ninteractions',
      },
    },

    // Секция 10
    section10: {
      title: {
        ru: 'Секция 10',
        en: 'Section 10',
      },
      content: {
        ru: 'Монетизируем следующие \nтипы трафика',
        en: 'We monetize the following \ntypes of traffic',
      },
    },

    section9: {
      chapter: {
        ru: 'Глава 5: Типы трафика',
        en: 'Chapter 5: Traffic types',
      },
      titleBonus: {
        ru: 'Бонусы ',
        en: 'Bonuses ',
      },
      title: {
        ru: 'доступные \nкаждому',
        en: 'available \nfor everyone',
      },
      weHide: {
        ru: 'Каждую неделю мы прячем 50$ ',
        en: 'We hide 50$ every week ',
      },

      content: {
        ru: 'в нашем телеграмм \nканале, просто следи за нашими новостями, \nполучай экспертизу и находи бонус первым!\n',
        en: 'in our telegram channel, simply follow our news, \nreceive expertise and find the bonus first!\n',
      },
      ifYouFind: {
        ru: 'Если ты нашел бонус первым напиши \nоб этом в комментариях к посту и бонус твой!',
        en: 'If you find the bonus first, write \nabout it in the comments to the post and the bonus is yours!',
      },
      participate: {
        ru: 'Участвовать',
        en: 'Participate',
      },
      detailedConditions: {
        ru: 'Подробные условия',
        en: 'Detailed conditions',
      },
    },

    // Общие компоненты секций
    common: {
      igaming: {
        ru: 'в Igaming',
        en: 'in Igaming',
      },
      knowGeo: {
        ru: 'Знаем ГЕО',
        en: 'Know GEO',
      },
      offers300: {
        ru: '300 офферов',
        en: '300 offers',
      },
      withoutKpi: {
        ru: 'офферы без KPI',
        en: 'offers without KPI',
      },
      strengthen: {
        ru: 'Усиливаем',
        en: 'Strengthen',
      },
      meet: {
        ru: 'увидимся',
        en: 'see you',
      },
      ourVariability: {
        ru: 'Наша вариативность',
        en: 'Our variability',
      },
      monetize: {
        ru: 'Монетизируем',
        en: 'Monetize',
      },
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
      ru: 'CPA-сеть с одним из самых известных платёжных решений в iGaming',
      en: 'CPA network with one of the most famous payment solutions in iGaming',
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
