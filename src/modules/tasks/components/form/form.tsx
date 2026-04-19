import React, { FC } from 'react'
import { Button, DatePicker, Form, Input, Select, Upload } from 'antd'
import datePickerRu from 'antd/es/date-picker/locale/ru_RU'
import type { UploadFile } from 'antd/es/upload/interface'
import dayjs, { type Dayjs } from 'dayjs'
import { useTranslations } from 'next-intl'

import SimpleEditor from '@/shared/components/tiptap/tiptap-templates/simple/simple-editor'
import type { ITask } from '@/shared/interfaces'

import { EXECUTOR_TYPES, STATUS_TYPES, TASK_TYPES } from '@/constants'

import styles from './form.module.scss'

import 'dayjs/locale/ru'
import { UploadOutlined } from '@ant-design/icons'

dayjs.locale('ru')

const MAX_TASK_PHOTOS = 10

type TaskFormValues = {
  control?: Dayjs
  description?: string
  executor?: string
  photos: UploadFile[]
  priority: string
  status: string
  title: string
  type: string
}

type IFormProps = {
  readonly editingTask?: ITask | null
  readonly submitting?: boolean
  readonly onCancel: () => void
  readonly onSubmit?: (values: TaskFormValues) => Promise<void> | void
}

const disablePastDates = (current: Dayjs) => current.isBefore(dayjs(), 'day')

const FormModal: FC<IFormProps> = ({
  editingTask = null,
  submitting = false,
  onCancel,
  onSubmit
}) => {
  const t = useTranslations('projects')
  const s3Base = process.env.NEXT_PUBLIC_S3_PATH ?? ''
  const isEdit = Boolean(editingTask)

  const [form] = Form.useForm<TaskFormValues>()

  const initialValues: Partial<TaskFormValues> &
    Pick<TaskFormValues, 'executor' | 'photos' | 'priority' | 'status' | 'type'> = {
    executor: 'contractor',
    photos: [],
    priority: 'medium',
    status: 'do',
    type: 'task',
    ...(editingTask
      ? {
          control: editingTask.control ? dayjs(editingTask.control) : undefined,
          description: editingTask.description ?? '',
          executor: editingTask.executor ?? 'contractor',
          photos: (editingTask.photos ?? []).map((path, i) => ({
            name: path.split('/').pop() ?? `photo-${i}.jpg`,
            status: 'done' as const,
            uid: path,
            url: `${s3Base}${path}`
          })),
          priority: editingTask.priority,
          status: editingTask.status,
          title: editingTask.title,
          type: editingTask.type
        }
      : {})
  }

  const handleChangeContent = (html: React.ReactNode) => {
    form.setFieldValue('description', html)
  }

  const handleFinish = async (values: TaskFormValues) => {
    await onSubmit?.(values)
    form.resetFields()
  }

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={handleFinish}
    >
      <div className={styles.container}>
        <div className={styles.types}>
          <Form.Item<TaskFormValues>
            label="Тип задачи"
            name="type"
            rules={[{ message: 'Выберите тип', required: true }]}
          >
            <Select options={TASK_TYPES} placeholder="Выберите тип" />
          </Form.Item>

          <Form.Item<TaskFormValues>
            hidden
            name="priority"
            rules={[{ message: 'Укажите приоритет', required: true }]}
          >
            <Input type="hidden" />
          </Form.Item>

          <Form.Item<TaskFormValues>
            label="Статус"
            name="status"
            rules={[{ message: 'Выберите статус', required: true }]}
          >
            <Select options={STATUS_TYPES} placeholder="Выберите статус" />
          </Form.Item>
        </div>

        <div className={styles.types}>
          <Form.Item<TaskFormValues>
            label="Ответственный"
            name="executor"
            rules={[{ message: 'Выберите ответственного', required: true }]}
          >
            <Select options={EXECUTOR_TYPES} placeholder="Выберите ответственного" />
          </Form.Item>

          <Form.Item<TaskFormValues>
            className={styles.date}
            label="Ожидаемая дата"
            name="control"
            rules={[
              {
                validator: (_: unknown, value: Dayjs | undefined) => {
                  if (!value) return Promise.resolve()
                  return value.isBefore(dayjs(), 'day')
                    ? Promise.reject(new Error('Выберите сегодняшнюю дату или дату в будущем'))
                    : Promise.resolve()
                }
              }
            ]}
          >
            <DatePicker disabledDate={disablePastDates} format="DD.MM.YYYY" locale={datePickerRu} />
          </Form.Item>
        </div>

        <Form.Item<TaskFormValues>
          label="Название"
          name="title"
          rules={[{ message: 'Введите название', required: true }]}
        >
          <Input placeholder="Например: Кривая стена в зоне фартука кухни" />
        </Form.Item>

        <div className={styles.editor}>
          <Form.Item label="Описание" name="description">
            <SimpleEditor
              key={editingTask ? `desc-${editingTask.id}` : 'desc-new'}
              defaultContent={editingTask?.description ?? ''}
              onChange={handleChangeContent}
            />
          </Form.Item>
          <span className={styles.limit}>{t('form.description.limit')}</span>
        </div>

        <Form.Item<TaskFormValues>
          extra={`Можно выбрать до ${MAX_TASK_PHOTOS} изображений`}
          getValueFromEvent={event => event?.fileList}
          label="Фото"
          name="photos"
          rules={[
            {
              validator: (_, value: UploadFile[] | undefined) => {
                if (!value || value.length <= MAX_TASK_PHOTOS) return Promise.resolve()
                return Promise.reject(new Error(`Максимум ${MAX_TASK_PHOTOS} фотографий`))
              }
            }
          ]}
          valuePropName="fileList"
        >
          <Upload
            accept="image/jpeg,image/png,image/webp,image/gif"
            beforeUpload={() => false}
            listType="picture"
            maxCount={MAX_TASK_PHOTOS}
            multiple
          >
            <Button icon={<UploadOutlined />}>Выбрать фото</Button>
          </Upload>
        </Form.Item>
      </div>

      <div className={styles.actions}>
        <Button htmlType="submit" loading={submitting} type="primary">
          {isEdit ? 'Сохранить' : 'Добавить'}
        </Button>
        <Button disabled={submitting} onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </Form>
  )
}

export type { TaskFormValues }
export default FormModal
