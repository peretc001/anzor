import React, { FC } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PhoneIcon, UserIcon } from '@heroicons/react/24/outline'

import { ICustomer } from '@/shared/interfaces'

import { addCustomerApi } from '@/layout/modals/attachCustomer/api/addCustomerApi'

import styles from './form.module.scss'

const formatRuPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''

  let d = digits
  if (d[0] === '8') d = '7' + d.slice(1)
  if (d[0] !== '7') d = '7' + d
  d = d.slice(0, 11)

  const t = d.slice(1)
  let result = '+7'
  if (t.length === 0) return result

  result += ' ('
  result += t.slice(0, 3)
  if (t.length >= 3) result += ')'
  if (t.length > 3) result += ` ${t.slice(3, Math.min(6, t.length))}`
  if (t.length > 6) result += `-${t.slice(6, Math.min(8, t.length))}`
  if (t.length > 8) result += `-${t.slice(8, 10)}`
  return result
}

interface IAddForm {
  readonly projectId: null | number
  readonly onClose: () => void
}

const AddForm: FC<IAddForm> = ({ projectId, onClose }) => {
  const t = useTranslations('customers.form')

  const queryClient = useQueryClient()

  const [form] = Form.useForm<ICustomer>()

  const { isLoading, mutate: save } = useMutation({
    mutationFn: ({
      projectId: pid,
      values
    }: {
      projectId: number
      values: ICustomer
    }): Promise<boolean> => addCustomerApi(pid, values),
    onError: () => message.error(t('error')),
    onSuccess: async (status: boolean) => {
      if (status) {
        await queryClient.invalidateQueries({ queryKey: ['projects'] })
        await queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        onClose()
      }
    }
  })

  const handleFinish = (values: ICustomer) => {
    if (projectId != null) save({ projectId, values })
  }

  const phoneLabel = (
    <span className={styles.labelWithIcon}>
      <PhoneIcon className={styles.labelIcon} aria-hidden />
      {t('phone.label')}
    </span>
  )

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.head}>
          <div className={styles.headMain}>
            <div className={styles.iconWrap} aria-hidden>
              <UserIcon className={styles.icon} />
            </div>
            <div className={styles.headText}>
              <h2 className={styles.title}>{t('title')}</h2>
              <p className={styles.subtitle}>{t('subtitle')}</p>
            </div>
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
              label={phoneLabel}
              name="phone"
              normalize={v => formatRuPhone(String(v ?? ''))}
            >
              <Input inputMode="tel" placeholder={t('phone.placeholder')} />
            </Form.Item>

            <Form.Item
              className={styles.twoColItem}
              label={t('email.label')}
              name="email"
              rules={[
                {
                  validator: (_, value) => {
                    const raw = String(value ?? '').trim()
                    if (!raw) return Promise.resolve()
                    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)
                    return ok ? Promise.resolve() : Promise.reject(new Error(t('email.validate')))
                  }
                }
              ]}
            >
              <Input placeholder={t('email.placeholder')} type="email" />
            </Form.Item>
          </div>

          <Button className={styles.submit} htmlType="submit" loading={isLoading} type="primary">
            {t('submit')}
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default AddForm
