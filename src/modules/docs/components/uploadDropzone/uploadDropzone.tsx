'use client'

import React, { type FC, useCallback, useState } from 'react'
import { message } from 'antd'
import { useRouter } from 'next/navigation'
import { type FileRejection, useDropzone } from 'react-dropzone'

import { useQueryClient } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import styles from './uploadDropzone.module.scss'

import { addDocumentsApi } from '../../api/addDocumentsApi'

const MAX_BYTES = 20 * 1024 * 1024

const MAX_FILES_PER_BATCH = 20

const ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/x-pdf': ['.pdf']
} as const

const HINT_FORMATS = `PDF · до 20 МБ · до ${MAX_FILES_PER_BATCH} файлов за раз`

const MSG_MAX_FILES = `За один раз можно выбрать не более ${MAX_FILES_PER_BATCH} файлов — лишние не были добавлены`

const MSG_REJECT_PARTIAL = 'Некоторые файлы пропущены: допустим только PDF, размер до 20 МБ'

const MSG_REJECT_MIXED = `Часть файлов не загружена: не более ${MAX_FILES_PER_BATCH} за раз; допустимы только PDF до 20 МБ`

const SUCCESS_ONE = 'Документ добавлен'

const TITLE_DRAG = 'Отпустите файлы для загрузки'

const TITLE_IDLE = 'Перетащите PDF сюда или нажмите для выбора'

type UploadDropzoneProps = {
  readonly projectId: number
}

const UploadDropzone: FC<UploadDropzoneProps> = ({ projectId }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const tooMany = fileRejections.some(r =>
          r.errors.some(e => e.code === 'too-many-files')
        )
        const other = fileRejections.some(r =>
          r.errors.some(e => e.code !== 'too-many-files')
        )
        if (tooMany && other) {
          message.warning(MSG_REJECT_MIXED)
        } else if (tooMany) {
          message.warning(MSG_MAX_FILES)
        } else {
          message.warning(MSG_REJECT_PARTIAL)
        }
      }

      const files = acceptedFiles.slice(0, MAX_FILES_PER_BATCH)
      if (files.length === 0) {
        return
      }

      setIsUploading(true)
      let succeeded = 0
      for (const file of files) {
        try {
          await addDocumentsApi({ file, projectId })
          succeeded += 1
        } catch {
          message.error(`Не удалось загрузить: ${file.name}`)
        }
      }

      if (succeeded > 0) {
        await queryClient.invalidateQueries({ queryKey: ['documents', projectId] })
        router.refresh()
        message.success(
          succeeded === 1 ? SUCCESS_ONE : `Добавлено документов: ${succeeded}`
        )
      }
      setIsUploading(false)
    },
    [projectId, queryClient, router]
  )

  const { isDragActive, getInputProps, getRootProps } = useDropzone({
    accept: ACCEPT,
    disabled: isUploading,
    maxFiles: MAX_FILES_PER_BATCH,
    maxSize: MAX_BYTES,
    multiple: true,
    onDrop
  })

  const rootProps = getRootProps()
  const inputProps = getInputProps()
  const rootClassName = `${styles.root}${isDragActive ? ` ${styles.active}` : ''}${isUploading ? ` ${styles.disabled}` : ''}`

  /* react-dropzone: getRootProps / getInputProps отдают ref и обработчики только через spread */
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <>
      {isUploading ? <Loader isFull /> : null}
      <div {...rootProps} className={rootClassName}>
        <input {...inputProps} />
        <p className={styles.title}>{isDragActive ? TITLE_DRAG : TITLE_IDLE}</p>
        <p className={styles.hint}>{HINT_FORMATS}</p>
      </div>
    </>
  )
  /* eslint-enable react/jsx-props-no-spreading */
}

export default UploadDropzone
