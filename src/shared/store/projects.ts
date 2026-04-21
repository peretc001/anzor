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
          contractor: { id: 9001, name: 'ООО «СтройМастер»' },
          contractor_id: 9001,
          customer: { id: 9101, name: 'Иванова Мария' },
          customer_id: 9101,
          name: 'Квартира на Тверской',
          type: 'flat'
        },
        {
          id: 4,
          active: true,
          address: 'Московская обл., Одинцовский р-н, пос. Горки-2',
          contractor: null,
          contractor_id: null,
          customer: { id: 9102, name: 'Мельникова Светлана' },
          customer_id: 9102,
          name: 'Загородный дом Рублёвка',
          type: 'house'
        },
        {
          id: 3,
          active: true,
          address: 'г. Краснодар, ул. Беличенок, д. 88, кв. 657',
          contractor: null,
          contractor_id: null,
          customer: { id: 9103, name: 'Красовский Игорь' },
          customer_id: 9103,
          name: 'Квартира ЖК Самолет',
          type: 'flat'
        },
        {
          id: 2,
          active: false,
          address: 'г. Краснодар, ст. Елизаветнинская, д. 7',
          contractor: { id: 9002, name: 'ИП Мельников А.А.' },
          contractor_id: 9002,
          customer: { id: 9104, name: 'Смирнов Павел' },
          customer_id: 9104,
          name: 'Дом в Елизаветке',
          type: 'house'
        },
        {
          id: 1,
          active: false,
          address: 'г. Екатеринбург, ул. Московская, д. 8, кв. 21',
          contractor: { id: 9003, name: 'ООО «МонолитСервис»' },
          contractor_id: 9003,
          customer: { id: 9105, name: 'Саркисян Армен' },
          customer_id: 9105,
          name: 'Квартира на Московской',
          type: 'flat'
        },
        {
          id: 0,
          active: false,
          address: 'Краснодарский край, п. Лазаревское, ул. Морская, д. 2',
          contractor: { id: 9004, name: 'ИП Козлов Д.Н.' },
          contractor_id: 9004,
          customer: { id: 9106, name: 'Волкова Анна' },
          customer_id: 9106,
          name: 'Дом у моря',
          type: 'house'
        }
      ]
    }),
    { name: 'projects' }
  )
)
