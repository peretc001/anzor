'use client'

import React, { FC, useState } from 'react'
import { Button, message, Modal } from 'antd'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IProblem } from '@/shared/interfaces'

import { saveProblemApi } from '@/modules/problems/api/saveProblemApi'
import Card from '@/modules/problems/components/card/card'
import type { ProblemFormValues } from '@/modules/problems/components/form/form'
import Form from '@/modules/problems/components/form/form'

import styles from './main.module.scss'

type IMainProps = {
  readonly problems: IProblem[]
}

const Main: FC<IMainProps> = ({ problems }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (payload: IProblem) => {
      const saved = await saveProblemApi(payload)
      if (!saved) {
        throw new Error('Не удалось сохранить нарушение')
      }
      return saved
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      handleCloseModal()
    }
  })

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleSubmit = async (values: ProblemFormValues) => {
    try {
      await mutateAsync({
        id: Date.now(),
        control: values.control ? values.control.toISOString() : null,
        description: values.description?.trim() || null,
        executor: values.executor || null,
        photos: values.photos?.length ? values.photos : null,
        title: values.title
      })
      message.success('Нарушение добавлено')
    } catch {
      message.error('Не удалось сохранить нарушение')
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Button type="primary" onClick={handleOpenModal}>
          Добавить нарушение
        </Button>
      </div>

      {problems.length > 0 && (
        <ul className={styles.list}>
          {problems.map(problem => (
            <Card key={problem.id} problem={problem} />
          ))}
        </ul>
      )}

      <Modal
        destroyOnHidden
        footer={null}
        open={isModalOpen}
        title="Добавить нарушение"
        onCancel={handleCloseModal}
      >
        <Form submitting={isPending} onCancel={handleCloseModal} onSubmit={handleSubmit} />
      </Modal>
    </div>
  )
}

export default Main
