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
  type: 'building' | 'home'
}

export interface IGallery {
  id: number
  month: string
  url: string
}

export interface IProblem {
  id: number
  title: string
  description?: string | null
  executor?: string | null
  photos?: string[] | null
  control?: string | null
  /** Количество комментариев (если появится в БД) */
  comments_count?: number | null
  /** open — открыто, resolved — исправлено */
  status?: 'open' | 'resolved' | null
  owner_id?: string
  created_at?: string
}
