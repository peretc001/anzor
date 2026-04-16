export interface IUser {
  id: string | undefined
  email: string | undefined
  password: string | undefined
  user_metadata?: any
}

export interface IProject {
  id: number
  active: boolean
  address?: string
  contractor?: string
  customer?: string
  name: string
  type: 'flat' | 'house'
}

export interface IGallery {
  id: number
  project_id?: number
  task_id?: null | number
  url: string
}

export interface ITask {
  id: number
  /** Количество комментариев (если появится в БД) */
  comments_count?: null | number
  control?: null | string
  created_at?: string
  description?: null | string
  executor?: null | string
  owner_id?: string
  photos?: null | string[]
  project_id?: number
  /** open — открыто, resolved — исправлено */
  status?: 'open' | 'resolved' | null
  title: string
}
