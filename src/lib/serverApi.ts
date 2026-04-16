import { getToken } from '@/lib/cookie'

/** Абсолютный host из env; на сервере относительный путь в fetch недопустим. */
const DEFAULT_API_HOST =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/'
    : (process.env.NEXT_PUBLIC_API_URL as string)

// Типы для параметров запроса и настроек Fetch
interface FetchParams {
  body?: BodyInit
  credentials?: 'include' | 'omit' | 'same-origin'
  headers: Record<string, string>
  method?: 'DELETE' | 'GET' | 'POST'
  mode?: 'cors' | 'no-cors' | 'same-origin'
  signal?: AbortSignal
}

// Константы с параметрами по умолчанию для запросов
const FETCH_PARAMS: FetchParams = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  mode: 'cors'
}

const token = getToken()
if (token) {
  FETCH_PARAMS.headers['Authorization'] = `Bearer ${token}`
}

class ServerApi {
  static delete(
    apiMethod: string,
    params: Record<string, any> = {},
    signal?: AbortSignal,
    host: string = DEFAULT_API_HOST
  ): Promise<any> {
    const fetchParams = { ...FETCH_PARAMS, method: 'DELETE' as const, signal }
    const paramsStr = Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&')

    return fetch(host + apiMethod + (paramsStr ? `?${paramsStr}` : ''), fetchParams)
      .then(response =>
        response.ok
          ? response.json()
          : response.json().then((body: any) => {
            const msg =
                body?.message ?? body?.error ?? response.statusText ?? String(response.status)
            throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
          })
      )
      .catch(err => {
        throw err instanceof Error ? err : new Error(String(err))
      })
  }

  /**
   * POST с multipart/form-data: не задаёт Content-Type — граница подставляется автоматически.
   */
  static file(
    apiMethod: string,
    formData: FormData,
    signal?: AbortSignal,
    host: string = DEFAULT_API_HOST
  ): Promise<any> {
    const headers: Record<string, string> = { ...FETCH_PARAMS.headers }
    delete headers['Content-Type']

    const fetchParams: FetchParams = {
      body: formData,
      credentials: FETCH_PARAMS.credentials,
      headers,
      method: 'POST',
      mode: FETCH_PARAMS.mode,
      signal
    }

    return fetch(host + apiMethod, fetchParams)
      .then(response =>
        response.ok
          ? response.json()
          : response.json().then((body: any) => {
            const msg =
                body?.message ?? body?.error ?? response.statusText ?? String(response.status)
            throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
          })
      )
      .catch(err => {
        throw err instanceof Error ? err : new Error(String(err))
      })
  }

  // Метод GET запроса
  static async get(
    apiMethod: string,
    params: Record<string, any> = {},
    signal?: AbortSignal,
    host: string = DEFAULT_API_HOST,
    extraHeaders?: Record<string, string>
  ): Promise<any> {
    let serverCookieHeader: Record<string, string> = {}

    if (typeof window === 'undefined') {
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const cookieValue = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ')

      if (cookieValue) {
        serverCookieHeader = { cookie: cookieValue }
      }
    }

    const fetchParams: FetchParams = {
      ...FETCH_PARAMS,
      headers: {
        ...FETCH_PARAMS.headers,
        ...serverCookieHeader,
        ...extraHeaders
      },
      method: 'GET',
      signal
    }
    const paramsStr = Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&')

    return fetch(host + apiMethod + (paramsStr ? `?${paramsStr}` : ''), fetchParams)
      .then(response =>
        response.ok
          ? response.json()
          : response.json().then((body: any) => {
            const msg =
                body?.message ?? body?.error ?? response.statusText ?? String(response.status)
            throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
          })
      )
      .catch(err => {
        throw err instanceof Error ? err : new Error(String(err))
      })
  }

  // Метод POST запроса
  static post(
    apiMethod: string,
    params: Record<string, any> = {},
    signal?: AbortSignal,
    host: string = DEFAULT_API_HOST
  ): Promise<any> {
    const fetchParams: FetchParams = {
      body: JSON.stringify(params),
      headers: FETCH_PARAMS.headers,
      method: 'POST',
      signal
    }

    return fetch(host + apiMethod, fetchParams)
      .then(response =>
        response.ok
          ? response.json()
          : response.json().then((body: any) => {
            const msg =
                body?.message ?? body?.error ?? response.statusText ?? String(response.status)
            throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
          })
      )
      .catch(err => {
        throw err instanceof Error ? err : new Error(String(err))
      })
  }
}

export default ServerApi
