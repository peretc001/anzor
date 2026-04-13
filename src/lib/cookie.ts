export const TOKEN_COOKIE_NAME = process.env.NEXT_PUBLIC_ACCESS_TOKEN

export function setToken(value: string, maxAgeDays = 7): void {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setDate(expires.getDate() + maxAgeDays)
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
}

export function getToken(): null | string {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function removeToken(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
