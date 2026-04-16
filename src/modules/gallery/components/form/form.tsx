import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Form, message, Upload, UploadFile, UploadProps } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { getBase64 } from '@/lib/getBase64'

import { addGalleryApi } from '@/modules/gallery/api/addGalleryApi'

import styles from './form.module.scss'

import { UploadOutlined } from '@ant-design/icons'

interface IGalleryAdd {
  readonly onCancel: () => void
}

const Add: FC<IGalleryAdd> = ({ onCancel }) => {
  const t = useTranslations('account')

  const queryClient = useQueryClient()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [form] = Form.useForm()

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [preview, setPreview] = useState<null | string>(null)

  const { isLoading: isUploadLoading, mutate: save } = useMutation({
    mutationFn: (params: any) => addGalleryApi(params),
    onError: () => message.error(t('gallery.upload.error')),
    onSuccess: url => {
      if (url) {
        queryClient.invalidateQueries({ queryKey: ['gallery'] })
        if (onCancel) onCancel()
      }
    }
  })

  const handleLoadPreview = async (files: any) => {
    const preview = await getBase64(files.file)
    if (preview) setPreview(preview)
    if (buttonRef.current) buttonRef.current.focus()
  }

  const props: UploadProps = {
    accept: 'image/jpg, image/jpeg, image/png, image/gif, image/webp',
    beforeUpload: file => {
      setFileList([file])

      return false
    },
    fileList,
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    onChange: handleLoadPreview
  }

  const handleRemovePreview = () => {
    form.resetFields(['file'])
    setFileList([])
    setPreview(null)
  }

  const onFinish = async (values: any) => {
    if (!values.file?.file) return
    await save({ file: values.file.file })
  }

  useEffect(() => {
    const handleReset = () => {
      form.resetFields(['file'])
      setFileList([])
      setPreview(null)
    }

    return () => handleReset()
  }, [])

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={{ file: undefined }}
      layout="vertical"
      name="gallery"
      onFinish={onFinish}
    >
      <h2>{t('gallery.title')}</h2>

      <Form.Item name="file" rules={[{ message: t('require'), required: true }]}>
        <Upload {...props}>
          <Button icon={<UploadOutlined />} type="primary">
            {t('gallery.file')}
          </Button>
        </Upload>
      </Form.Item>

      {preview ? (
        <div className={styles.preview}>
          <div className={styles.delete} onClick={handleRemovePreview}>
            <XMarkIcon className={styles.icon} />
          </div>

          <picture className={styles.picture}>
            <img alt="" src={preview} />
          </picture>
        </div>
      ) : null}

      <Form.Item>
        <Button ref={buttonRef} htmlType="submit" loading={isUploadLoading} type="primary">
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Add
