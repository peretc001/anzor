import React, { FC } from 'react'
import { Button, DatePicker, Form, Input, Select } from 'antd'
import type { Dayjs } from 'dayjs'

import styles from './form.module.scss'

type ProblemFormValues = {
  control?: Dayjs
  description?: string
  executor?: string
  photos?: string[]
  title: string
}

type IFormProps = {
  readonly submitting?: boolean
  readonly onCancel: () => void
  readonly onSubmit?: (values: ProblemFormValues) => Promise<void> | void
}

const EXECUTOR_OPTIONS = [
  { label: 'Исполнитель', value: 'Исполнитель' },
  { label: 'Подрядчик', value: 'Подрядчик' },
  { label: 'Дизайнер', value: 'Дизайнер' }
]

const FormModal: FC<IFormProps> = ({ submitting = false, onCancel, onSubmit }) => {
  const [form] = Form.useForm<ProblemFormValues>()

  const handleFinish = async (values: ProblemFormValues) => {
    await onSubmit?.(values)
    form.resetFields()
  }

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={{ executor: 'Исполнитель', photos: [] }}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item<ProblemFormValues>
        label="Заголовок"
        name="title"
        rules={[{ message: 'Введите заголовок', required: true }]}
      >
        <Input placeholder="Например: Кривая стена в зоне фартука кухни" />
      </Form.Item>

      <Form.Item<ProblemFormValues> label="Описание" name="description">
        <Input.TextArea
          autoSize={{ maxRows: 5, minRows: 3 }}
          placeholder="Опишите задачу и что нужно исправить"
        />
      </Form.Item>

      <Form.Item<ProblemFormValues> label="Ответственный" name="executor">
        <Select options={EXECUTOR_OPTIONS} placeholder="Выберите ответственного" />
      </Form.Item>

      <Form.Item<ProblemFormValues> label="Ожидаемая дата выполнения" name="control">
        <DatePicker className={styles.fullWidth} format="DD.MM.YYYY" />
      </Form.Item>

      <Form.Item<ProblemFormValues>
        extra="Добавьте одну или несколько ссылок на фото"
        label="Фото"
        name="photos"
      >
        <Select
          mode="tags"
          placeholder="https://example.com/photo.jpg"
          tokenSeparators={[',', ' ']}
        />
      </Form.Item>

      <div className={styles.actions}>
        <Button disabled={submitting} onClick={onCancel}>
          Отмена
        </Button>
        <Button htmlType="submit" loading={submitting} type="primary">
          Добавить
        </Button>
      </div>
    </Form>
  )
}

export type { ProblemFormValues }
export default FormModal
