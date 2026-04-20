import React, { FC, startTransition, useActionState, useEffect, useState } from 'react'
import { Alert, Button, Checkbox, CheckboxProps, Form, Input } from 'antd'
import { redirect } from 'next/navigation'
import { useTranslations } from 'next-intl'

import Loader from '@/shared/components/loader/loader'

import { eventSignUp } from '@/lib/amplitudeEvents'

import styles from './signup.module.scss'

import { signup } from '@/app/actions/auth'

interface ISignupPage {
  readonly actionClose: () => void
}

const initialState: { id?: string; error?: string } = {}

const SignupPage: FC<ISignupPage> = ({ actionClose }) => {
  const t = useTranslations('auth')

  // @ts-expect-error: it works
  const [state, formAction, isPending] = useActionState(signup, initialState)

  const [form] = Form.useForm()
  const [checkPolicy, setCheckPolicy] = useState(true)

  const getError = state?.error === 422 ? t('status.exist') : t('status.error')

  const handleChangePolicy: CheckboxProps['onChange'] = e => {
    setCheckPolicy(e.target.checked)
  }

  const handleFinish = (values: { email: string; password: string }) => {
    startTransition(() => {
      // @ts-expect-error: it works
      formAction(values)
    })
  }

  useEffect(() => {
    if (state?.id) {
      actionClose()
      eventSignUp()
      redirect('/settings')
    }
  }, [state?.id])

  return (
    <div className={styles.root}>
      {isPending ? <Loader className={styles.loader} /> : null}

      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        name="signup"
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

        <Checkbox className={styles.policy} checked={checkPolicy} onChange={handleChangePolicy}>
          {t.rich('policy', {
            a: chunks => (
              <a href="/policy" target="_blank">
                {chunks}
              </a>
            )
          })}
        </Checkbox>

        {state?.error ? <Alert title={getError} type="error" /> : null}

        <Button className={styles.submit} disabled={!checkPolicy} htmlType="submit" type="primary">
          {t('submit')}
        </Button>
      </Form>
    </div>
  )
}

export default SignupPage
