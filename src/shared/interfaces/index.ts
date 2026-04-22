export interface IUser {
  id: string | undefined
  avatar?: string
  email: string | undefined
  name?: string
  password: string | undefined
  type?: string
  /** Сырые метаданные Supabase Auth (для merge при обновлении профиля). */
  user_metadata?: Record<string, unknown>
}

export interface IContractor {
  id: number
  email?: null | string
  inn?: null | string
  name?: null | string
  phone?: null | string
}

export interface ICustomer {
  id: number
  email?: null | string
  name?: null | string
}

export interface IProject {
  id: number
  active: boolean
  address?: string
  /** Подтягивается в GET `/api/projects/[id]` при непустом `contractor_id`. */
  contractor?: IContractor | null
  contractor_id?: null | number
  /** Подтягивается в GET `/api/projects/[id]` при непустом `customer_id`. */
  customer?: ICustomer | null
  customer_id?: null | number
  name: string
  photos_count?: number
  tasks_count?: number
  type: 'commerce' | 'flat' | 'house'
}

export type SaveProjectPayload = {
  id?: number
} & Omit<
  IProject,
  | 'contractor'
  | 'contractor_id'
  | 'customer'
  | 'customer_id'
  | 'id'
  | 'photos_count'
  | 'tasks_count'
>

export interface IGallery {
  id: number
  created_at?: null | string
  project_id?: number
  task_id?: null | number
  url: string
}

export interface IDocument {
  id: number
  created_at?: null | string
  project_id?: number
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
