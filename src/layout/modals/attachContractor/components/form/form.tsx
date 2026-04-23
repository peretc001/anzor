import React, { FC } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { BuildingOffice2Icon } from '@heroicons/react/24/outline'

import { addContractorApi } from '@/layout/modals/attachContractor/api/addContractorApi'

import styles from './form.module.scss'

type ContractorFormValues = {
  email?: string
  inn?: string
  name: string
  phone?: string
}

const innDigits = (value: string) => value.replace(/\D/g, '')

interface IAddForm {
  readonly projectId: null | number
  readonly onClose: () => void
}

const AddForm: FC<IAddForm> = ({ projectId, onClose }) => {
  const t = useTranslations('contractors.form')

  const queryClient = useQueryClient()

  const [form] = Form.useForm<ContractorFormValues>()

  const { isLoading, mutate: save } = useMutation({
    mutationFn: ({
      projectId,
      values
    }: {
      projectId: number
      values: ContractorFormValues
    }): Promise<boolean> => addContractorApi(projectId, values),
    onError: () => message.error(t('user.change.error')),
    onSuccess: async (status: boolean) => {
      if (status) {
        await queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        onClose()
      }
    }
  })

  const handleFinish = (_values: ContractorFormValues) => {
    if (projectId != null) save({ projectId, values: _values })
  }

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.iconWrap} aria-hidden>
          <BuildingOffice2Icon className={styles.icon} />
        </div>
        <div className={styles.headText}>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>
      </div>

      <Form className={styles.form} form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label={t('name.label')}
          name="name"
          rules={[{ message: t('name.require'), required: true }]}
        >
          <Input placeholder={t('name.placeholder')} />
        </Form.Item>

        <div className={styles.twoColumns}>
          <Form.Item
            className={styles.twoColItem}
            label={t('inn.label')}
            name="inn"
            rules={[
              {
                validator: (_, value) => {
                  const raw = String(value ?? '').trim()
                  if (!raw) return Promise.resolve()
                  const digits = innDigits(raw)
                  if (digits.length === 10 || digits.length === 12) return Promise.resolve()
                  return Promise.reject(new Error(t('inn.validate')))
                }
              }
            ]}
          >
            <Input inputMode="numeric" placeholder={t('inn.placeholder')} />
          </Form.Item>

          <Form.Item className={styles.twoColItem} label={t('phone.label')} name="phone">
            <Input placeholder={t('phone.placeholder')} />
          </Form.Item>
        </div>

        <Form.Item
          label={t('email.label')}
          name="email"
          rules={[
            {
              validator: (_, value) => {
                const raw = String(value ?? '').trim()
                if (!raw) return Promise.resolve()
                // упрощённая проверка как у type: 'email' в antd
                const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)
                return ok ? Promise.resolve() : Promise.reject(new Error(t('email.validate')))
              }
            }
          ]}
        >
          <Input placeholder={t('email.placeholder')} type="email" />
        </Form.Item>

        <Button className={styles.submit} htmlType="submit" loading={isLoading} type="primary">
          {t('submit')}
        </Button>
      </Form>
    </div>
  )
}

export default AddForm
