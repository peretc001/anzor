'use client'

import React, { FC, useState } from 'react'
import { Button, message, Modal } from 'antd'
import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ITask } from '@/shared/interfaces'

import { addGalleryApi } from '@/modules/gallery/api/addGalleryApi'
import { saveTaskApi } from '@/modules/tasks/api/saveTaskApi'
import { updateTaskApi } from '@/modules/tasks/api/updateTaskApi'
import Card from '@/modules/tasks/components/card/card'
import type { TaskFormValues } from '@/modules/tasks/components/form/form'
import Form from '@/modules/tasks/components/form/form'

import styles from './main.module.scss'

type IMainProps = {
  readonly projectId: number
  readonly tasks: ITask[]
}

type CreateTaskWithPhotosResult = {
  readonly task: ITask
  readonly taskPhotosUpdateFailed: boolean
  readonly uploadAttempted: number
  readonly uploadFailedCount: number
  readonly uploadSuccessCount: number
}

const ADD_TASK_LABEL = 'Добавить задачу'

const Main: FC<IMainProps> = ({ projectId, tasks }) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (values: TaskFormValues): Promise<CreateTaskWithPhotosResult> => {
      const createdTask = await saveTaskApi({
        control: values.control ? values.control.toISOString() : null,
        description: values.description?.trim() || null,
        executor: values.executor || null,
        photos: null,
        priority: 'medium',
        project_id: projectId,
        status: values.status,
        title: values.title,
        type: values.type
      })

      if (!createdTask) {
        throw new Error('Не удалось сохранить задачу')
      }

      const uploadFiles =
        values.photos?.flatMap(file =>
          file.originFileObj instanceof File ? [file.originFileObj] : []
        ) ?? []

      if (uploadFiles.length === 0) {
        return {
          task: createdTask,
          taskPhotosUpdateFailed: false,
          uploadAttempted: 0,
          uploadFailedCount: 0,
          uploadSuccessCount: 0
        }
      }

      const uploadedUrls: string[] = []
      let uploadFailedCount = 0

      for (const file of uploadFiles) {
        try {
          const url = await addGalleryApi({ file, projectId, taskId: createdTask.id })
          if (url) {
            uploadedUrls.push(url)
          } else {
            uploadFailedCount += 1
          }
        } catch {
          uploadFailedCount += 1
        }
      }

      let task = createdTask
      let taskPhotosUpdateFailed = false

      if (uploadedUrls.length > 0) {
        const updatedTask = await updateTaskApi(createdTask.id, { photos: uploadedUrls })
        if (updatedTask) {
          task = updatedTask
        } else {
          taskPhotosUpdateFailed = true
        }
      }

      return {
        task,
        taskPhotosUpdateFailed,
        uploadAttempted: uploadFiles.length,
        uploadFailedCount,
        uploadSuccessCount: uploadedUrls.length
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['gallery', projectId] })
      router.refresh()
      handleCloseModal()
    }
  })

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleSubmit = async (values: TaskFormValues) => {
    try {
      const result = await mutateAsync(values)
      message.success('Задача добавлена')

      const parts: string[] = []
      if (result.uploadAttempted > 0 && result.uploadFailedCount > 0) {
        parts.push(
          `Не удалось загрузить ${result.uploadFailedCount} из ${result.uploadAttempted} фото.`
        )
      }
      if (result.taskPhotosUpdateFailed) {
        parts.push(
          'Список фото в задаче не обновился; успешно загруженные файлы остаются в галерее с привязкой к задаче.'
        )
      }
      if (parts.length > 0) {
        message.warning(parts.join(' '))
      }
    } catch {
      message.error('Не удалось сохранить задачу')
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Button type="primary" onClick={handleOpenModal}>
          {ADD_TASK_LABEL}
        </Button>
      </div>

      {tasks.length > 0 && (
        <ul className={styles.list}>
          {tasks.map(task => (
            <Card key={task.id} projectId={projectId} task={task} />
          ))}
        </ul>
      )}

      <Modal
        destroyOnHidden
        footer={null}
        open={isModalOpen}
        title={ADD_TASK_LABEL}
        onCancel={handleCloseModal}
      >
        <Form submitting={isPending} onCancel={handleCloseModal} onSubmit={handleSubmit} />
      </Modal>
    </div>
  )
}

export default Main
