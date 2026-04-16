'use client'

import React, { FC, useState } from 'react'
import { Button, message, Modal } from 'antd'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ITask } from '@/shared/interfaces'

import { saveTaskApi } from '@/modules/tasks/api/saveTaskApi'
import Card from '@/modules/tasks/components/card/card'
import type { ProblemFormValues } from '@/modules/tasks/components/form/form'
import Form from '@/modules/tasks/components/form/form'

import styles from './main.module.scss'

type IMainProps = {
  readonly tasks: ITask[]
}

const Main: FC<IMainProps> = ({ tasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (payload: IProblem) => {
      const saved = await saveTaskApi(payload)
      if (!saved) {
        throw new Error('Не удалось сохранить задачу')
      }
      return saved
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
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
      message.success('Задача добавлена')
    } catch {
      message.error('Не удалось сохранить задачу')
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Button type="primary" onClick={handleOpenModal}>
          Добавить задачу
        </Button>
      </div>

      {tasks.length > 0 && (
        <ul className={styles.list}>
          {tasks.map(task => (
            <Card key={task.id} task={task} />
          ))}
        </ul>
      )}

      <Modal
        destroyOnHidden
        footer={null}
        open={isModalOpen}
        title="Добавить задачу"
        onCancel={handleCloseModal}
      >
        <Form submitting={isPending} onCancel={handleCloseModal} onSubmit={handleSubmit} />
      </Modal>
    </div>
  )
}

export default Main
