'use client'

import React, { FC } from 'react'

import { IDocument } from '@/shared/interfaces'

import styles from './main.module.scss'

import List from '../list/list'
import UploadDropzone from '../uploadDropzone/uploadDropzone'

type IMainProps = {
  readonly documents: IDocument[]
  readonly projectId: number
}

const Main: FC<IMainProps> = ({ documents, projectId }) => (
  <div className={styles.root}>
    <UploadDropzone projectId={projectId} />

    {documents.length > 0 ? <List documents={documents} projectId={projectId} /> : null}
  </div>
)

export default Main
