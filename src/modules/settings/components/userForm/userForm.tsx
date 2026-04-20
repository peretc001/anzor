'use client'

import React, { FC, startTransition, useActionState, useEffect, useState } from 'react'
import { Button, Form, Input, message, Modal, Popconfirm } from 'antd'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import FileUpload from '@/shared/components/fileUpload/fileUpload'
import { IUser } from '@/shared/interfaces'
import { useUserStore } from '@/shared/store/user'

import { useMatchMedia } from '@/lib/useMatchMedia'

import { addAvatarApi } from '@/modules/settings/api/addAvatarApi'
import { deleteAvatarApi } from '@/modules/settings/api/deleteAvatarApi'
import ChangePassword from '@/modules/settings/components/changePassword/changePassword'

import styles from './userForm.module.scss'

import { signout } from '@/app/actions/auth'
import { deleteAccount } from '@/app/actions/deleteAccount'
import { updateProfile, type UpdateProfileState } from '@/app/actions/profile'

interface IUserForm {
  readonly user: IUser | null
}

const initialState: UpdateProfileState = {}

const UserForm: FC<IUserForm> = ({ user }) => {
  const t = useTranslations('settings')

  const router = useRouter()

  const { isMobileMD } = useMatchMedia()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteAccountPending, setIsDeleteAccountPending] = useState(false)

  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  const [form] = Form.useForm()

  const hideModal = () => {
    setIsModalOpen(false)
  }

  const handleChangePassword = () => {
    setIsModalOpen(true)
  }

  const isNextRedirectError = (error: unknown) =>
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')

  const handleDeleteAccount = async () => {
    setIsDeleteAccountPending(true)

    try {
      const result = await deleteAccount()

      if (!result.ok) {
        message.error(t('user.deleteAccount.error'))
      }
    } catch (error) {
      if (!isNextRedirectError(error)) {
        message.error(t('user.deleteAccount.error'))
      }
    } finally {
      setIsDeleteAccountPending(false)
    }
  }

  const handleFinish = (values: { name: string; type: string }) => {
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('type', values.type ?? '')
    startTransition(() => {
      formAction(fd)
    })
  }

  useEffect(() => {
    if (!state?.ok) return
    const v = form.getFieldsValue() as { name?: string; type?: string }
    useUserStore.getState().patchMenuUser({
      name: String(v.name ?? ''),
      type: String(v.type ?? '')
    })
    router.refresh()
  }, [state, form, router])

  const { isLoading: isUploadLoading, mutate: uploadFile } = useMutation({
    mutationFn: (file: File) => addAvatarApi(file),
    onError: () => message.error(t('user.change.error')),
    onSuccess: url => {
      if (url) {
        form.setFieldValue('avatar', url)
        useUserStore.getState().patchMenuUser({ avatar: url })
        router.refresh()
      }
    }
  })

  const { isLoading: isDeletLoading, mutate: deleteFile } = useMutation({
    mutationFn: () => deleteAvatarApi(),
    onError: () => message.error(t('user.change.error')),
    onSuccess: status => {
      if (status) {
        form.resetFields(['avatar'])
        useUserStore.getState().patchMenuUser({ avatar: '' })
        router.refresh()
      }
    }
  })

  return (
    <div className={styles.root}>
      <h2>{t('user.title')}</h2>

      <Form
        className={styles.form}
        disabled={isPending}
        form={form}
        initialValues={{
          name: user?.name ?? '',
          type: user?.type ?? ''
        }}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item hidden name="avatar">
          <Input hidden />
        </Form.Item>

        <div className={styles.avatar}>
          <FileUpload
            isLoading={isUploadLoading || isDeletLoading}
            file={user?.avatar}
            onDelete={deleteFile}
            onUpload={uploadFile}
          />
          <p>{t('user.avatar')}</p>
        </div>

        <Form.Item
          label={t('user.name')}
          name="name"
          rules={[{ message: t('user.profile.errorName'), required: true }]}
        >
          <Input autoComplete="name" placeholder={t('user.name')} />
        </Form.Item>

        <Form.Item label={t('user.type')} name="type">
          <Input autoComplete="organization-title" placeholder={t('user.type')} />
        </Form.Item>

        <div className={styles.actions}>
          <Button htmlType="submit" loading={isPending} type="primary">
            {t('user.profile.save')}
          </Button>
        </div>
      </Form>

      <div className={styles.profile}>
        <div className={styles.group}>
          <span className={styles.label}>{t('user.email.label')}</span>
          <span className={styles.value}>{user?.email}</span>
        </div>

        <Button type="primary" onClick={handleChangePassword}>
          {t('user.change.title')}
        </Button>
      </div>

      <br />

      <div className={styles.actions}>
        <Button danger type="default" onClick={() => void signout()}>
          {t('user.logout')}
        </Button>
        <Popconfirm
          className={styles.confirm}
          cancelText={t('user.deleteAccount.confirmCancel')}
          description={t('user.deleteAccount.confirmDescription')}
          okButtonProps={{ danger: true, loading: isDeleteAccountPending }}
          okText={t('user.deleteAccount.confirmOk')}
          rootClassName={styles.confirm}
          title={t('user.deleteAccount.confirmTitle')}
          onConfirm={handleDeleteAccount}
        >
          <Button color="danger" loading={isDeleteAccountPending} variant="solid">
            {t('user.delete')}
          </Button>
        </Popconfirm>
      </div>

      {isModalOpen ? (
        <Modal
          className={styles.modal}
          footer={null}
          open={isModalOpen}
          width={isMobileMD ? '100%' : '450px'}
          onCancel={hideModal}
        >
          <ChangePassword actionClose={hideModal} />
        </Modal>
      ) : null}
    </div>
  )
}

export default UserForm
