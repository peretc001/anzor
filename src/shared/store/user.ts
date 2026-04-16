import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IUserStore {
  id: string
  avatar: string
  email: string
  name: string
  type: string
}

export const useUserStore: UseBoundStore<StoreApi<IUserStore>> = create(
  devtools(
    (): IUserStore => ({
      id: '1',
      avatar:
        'https://s3.regru.cloud/s3.planirovochka/a4101fd2-d13c-42ba-bc8c-b32b83df7cba/1774288614679.jpg',
      email: 'admin@design.ru',
      name: 'Анна Соколова',
      type: 'Дизайнер'
    }),
    { name: 'user' }
  )
)
