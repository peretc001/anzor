/** Данные карточки контакта по объекту (модалка исполнитель / заказчик). */
export const PROJECT_CONTACT = {
  address: 'ЖК Самолет, ул. Беличенко 88, 15 этаж, кв. 77',
  bioCustomer: 'Делаем дизайн в стиле минимализм, 75 кв. метров',
  bioExecutor: 'Ремонт и отделка квартиры по договору подряда.',
  customer: {
    initials: 'ИИ',
    name: 'Иванов Иван',
    subtitle: 'Заказчик · Квартира 75 м²',
  },
  executor: {
    initials: 'СК',
    name: 'ООО «Строительная компания»',
    subtitle: 'Исполнитель · Строительно-монтажные работы',
  },
  phoneHref: 'tel:89123456789',
  phoneLabel: '8 (912) 345-67-89',
} as const

export type ProjectContactRole = 'customer' | 'executor'
