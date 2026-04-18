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
  photos_count?: number
  tasks_count?: number
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
  comments_count?: null | number
  control?: null | string
  created_at?: string
  description?: null | string
  executor?: null | string
  owner_id?: string
  photos?: null | string[]
  priority: string
  project_id?: number
  status: string
  title: string
  type: string
}
