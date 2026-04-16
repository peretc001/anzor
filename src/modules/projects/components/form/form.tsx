import React, { FC, useEffect } from 'react'
import { Button, Form, Input, Modal, Select, Switch } from 'antd'

import { IProject } from '@/shared/interfaces'

import styles from './form.module.scss'

type ProjectFormValues = Pick<
  IProject,
  'active' | 'address' | 'contractor' | 'customer' | 'name' | 'type'
>

type IFormProps = {
  readonly open: boolean
  readonly submitting?: boolean
  readonly onCancel: () => void
  readonly onSubmit?: (values: ProjectFormValues) => Promise<void> | void
}

const OBJECT_TYPE_OPTIONS = [
  { label: 'Здание', value: 'building' },
  { label: 'Дом', value: 'home' }
]

const FormModal: FC<IFormProps> = ({ open, submitting = false, onCancel, onSubmit }) => {
  const [form] = Form.useForm<ProjectFormValues>()

  useEffect(() => {
    if (!open) return

    form.setFieldsValue({
      active: true,
      address: undefined,
      contractor: undefined,
      customer: undefined,
      name: '',
      type: 'building'
    })
  }, [form, open])

  const handleFinish = async (values: ProjectFormValues) => {
    await onSubmit?.(values)
  }

  return (
    <Modal
      destroyOnHidden
      footer={null}
      open={open}
      title="Создание объекта"
      onCancel={onCancel}
    >
      <Form
        className={styles.root}
        form={form}
        initialValues={{ active: true, type: 'building' }}
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
          <Button disabled={submitting} onClick={onCancel}>
            Отмена
          </Button>
          <Button htmlType="submit" loading={submitting} type="primary">
            Создать
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export type { ProjectFormValues }
export default FormModal
