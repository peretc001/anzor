import React, { FC, useState } from 'react'
import { Button, Form, Input, message, Modal, Select, Switch } from 'antd'

import { IProject } from '@/shared/interfaces'

import { saveProjectApi } from '@/modules/project/api/saveProjectApi'

import styles from './form.module.scss'

type ProjectFormValues = Pick<
  IProject,
  'active' | 'address' | 'contractor' | 'customer' | 'name' | 'type'
>

type IFormProps = {
  readonly project: IProject
  readonly onCancel: () => void
}

const OBJECT_TYPE_OPTIONS = [
  { label: 'Здание', value: 'building' },
  { label: 'Дом', value: 'home' }
]

const FormModal: FC<IFormProps> = ({ project, onCancel }) => {
  const [form] = Form.useForm<ProjectFormValues>()

  const [loading, setLoading] = useState(false)

  const handleSubmitProject = async (values: ProjectFormValues) => {
    setLoading(true)

    const savedProject = await saveProjectApi({ ...project, ...values })

    setLoading(false)

    if (!savedProject) {
      message.error('Не удалось сохранить изменения')
      return
    }

    onCancel()
    message.success('Изменения сохранены')
  }

  const handleFinish = async (values: ProjectFormValues) => {
    await handleSubmitProject(values)
  }

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={{
        active: project.active,
        address: project.address,
        contractor: project.contractor,
        customer: project.customer,
        name: project.name,
        type: project.type
      }}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item<ProjectFormValues>
        label="Название"
        name="name"
        rules={[{ message: 'Введите название объекта', required: true }]}
      >
        <Input placeholder="Например: ЖК Green Park" />
      </Form.Item>

      <Form.Item<ProjectFormValues> label="Адрес" name="address">
        <Input placeholder="Укажите адрес объекта" />
      </Form.Item>

      <Form.Item<ProjectFormValues> label="Заказчик" name="customer">
        <Input placeholder="Название компании заказчика" />
      </Form.Item>

      <Form.Item<ProjectFormValues> label="Подрядчик" name="contractor">
        <Input placeholder="Название компании подрядчика" />
      </Form.Item>

      <Form.Item<ProjectFormValues> label="Тип объекта" name="type">
        <Select options={OBJECT_TYPE_OPTIONS} />
      </Form.Item>

      <Form.Item<ProjectFormValues> label="Активен" name="active" valuePropName="checked">
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

export type { ProjectFormValues }
export default FormModal
