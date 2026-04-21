'use client'

import React, { FC, useCallback, useState } from 'react'
import { Button, Form, Input, message, Radio } from 'antd'
import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import {
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

import type { IProject, SaveProjectPayload } from '@/shared/interfaces'

import { saveProjectApi } from '@/modules/projects/api/saveProjectApi'

import styles from './form.module.scss'

type IFormProps = {
  readonly project?: IProject
  readonly onCancel: () => void
}

const useSaveProject = (project: IProject | undefined, onCancel: () => void) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const save = useCallback(
    async (values: SaveProjectPayload) => {
      setLoading(true)

      const savedProject = project
        ? await saveProjectApi({ ...project, ...values } as SaveProjectPayload)
        : await saveProjectApi(values as SaveProjectPayload)

      setLoading(false)

      if (!savedProject) {
        message.error('Не удалось сохранить изменения')
        return
      }

      await queryClient.invalidateQueries({ queryKey: ['projects'] })

      if (project?.id) {
        await queryClient.invalidateQueries({ queryKey: ['project', project.id] })
        router.refresh()
      }

      onCancel()
      message.success(project ? 'Изменения сохранены' : 'Объект создан')
    },
    [onCancel, project, queryClient, router]
  )

  return { loading, save }
}

/** Создание и редактирование: только тип, название и адрес (исполнитель/заказчик — отдельно). */
const ProjectObjectForm: FC<IFormProps> = ({ project, onCancel }) => {
  const [form] = Form.useForm<SaveProjectPayload>()
  const { loading, save } = useSaveProject(project, onCancel)
  const isEdit = Boolean(project)

  return (
    <Form
      className={styles.editForm}
      form={form}
      initialValues={
        project
          ? {
              active: project.active,
              address: project.address,
              name: project.name,
              type: project.type
            }
          : {
              active: true,
              address: undefined,
              name: undefined,
              type: 'flat'
            }
      }
      layout="vertical"
      onFinish={save}
    >
      <Form.Item<SaveProjectPayload> hidden name="active">
        <Input hidden />
      </Form.Item>

      <Form.Item<SaveProjectPayload>
        className={styles.typeField}
        label="Тип объекта"
        name="type"
        rules={[{ message: 'Выберите тип объекта', required: true }]}
      >
        <Radio.Group className={styles.typeRadioGroup}>
          <Radio className={styles.typeRadioOption} value="flat">
            <span className={styles.typeCard}>
              <BuildingOffice2Icon className={styles.icon} aria-hidden />
            </span>
            <span className={styles.typeCaption}>Квартира</span>
          </Radio>
          <Radio className={styles.typeRadioOption} value="house">
            <span className={styles.typeCard}>
              <HomeIcon className={styles.icon} aria-hidden />
            </span>
            <span className={styles.typeCaption}>Дом</span>
          </Radio>
          <Radio className={styles.typeRadioOption} value="commerce">
            <span className={styles.typeCard}>
              <BuildingStorefrontIcon className={styles.icon} aria-hidden />
            </span>
            <span className={styles.typeCaption}>Коммерция</span>
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item<SaveProjectPayload>
        label="Название объекта"
        name="name"
        rules={[{ message: 'Введите название объекта', required: true }]}
      >
        <Input placeholder="Квартира на Тверской" size="large" />
      </Form.Item>

      <Form.Item<SaveProjectPayload>
        label="Адрес"
        name="address"
        rules={[{ message: 'Укажите адрес', required: true }]}
      >
        <Input placeholder="г. Москва, ул. Пушкина, д. 1, кв. 10" size="large" />
      </Form.Item>

      <div className={styles.editFooter}>
        <Button disabled={loading} size="large" onClick={onCancel}>
          Отмена
        </Button>
        <Button htmlType="submit" loading={loading} size="large" type="primary">
          {isEdit ? 'Сохранить' : 'Создать объект'}
        </Button>
      </div>
    </Form>
  )
}

const FormModal: FC<IFormProps> = ({ project, onCancel }) => (
  <ProjectObjectForm project={project} onCancel={onCancel} />
)

export default FormModal
