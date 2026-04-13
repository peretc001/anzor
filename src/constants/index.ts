import { IType } from '@/shared/interfaces'

export const paths = {
  account: {
    about: '/account/about',
    contacts: '/account/contacts',
    gallery: '/account/gallery',
    index: '/account',
    payment: '/account/payment',
    portfolio: {
      add: '/account/portfolio/add',
      index: '/account/portfolio'
    },
    prices: '/account/prices',
  },
  blog: '/blog',
  catalog: '/catalog',
  home: '/',
  portfolio: '/portfolio'
}

export const CURRENCY = 'руб.'

/** Размер страницы каталога: значение по умолчанию и максимум за один запрос. */
export const PROFILE_LIST_LIMIT = 20

export const DESIGN_TYPES: IType[] = [
  {
    label: 'Дизайн-проект под ключ',
    unit: 'meter',
    value: 'dizayn-proekt'
  },
  {
    label: 'Планировочное решение',
    unit: 'meter',
    value: 'planirovochnoe-reshenie'
  },
  {
    label: 'Авторский надзор',
    unit: 'month',
    value: 'avtorskiy-nadzor'
  },
  {
    label: 'Интерьерный коллаж',
    unit: 'meter',
    value: 'interernyy-kollazh'
  },
  {
    label: 'Визуализация',
    unit: 'meter',
    value: 'vizualizatsiya'
  },
  {
    label: 'Хоумстейджинг',
    unit: 'meter',
    value: 'khoumsteydzhin'
  },
  {
    label: 'Комплектация',
    unit: 'meter',
    value: 'komplektatsiya'
  },
  {
    label: 'Декорирование',
    unit: 'meter',
    value: 'dekorinovanie'
  },
  {
    label: 'Обмерный план',
    unit: 'meter',
    value: 'obmernyy-plan'
  },
  {
    label: 'Консультация',
    unit: 'hour',
    value: 'consultation'
  },
  {
    label: 'Обучение',
    unit: 'hour',
    value: 'education'
  }
]

export const DESIGN_STYLES = [
  {
    label: 'Минимализм',
    value: 'minimal'
  },
  {
    label: 'Классический',
    value: 'classic'
  },
  {
    label: 'Современный',
    value: 'modern'
  },
  {
    label: 'Скандинавский',
    value: 'scandinavian'
  },
  {
    label: 'Джапанди',
    value: 'japan'
  },
  {
    label: 'Лофт',
    value: 'loft'
  },
  {
    label: 'Бохо',
    value: 'boho'
  },
  {
    label: 'Eco-дизайн',
    value: 'eco'
  },
  {
    label: 'Неоклассика',
    value: 'neoclassic'
  },
  {
    label: 'Неомемфис',
    value: 'memphis'
  },
  {
    label: 'Контемпорари',
    value: 'contemporary'
  }
]

export const DESIGN_SEGMENT = [
  {
    label: 'Эконом',
    value: 'economy'
  },
  {
    label: 'Комфорт',
    value: 'comfort'
  },
  {
    label: 'Премиум',
    value: 'premium'
  },
  {
    label: 'Эксклюзив',
    value: 'exclusive'
  }
]

export const DESIGN_SPACES = [
  {
    label: 'Квартиры',
    value: 'flat'
  },
  {
    label: 'Дома',
    value: 'home'
  },
  {
    label: 'Офисы',
    value: 'office'
  },
  {
    label: 'Кафе и рестораны',
    value: 'cafe'
  },
  {
    label: 'Магазины и бутики',
    value: 'shop'
  },
  {
    label: 'Отели и апартаменты',
    value: 'hotel'
  },
  {
    label: 'Выставки и шоурумы',
    value: 'expo'
  }
]

export const DESIGN_EXPERIENCE = [
  {
    label: 'До 1 года',
    value: '1'
  },
  {
    label: 'От 1 года до 3 лет',
    value: '3'
  },
  {
    label: 'От 3 до 5 лет',
    value: '5'
  },
  {
    label: 'От 5 до 10 лет',
    value: '10'
  },
  {
    label: 'Более 10 лет',
    value: 'more'
  }
]

export const DESIGN_STATUS = [
  {
    label: 'Частный дизайнер',
    value: 'individual'
  },
  {
    label: 'Студия дизайна',
    value: 'studio'
  },
  {
    label: 'Строительная компания',
    value: 'builder'
  }
]

// Gallery
export const GALLERY_TYPES = [
  {
    label: 'Визуализация',
    value: 'visual'
  },
  {
    label: 'Фото объекта',
    value: 'real'
  }
]
