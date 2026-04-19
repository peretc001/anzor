/** Собирает публичный URL аватара так же, как в `FilePreview` (S3 + относительный путь). */
export function resolveAvatarPublicUrl(stored: string | undefined): string {
  if (!stored) return ''
  if (/^https?:\/\//i.test(stored)) return stored
  const base = process.env.NEXT_PUBLIC_S3_PATH ?? ''
  return `${base}${stored}`
}
