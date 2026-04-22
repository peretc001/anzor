import React, { FC, startTransition, useActionState, useEffect } from 'react'
import { Alert, Button, Form, Input } from 'antd'
import { redirect } from 'next/navigation'
import { useTranslations } from 'next-intl'

import Loader from '@/shared/components/loader/loader'

import { eventSignIn } from '@/lib/amplitudeEvents'

import styles from './signin.module.scss'

import { signin } from '@/app/actions/auth'

interface ISigninPage {
  readonly actionClose: () => void
}

const initialState: { id?: string; error?: string } = {}

const SigninPage: FC<ISigninPage> = ({ actionClose }) => {
  const t = useTranslations('auth')

  // @ts-expect-error: it works
  const [state, formAction, isPending] = useActionState(signin, initialState)

  const [form] = Form.useForm()

  const getError = state?.error === 400 ? t('status.incorrect') : t('status.error')

  const handleFinish = (values: { email: string; password: string }) => {
    startTransition(() => {
      // @ts-expect-error: it works
      formAction(values)
    })
  }

  useEffect(() => {
    if (state?.id) {
      actionClose()
      eventSignIn()
      redirect('/')
    }
  }, [state?.id])

  return (
    <div className={styles.root}>
      {isPending ? <Loader className={styles.loader} /> : null}

      <Form
        className={styles.form}
        disabled={isPending}
        form={form}
        layout="vertical"
        name="signin"
        onFinish={handleFinish}
      >
        <Form.Item
          label={t('email.label')}
          name="email"
          rules={[
            { message: t('email.require'), required: true },
            { message: t('email.validate'), type: 'email' }
          ]}
        >
          <Input placeholder={t('email.placeholder')} type="email" />
        </Form.Item>

        <Form.Item
          className={styles.password}
          label={t('password.label')}
          name="password"
          rules={[
            { message: t('password.require'), required: true },
            { message: t('password.validate'), min: 8 }
          ]}
        >
          <Input.Password placeholder={t('password.placeholder')} />
        </Form.Item>

        {state?.error ? <Alert title={getError} type="error" /> : null}

        <Button className={styles.submit} htmlType="submit" type="primary">
          {t('confirm')}
        </Button>
      </Form>
    </div>
  )
}

export default SigninPage
