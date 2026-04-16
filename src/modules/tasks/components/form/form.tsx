import React, { FC } from 'react'
import { Button, DatePicker, Form, Input, Select, Upload } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import type { Dayjs } from 'dayjs'
import { UploadOutlined } from '@ant-design/icons'

import { EXECUTOR_TYPES } from '@/constants'

import styles from './form.module.scss'

type TaskFormValues = {
  control?: Dayjs
  description?: string
  executor?: string
  photos?: UploadFile[]
  title: string
}

type IFormProps = {
  readonly submitting?: boolean
  readonly onCancel: () => void
  readonly onSubmit?: (values: TaskFormValues) => Promise<void> | void
}

const FormModal: FC<IFormProps> = ({ submitting = false, onCancel, onSubmit }) => {
  const [form] = Form.useForm<TaskFormValues>()

  const handleFinish = async (values: TaskFormValues) => {
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
      <Form.Item<TaskFormValues>
        label="Заголовок"
        name="title"
        rules={[{ message: 'Введите заголовок', required: true }]}
      >
        <Input placeholder="Например: Кривая стена в зоне фартука кухни" />
      </Form.Item>

      <Form.Item<TaskFormValues> label="Описание" name="description">
        <Input.TextArea
          autoSize={{ maxRows: 5, minRows: 3 }}
          placeholder="Опишите задачу и что нужно исправить"
        />
      </Form.Item>

      <Form.Item<TaskFormValues> label="Ответственный" name="executor">
        <Select options={EXECUTOR_TYPES} placeholder="Выберите ответственного" />
      </Form.Item>

      <Form.Item<TaskFormValues> label="Ожидаемая дата выполнения" name="control">
        <DatePicker className={styles.fullWidth} format="DD.MM.YYYY" />
      </Form.Item>

      <Form.Item<TaskFormValues>
        extra="Можно выбрать до 20 изображений"
        label="Фото"
        name="photos"
        rules={[
          {
            validator: (_, value: UploadFile[] | undefined) => {
              if (!value || value.length <= 20) return Promise.resolve()
              return Promise.reject(new Error('Максимум 20 фотографий'))
            }
          }
        ]}
        valuePropName="fileList"
        getValueFromEvent={event => event?.fileList}
      >
        <Upload
          accept="image/jpeg,image/png,image/webp,image/gif"
          beforeUpload={() => false}
          listType="picture"
          maxCount={20}
          multiple
        >
          <Button icon={<UploadOutlined />}>Выбрать фото</Button>
        </Upload>
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

export type { TaskFormValues }
export default FormModal
