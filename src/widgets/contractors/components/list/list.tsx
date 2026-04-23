import React, { FC } from 'react'

import { IContractor } from '@/shared/interfaces'

import styles from './list.module.scss'

import Empty from '@/widgets/contractors/components/empty/empty'

interface IList {
  readonly contractors: IContractor[]
}

const List: FC<IList> = ({ contractors }) => (
  <div className={styles.root}>
    {contractors.length > 0 ? (
      <div className={styles.list}>
        {contractors.map((card: IContractor) => (
          <div key={card.id}>{card.name}</div>
        ))}
      </div>
    ) : (
      <Empty />
    )}
  </div>
)

export default List
