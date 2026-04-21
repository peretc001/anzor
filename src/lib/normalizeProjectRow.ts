import type { ICustomer, IContractor, IProject } from '@/shared/interfaces'

/** Сборка `IProject`: вложение PostgREST (`contractors` / `customers`) или уже проставленные `contractor` / `customer`. */
export function normalizeProjectRow(row: Record<string, unknown>): IProject {
  const contractors = row.contractors ?? row.contractor
  const customers = row.customers ?? row.customer

  const contractor =
    contractors == null
      ? null
      : Array.isArray(contractors)
        ? (contractors[0] as IContractor | undefined) ?? null
        : (contractors as IContractor)

  const customer =
    customers == null
      ? null
      : Array.isArray(customers)
        ? (customers[0] as ICustomer | undefined) ?? null
        : (customers as ICustomer)

  const {
    contractors: _c,
    customers: _u,
    contractor: _co,
    customer: _cu,
    ...rest
  } = row

  return {
    ...(rest as Omit<IProject, 'contractor' | 'customer'>),
    contractor,
    customer
  }
}
