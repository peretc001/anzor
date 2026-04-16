'use client'

import React, { FC, useState } from 'react'
import { Button, Form, Input, message, Select, Switch } from 'antd'
import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { IProject } from '@/shared/interfaces'

import { PROJECT_TYPES } from '@/constants'

import { saveProjectApi } from '@/modules/projects/api/saveProjectApi'

import styles from './form.module.scss'

type IFormProps = {
  readonly project?: IProject
  readonly onCancel: () => void
}

const FormModal: FC<IFormProps> = ({ project, onCancel }) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const [form] = Form.useForm<IProject>()

  const [loading, setLoading] = useState(false)

  const handleSubmitProject = async (values: IProject) => {
    setLoading(true)

    const savedProject = project
      ? await saveProjectApi({ ...project, ...values })
      : await saveProjectApi(values)

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
    message.success('Изменения сохранены')
  }

  const handleFinish = async (values: IProject) => {
    await handleSubmitProject(values)
  }

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={{
        active: project?.active ?? true,
        address: project?.address,
        contractor: project?.contractor,
        customer: project?.customer,
        name: project?.name,
        type: project?.type ?? 'flat'
      }}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item<IProject>
        label="Название"
        name="name"
        rules={[{ message: 'Введите название объекта', required: true }]}
      >
        <Input placeholder="Например: ЖК Green Park" />
      </Form.Item>

      <Form.Item<IProject> label="Адрес" name="address">
        <Input placeholder="Укажите адрес объекта" />
      </Form.Item>

      <Form.Item<IProject> label="Заказчик" name="customer">
        <Input placeholder="Название компании заказчика" />
      </Form.Item>

      <Form.Item<IProject> label="Подрядчик" name="contractor">
        <Input placeholder="Название компании подрядчика" />
      </Form.Item>

      <Form.Item<IProject> label="Тип объекта" name="type">
        <Select options={PROJECT_TYPES} />
      </Form.Item>

      <Form.Item<IProject> label="Активен" name="active" valuePropName="checked">
        <Switch />
      </Form.Item>

      <div className={styles.actions}>
        <Button disabled={loading} onClick={onCancel}>
          Отмена
        </Button>
        <Button htmlType="submit" loading={loading} type="primary">
          Сохранить
        </Button>
      </div>
    </Form>
  )
}

export default FormModal
