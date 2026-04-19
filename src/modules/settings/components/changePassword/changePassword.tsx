import React, { FC, startTransition, useActionState, useEffect } from 'react'
import { Alert, Button, Form, Input, message } from 'antd'
import { useTranslations } from 'next-intl'

import Loader from '@/shared/components/loader/loader'

import styles from './changePassword.module.scss'

import { changePassword } from '@/app/actions/auth'

const initialState: { id?: string; error?: string } = {}

interface IChangePassword {
  readonly actionClose: () => void
}

const ChangePassword: FC<IChangePassword> = ({ actionClose }) => {
  const t = useTranslations('settings')

  // @ts-expect-error: it works
  const [state, formAction, isPending] = useActionState(changePassword, initialState)

  const [form] = Form.useForm()

  const getError =
    state?.error === 'incorrect' ? t('user.change.incorrect') : t('user.change.error')

  const handleFinish = (values: { email: string; password: string }) => {
    startTransition(() => {
      // @ts-expect-error: it works
      formAction(values)
    })
  }

  useEffect(() => {
    if (state?.id) {
      message.success(t('user.change.success'))

      actionClose()
    }
  }, [state?.id])

  return (
    <Form
      className={styles.root}
      disabled={isPending}
      form={form}
      layout="vertical"
      name="signin"
      onFinish={handleFinish}
    >
      <h2>{t('user.change.title')}</h2>

      {isPending ? <Loader className={styles.loader} /> : null}

      <Form.Item
        className={styles.password}
        label={t('user.password.label')}
        name="password"
        rules={[
          { message: t('user.password.require'), required: true },
          { message: t('user.password.validate'), min: 8 }
        ]}
      >
        <Input.Password placeholder={t('user.password.placeholder')} />
      </Form.Item>

      <Form.Item
        className={styles.password}
        label={t('user.password_repeat.label')}
        name="password_repeat"
        rules={[
          { message: t('user.password_repeat.require'), required: true },
          { message: t('user.password_repeat.validate'), min: 8 }
        ]}
      >
        <Input.Password placeholder={t('user.password_repeat.placeholder')} />
      </Form.Item>

      {state?.error ? <Alert title={getError} type="error" /> : null}

      <Button className={styles.submit} htmlType="submit" type="primary">
        {t('user.change.title')}
      </Button>
    </Form>
  )
}

export default ChangePassword
