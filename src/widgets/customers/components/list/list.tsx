import React, { FC } from 'react'

import { ICustomer } from '@/shared/interfaces'

import styles from './list.module.scss'

import Empty from '@/widgets/contractors/components/empty/empty'

interface IList {
  readonly customers: ICustomer[]
}

const List: FC<IList> = ({ customers }) => (
  <div className={styles.root}>
    {customers.length > 0 ? (
      <div className={styles.list}>
        {customers.map((card: ICustomer) => (
          <div key={card.id}>{card.name}</div>
        ))}
      </div>
    ) : (
      <Empty />
    )}
  </div>
)

export default List
