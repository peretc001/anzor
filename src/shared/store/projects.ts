import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Project {
  id: number
  active: boolean
  address: string
  contractor: string
  customer?: string
  icon: 'building' | 'home'
  journalsCount: number
  name: string
  warningsCount: number
}

interface IProjectsStore {
  projects: Project[]
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
          customer: 'Иванова Мария ...',
          icon: 'building',
          journalsCount: 2,
          name: 'Квартира на Тверской',
          warningsCount: 2
        },
        {
          id: 4,
          active: true,
          address: 'Московская обл., Одинцовский р-н, пос. Горки-2',
          contractor: 'ИП Петров И.В.',
          icon: 'home',
          journalsCount: 1,
          name: 'Загородный дом Рублёвка',
          warningsCount: 0
        },
        {
          id: 3,
          active: true,
          address: 'г. Краснодар, ул. Беличенок, д. 88, кв. 157',
          contractor: 'ООО «НадзорПроф»',
          icon: 'building',
          journalsCount: 3,
          name: 'Квартира ЖК Самолет',
          warningsCount: 1
        },
        {
          id: 2,
          active: false,
          address: 'г. Краснодар, ст. Елизаветнинская, д. 7',
          contractor: 'ИП Мельников А.А.',
          customer: 'Смирнов Павел ...',
          icon: 'home',
          journalsCount: 5,
          name: 'Дом в Елизаветке',
          warningsCount: 0
        },
        {
          id: 1,
          active: false,
          address: 'г. Екатеринбург, ул. Московская, д. 8, кв. 21',
          contractor: 'ООО «МонолитСервис»',
          icon: 'building',
          journalsCount: 2,
          name: 'Квартира на Московской',
          warningsCount: 0
        },
        {
          id: 0,
          active: false,
          address: 'Краснодарский край, п. Лазаревское, ул. Морская, д. 2',
          contractor: 'ИП Козлов Д.Н.',
          customer: 'Волкова Анна ...',
          icon: 'home',
          journalsCount: 4,
          name: 'Дом у моря',
          warningsCount: 0
        }
      ]
    }),
    { name: 'projects' }
  )
)
