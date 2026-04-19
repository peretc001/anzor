'use client'

import React, { FC } from 'react'

import { IGallery } from '@/shared/interfaces'

import styles from './main.module.scss'

import List from '../list/list'
import UploadDropzone from '../uploadDropzone/uploadDropzone'

type IMainProps = {
  readonly gallery: IGallery[]
  readonly projectId: number
}

const Main: FC<IMainProps> = ({ gallery, projectId }) => (
  <div className={styles.root}>
    <UploadDropzone projectId={projectId} />

    {gallery.length > 0 ? <List gallery={gallery} projectId={projectId} /> : null}
  </div>
)

export default Main
