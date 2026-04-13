interface s3ImageLoaderProps {
  height: string
  quality: string
  src: string
  width: string
}

export default function s3ImageLoader({ height, quality, src, width }: s3ImageLoaderProps) {
  return `${process.env.NEXT_PUBLIC_S3_PATH}${src}?width=${width}&height=${height}&quality=${quality || 75}`
}
