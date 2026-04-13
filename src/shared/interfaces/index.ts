import { DESIGN_TYPES } from '@/constants'

export interface IUser {
  id: string | undefined
  email: string | undefined
  password: string | undefined
  user_metadata?: any
}

export interface IProfile {
  id: number
  styles: string[]
  stylesLabel: IType[]
  avatar: string
  city: string
  city_code: string
  contacts: IContacts
  created_at: string
  description: string
  experience: string
  experienceLabel: string
  first_name: string
  gallery: IGallery[]
  inspected: boolean
  last_name: string
  middle_name: string
  name: string
  owner_id: string
  portfolio: IPortfolio[]
  prices: IPrices
  segments: string[]
  spaces: string[]
  status: string
  statusLabel: string
  telegram: string
  types: string[]
}

export interface IGallery {
  id: number
  created_at: string
  description: string
  owner_id: number
  type: string
  url: string
}

export interface IPortfolio {
  id: number
  created_at: string
  description: string
  file: null | string
  owner_id: number
  photos: string[]
  price: string
  title: string
  type: string
}

export interface IType {
  label: string
  unit: string
  value: string
}

export interface IOption {
  label: string
  value: string
}

export interface IContacts {
  instagram: string | undefined
  max: string | undefined
  pinterest: string | undefined
  telegram: string | undefined
}

type DesignTypeValue = (typeof DESIGN_TYPES)[number]['value']

type PriceSuffix = 'max' | 'min'

export type IPrices = {
  [K in DesignTypeValue as `${K}_${PriceSuffix}`]?: string | undefined
}
