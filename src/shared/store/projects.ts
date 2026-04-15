import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Project {
  id: number
  active: boolean
  address: string
  contractor: string
  customer?: string
  duration: string
  icon: 'building' | 'home'
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
          duration: '35 дней',
          icon: 'building',
          name: 'Квартира на Тверской',
          warningsCount: 2
        },
        {
          id: 4,
          active: true,
          address: 'Московская обл., Одинцовский р-н, пос. Горки-2',
          contractor: 'ИП Петров И.В.',
          duration: '5 дней',
          icon: 'home',
          name: 'Загородный дом Рублёвка',
          warningsCount: 0
        },
        {
          id: 3,
          active: true,
          address: 'г. Краснодар, ул. Беличенок, д. 88, кв. 157',
          contractor: 'ООО «НадзорПроф»',
          duration: '24 дня',
          icon: 'building',
          name: 'Квартира ЖК Самолет',
          warningsCount: 1
        },
        {
          id: 2,
          active: false,
          address: 'г. Краснодар, ст. Елизаветнинская, д. 7',
          contractor: 'ИП Мельников А.А.',
          customer: 'Смирнов Павел ...',
          duration: '44 дня',
          icon: 'home',
          name: 'Дом в Елизаветке',
          warningsCount: 0
        },
        {
          id: 1,
          active: false,
          address: 'г. Екатеринбург, ул. Московская, д. 8, кв. 21',
          contractor: 'ООО «МонолитСервис»',
          duration: '18 дней',
          icon: 'building',
          name: 'Квартира на Московской',
          warningsCount: 0
        },
        {
          id: 0,
          active: false,
          address: 'Краснодарский край, п. Лазаревское, ул. Морская, д. 2',
          contractor: 'ИП Козлов Д.Н.',
          customer: 'Волкова Анна ...',
          duration: '61 день',
          icon: 'home',
          name: 'Дом у моря',
          warningsCount: 0
        }
      ]
    }),
    { name: 'projects' }
  )
)
