import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'

import { IProject } from '@/shared/interfaces'

interface IProjectsStore {
  projects: IProject[]
}

export const useProjectsStore: UseBoundStore<StoreApi<IProjectsStore>> = create(
  devtools(
    (): IProjectsStore => ({
      projects: [
        {
          id: 5,
          active: true,
          address: 'г. Москва, ул. Тверская, д. 12, кв. 45',
          contractor: 'ООО «СтройМастер»',
          customer: 'Иванова Мария',
          name: 'Квартира на Тверской',
          type: 'building'
        },
        {
          id: 4,
          active: true,
          address: 'Московская обл., Одинцовский р-н, пос. Горки-2',
          customer: 'Мельникова Светлана',
          name: 'Загородный дом Рублёвка',
          type: 'home'
        },
        {
          id: 3,
          active: true,
          address: 'г. Краснодар, ул. Беличенок, д. 88, кв. 657',
          customer: 'Красовский Игорь',
          name: 'Квартира ЖК Самолет',
          type: 'building'
        },
        {
          id: 2,
          active: false,
          address: 'г. Краснодар, ст. Елизаветнинская, д. 7',
          contractor: 'ИП Мельников А.А.',
          customer: 'Смирнов Павел',
          name: 'Дом в Елизаветке',
          type: 'home'
        },
        {
          id: 1,
          active: false,
          address: 'г. Екатеринбург, ул. Московская, д. 8, кв. 21',
          contractor: 'ООО «МонолитСервис»',
          customer: 'Саркисян Армен',
          name: 'Квартира на Московской',
          type: 'building'
        },
        {
          id: 0,
          active: false,
          address: 'Краснодарский край, п. Лазаревское, ул. Морская, д. 2',
          contractor: 'ИП Козлов Д.Н.',
          customer: 'Волкова Анна',
          name: 'Дом у моря',
          type: 'home'
        }
      ]
    }),
    { name: 'projects' }
  )
)
