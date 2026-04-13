import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'

const bucket = process.env.S3_BUCKET_NAME!
const endpoint = process.env.S3_ENDPOINT!
const region = process.env.S3_REGION!
const accessKeyId = process.env.S3_ACCESS_KEY_ID!
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY!

const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  endpoint,
  forcePathStyle: true,
  region
})

export async function s3UploadFile(params: {
  key: string
  body: Uint8Array
  contentType: string
}) {
  const { key, body, contentType } = params

  await s3.send(
    new PutObjectCommand({
      Body: body,
      Bucket: bucket,
      ContentType: contentType,
      Key: key
    })
  )
}

export async function s3DeleteObject(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    })
  )
}

/** Удаляет все объекты с префиксом (как «папку» в S3). */
export async function s3DeletePrefix(prefix: string) {
  const normalized = prefix.replace(/\/+$/, '') + '/'
  let continuationToken: string | undefined

  do {
    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
        Prefix: normalized
      })
    )

    const keys = (list.Contents ?? []).map(o => o.Key).filter((k): k is string => Boolean(k))

    if (keys.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: keys.map(Key => ({ Key })),
            Quiet: true
          }
        })
      )
    }

    continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined
  } while (continuationToken)
}

export function s3KeyFromStoredUrl(url: string): null | string {
  if (!url) return null

  if (url.startsWith('/')) {
    return decodeURIComponent(url.replace(/^\/+/, ''))
  }

  try {
    const parsed = new URL(url)
    const withoutSlash = parsed.pathname.replace(/^\/+/, '')
    const withDecoded = decodeURIComponent(withoutSlash)

    if (withDecoded.startsWith(`${bucket}/`)) {
      return withDecoded.slice(bucket.length + 1)
    }

    return withDecoded
  } catch {
    return null
  }
}
