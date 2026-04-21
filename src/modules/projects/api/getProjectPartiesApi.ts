import type { IContractor, ICustomer } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export type ProjectParties = {
  contractor: IContractor | null
  customer: ICustomer | null
}

export const getProjectPartiesApi = async (projectId: number): Promise<ProjectParties | null> => {
  try {
    const response = await serverApi.get(`projects/${projectId}/parties`)
    const payload = response?.data as ProjectParties | undefined
    return payload ?? null
  } catch {
    return null
  }
}
