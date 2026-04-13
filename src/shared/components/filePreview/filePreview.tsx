import React, { FC } from 'react'
import cns from 'classnames'
import Image from 'next/image'

import { XMarkIcon } from '@heroicons/react/24/outline'

import styles from './filePreview.module.scss'

interface IFilePreview {
  readonly isLoading: boolean
  readonly avatar: string
  readonly handleDeleteFile: () => void
}

const FilePreview: FC<IFilePreview> = ({ isLoading, avatar, handleDeleteFile }) => (
  <div className={cns(styles.root, isLoading && styles.loading)}>
    <div className={styles.delete} onClick={handleDeleteFile}>
      <XMarkIcon className={styles.icon} />
    </div>

    <div className={styles.preview}>
      {avatar ? <Image alt="" height={100} loading="lazy" src={avatar} width={100} /> : null}
    </div>
  </div>
)

export default FilePreview
