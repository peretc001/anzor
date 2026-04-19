'use client'

import React, { FC, useCallback, useState } from 'react'
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

type SaveTaskWithPhotosResult = {
  readonly task: ITask
  readonly taskPhotosUpdateFailed: boolean
  readonly uploadAttempted: number
  readonly uploadFailedCount: number
  readonly uploadSuccessCount: number
}

const ADD_TASK_LABEL = 'Добавить задачу'
const EDIT_TASK_TITLE = 'Редактирование задачи'

const Main: FC<IMainProps> = ({ projectId, tasks }) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ITask | null>(null)
  const queryClient = useQueryClient()

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingTask(null)
  }, [])

  const afterSave = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    await queryClient.invalidateQueries({ queryKey: ['gallery', projectId] })
    router.refresh()
    handleCloseModal()
  }, [handleCloseModal, projectId, queryClient, router])

  const { isPending: isCreating, mutateAsync: createTask } = useMutation({
    mutationFn: async (values: TaskFormValues): Promise<SaveTaskWithPhotosResult> => {
      const createdTask = await saveTaskApi({
        control: values.control ? values.control.toISOString() : null,
        description: values.description?.trim() || null,
        executor: values.executor || null,
        photos: null,
        priority: values.priority,
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
    onSuccess: afterSave
  })

  const { isPending: isUpdating, mutateAsync: updateTask } = useMutation({
    mutationFn: async ({
      taskId,
      values
    }: {
      readonly taskId: number
      readonly values: TaskFormValues
    }): Promise<SaveTaskWithPhotosResult> => {
      const keptPaths = values.photos
        .filter(f => f.status === 'done' && !(f.originFileObj instanceof File))
        .map(f => String(f.uid))

      const uploadFiles =
        values.photos?.flatMap(file =>
          file.originFileObj instanceof File ? [file.originFileObj] : []
        ) ?? []

      const uploadedUrls: string[] = []
      let uploadFailedCount = 0

      for (const file of uploadFiles) {
        try {
          const url = await addGalleryApi({ file, projectId, taskId })
          if (url) {
            uploadedUrls.push(url)
          } else {
            uploadFailedCount += 1
          }
        } catch {
          uploadFailedCount += 1
        }
      }

      const finalPhotos = [...keptPaths, ...uploadedUrls]

      const updatedTask = await updateTaskApi(taskId, {
        control: values.control ? values.control.toISOString() : null,
        description: values.description?.trim() || null,
        executor: values.executor || null,
        photos: finalPhotos,
        priority: values.priority,
        status: values.status,
        title: values.title.trim(),
        type: values.type
      })

      if (!updatedTask) {
        throw new Error('Не удалось обновить задачу')
      }

      return {
        task: updatedTask,
        taskPhotosUpdateFailed: false,
        uploadAttempted: uploadFiles.length,
        uploadFailedCount,
        uploadSuccessCount: uploadedUrls.length
      }
    },
    onSuccess: afterSave
  })

  const handleOpenModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (task: ITask) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      if (editingTask) {
        const result = await updateTask({ taskId: editingTask.id, values })
        message.success('Задача обновлена')

        const parts: string[] = []
        if (result.uploadAttempted > 0 && result.uploadFailedCount > 0) {
          parts.push(
            `Не удалось загрузить ${result.uploadFailedCount} из ${result.uploadAttempted} фото.`
          )
        }
        if (parts.length > 0) {
          message.warning(parts.join(' '))
        }
      } else {
        const result = await createTask(values)
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
      }
    } catch {
      message.error(editingTask ? 'Не удалось обновить задачу' : 'Не удалось сохранить задачу')
    }
  }

  const isSaving = isCreating || isUpdating

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
            <Card key={task.id} projectId={projectId} task={task} onEdit={handleOpenEdit} />
          ))}
        </ul>
      )}

      <Modal
        className={styles.modal}
        centered={false}
        destroyOnHidden
        footer={null}
        maskTransitionName="fade"
        open={isModalOpen}
        title={editingTask ? EDIT_TASK_TITLE : ADD_TASK_LABEL}
        transitionName=""
        width={600}
        wrapClassName={styles.modalWrap}
        onCancel={handleCloseModal}
      >
        <Form
          key={editingTask ? editingTask.id : 'new'}
          editingTask={editingTask}
          submitting={isSaving}
          onCancel={handleCloseModal}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  )
}

export default Main
