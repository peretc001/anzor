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
