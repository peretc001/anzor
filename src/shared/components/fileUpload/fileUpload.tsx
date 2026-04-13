import React, { FC, useState } from 'react'
import { message } from 'antd'
import cns from 'classnames'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'

import { PhotoIcon } from '@heroicons/react/24/outline'

import styles from './fileUpload.module.scss'

import FilePreview from '../filePreview/filePreview'

interface IFileUpload {
  readonly isLoading: boolean
  readonly file: string | undefined
  readonly onDelete: () => void
  readonly onUpload: (file: File) => void
}

const FileUpload: FC<IFileUpload> = ({ isLoading, file, onDelete, onUpload }) => {
  const t = useTranslations('account')

  const [isDragged, setIsDragged] = useState<boolean>(false)

  const { getInputProps, getRootProps } = useDropzone({
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDragEnter: () => {
      setIsDragged(true)
    },
    onDragLeave: () => {
      setIsDragged(false)
    },
    onDrop: acceptedFiles => {
      onUpload(acceptedFiles[0])
      setIsDragged(false)
    },
    onDropRejected: async () => {
      message.error(t('about.upload.error'))
      setIsDragged(false)
    }
  })

  return (
    <section className={styles.root}>
      {file ? (
        <FilePreview isLoading={isLoading} avatar={file} handleDeleteFile={onDelete} />
      ) : null}

      {!file && (
        // eslint-disable-next-line
        <div {...getRootProps({ className: 'dropzone' })}>
          <div
            className={cns(styles.add, isLoading && styles.loading, isDragged && styles.dragged)}
          >
            <PhotoIcon className={styles.icon} />
          </div>
          <input
            // eslint-disable-next-line
            {...getInputProps()}
          />
        </div>
      )}
    </section>
  )
}

export default FileUpload
