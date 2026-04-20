'use client'

import React, { FC, useCallback, useState } from 'react'
import { Button, Form, Input, message, Radio, Select, Switch } from 'antd'
import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { BuildingOffice2Icon, HomeIcon, UserIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/24/solid'

import { IProject } from '@/shared/interfaces'

import { PROJECT_TYPES } from '@/constants'

import { saveProjectApi } from '@/modules/projects/api/saveProjectApi'

import styles from './form.module.scss'

type IFormProps = {
  readonly project?: IProject
  readonly onCancel: () => void
}

const CREATE_STEP_LABELS = ['Объект', 'Исполнитель', 'Заказчик'] as const

const useSaveProject = (project: IProject | undefined, onCancel: () => void) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const save = useCallback(
    async (values: IProject) => {
      setLoading(true)

      const savedProject = project
        ? await saveProjectApi({ ...project, ...values })
        : await saveProjectApi(values)

      setLoading(false)

      if (!savedProject) {
        message.error('Не удалось сохранить изменения')
        return
      }

      await queryClient.invalidateQueries({ queryKey: ['projects'] })

      if (project?.id) {
        await queryClient.invalidateQueries({ queryKey: ['project', project.id] })
        router.refresh()
      }

      onCancel()
      message.success(project ? 'Изменения сохранены' : 'Объект создан')
    },
    [onCancel, project, queryClient, router]
  )

  return { loading, save }
}

const EditProjectForm: FC<IFormProps> = ({ project, onCancel }) => {
  const [form] = Form.useForm<IProject>()
  const { loading, save } = useSaveProject(project, onCancel)

  if (!project) {
    return null
  }

  return (
    <Form
      className={styles.root}
      form={form}
      initialValues={{
        active: project.active,
        address: project.address,
        contractor: project.contractor,
        customer: project.customer,
        name: project.name,
        type: project.type
      }}
      layout="vertical"
      onFinish={save}
    >
      <Form.Item<IProject>
        label="Название"
        name="name"
        rules={[{ message: 'Введите название объекта', required: true }]}
      >
        <Input placeholder="Например: ЖК Green Park" />
      </Form.Item>

      <Form.Item<IProject> label="Адрес" name="address">
        <Input placeholder="Укажите адрес объекта" />
      </Form.Item>

      <Form.Item<IProject> label="Заказчик" name="customer">
        <Input placeholder="Название компании заказчика" />
      </Form.Item>

      <Form.Item<IProject> label="Подрядчик" name="contractor">
        <Input placeholder="Название компании подрядчика" />
      </Form.Item>

      <Form.Item<IProject> label="Тип объекта" name="type">
        <Select options={PROJECT_TYPES} />
      </Form.Item>

      <Form.Item<IProject> label="Активен" name="active" valuePropName="checked">
        <Switch />
      </Form.Item>

      <div className={styles.actions}>
        <Button disabled={loading} onClick={onCancel}>
          Отмена
        </Button>
        <Button htmlType="submit" loading={loading} type="primary">
          Сохранить
        </Button>
      </div>
    </Form>
  )
}

const CreateProjectWizard: FC<Pick<IFormProps, 'onCancel'>> = ({ onCancel }) => {
  const [form] = Form.useForm<IProject>()
  const { loading, save } = useSaveProject(undefined, onCancel)
  const [step, setStep] = useState(0)

  const goNext = async () => {
    if (step === 0) {
      try {
        await form.validateFields(['type', 'name', 'address'])
      } catch {
        return
      }
    }
    setStep(s => Math.min(s + 1, CREATE_STEP_LABELS.length - 1))
  }

  const goBack = () => {
    setStep(s => Math.max(s - 1, 0))
  }

  const handleCreate = async () => {
    try {
      await form.validateFields()
    } catch {
      return
    }
    const values = await form.getFieldsValue()
    await save(values as IProject)
  }

  return (
    <Form
      className={styles.wizard}
      form={form}
      initialValues={{
        active: true,
        address: undefined,
        contractor: undefined,
        customer: undefined,
        name: undefined,
        type: 'flat'
      }}
      layout="vertical"
    >
      <div className={styles.stepper} role="navigation">
        <Form.Item<IProject> hidden name="active">
          <Input hidden />
        </Form.Item>

        <div className={styles.stepperTrack}>
          {CREATE_STEP_LABELS.map((_, index) => (
            <span
              key={CREATE_STEP_LABELS[index]}
              className={index === step ? styles.stepperActive : styles.stepperDot}
            />
          ))}
        </div>
        <span className={styles.stepperCaption}>{CREATE_STEP_LABELS[step]}</span>
      </div>

      <div className={styles.stepPanels}>
        <div className={step === 0 ? styles.stepVisible : styles.stepHidden}>
          <div className={styles.sectionHead}>
            <span className={`${styles.sectionIcon} ${styles.sectionIconBlue}`}>
              <BuildingOffice2Icon className={styles.sectionIconSvg} aria-hidden />
            </span>
            <div>
              <p className={styles.sectionTitle}>Информация об объекте</p>
              <p className={styles.sectionSubtitle}>Тип, название и адрес</p>
            </div>
          </div>

          <Form.Item<IProject>
            className={styles.typeField}
            label="Тип объекта"
            name="type"
            rules={[{ message: 'Выберите тип объекта', required: true }]}
          >
            <Radio.Group className={styles.typeRadioGroup}>
              <Radio className={styles.typeRadioOption} value="flat">
                <span className={styles.typeCard}>
                  <BuildingOffice2Icon className={styles.icon} aria-hidden />
                </span>
                <span className={styles.typeCaption}>Квартира</span>
              </Radio>
              <Radio className={styles.typeRadioOption} value="house">
                <span className={styles.typeCard}>
                  <HomeIcon className={styles.icon} aria-hidden />
                </span>
                <span className={styles.typeCaption}>Дом</span>
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item<IProject>
            label="Название объекта"
            name="name"
            rules={[{ message: 'Введите название объекта', required: true }]}
          >
            <Input placeholder="Квартира на Тверской" size="large" />
          </Form.Item>

          <Form.Item<IProject>
            label="Адрес"
            name="address"
            rules={[{ message: 'Укажите адрес', required: true }]}
          >
            <Input placeholder="г. Москва, ул. Пушкина, д. 1, кв. 10" size="large" />
          </Form.Item>
        </div>

        <div className={step === 1 ? styles.stepVisible : styles.stepHidden}>
          <div className={styles.sectionHead}>
            <span className={`${styles.sectionIcon} ${styles.sectionIconBlue}`}>
              <BuildingOffice2Icon className={styles.sectionIconSvg} aria-hidden />
            </span>
            <div>
              <p className={styles.sectionTitle}>Исполнитель</p>
              <p className={styles.sectionSubtitle}>Кто выполняет строительные работы</p>
            </div>
          </div>

          <Form.Item<IProject> label="Наименование" name="contractor">
            <Input placeholder="ООО «СтройМастер» или ИП Петров И.В." size="large" />
          </Form.Item>

          <p className={styles.hint}>Можно пропустить — добавите исполнителя позже</p>
        </div>

        <div className={step === 2 ? styles.stepVisible : styles.stepHidden}>
          <div className={styles.sectionHead}>
            <span className={`${styles.sectionIcon} ${styles.sectionIconGreen}`}>
              <UserIcon className={styles.sectionIconSvg} aria-hidden />
            </span>
            <div>
              <p className={styles.sectionTitle}>Заказчик</p>
              <p className={styles.sectionSubtitle}>Владелец объекта</p>
            </div>
          </div>

          <Form.Item<IProject> label="ФИО" name="customer">
            <Input placeholder="Иванова Мария Сергеевна" size="large" />
          </Form.Item>

          <p className={styles.hint}>Можно пропустить — добавите заказчика позже</p>
        </div>
      </div>

      {step === 0 ? (
        <div className={styles.wizardFooterSingle}>
          <Button block loading={loading} size="large" type="primary" onClick={goNext}>
            Далее — Исполнитель
            <ChevronRightIcon className={styles.footerIcon} aria-hidden />
          </Button>
        </div>
      ) : (
        <div className={styles.wizardFooterRow}>
          <Button disabled={loading} size="large" onClick={goBack}>
            Назад
          </Button>
          {step === 1 ? (
            <Button loading={loading} size="large" type="primary" onClick={goNext}>
              Далее — Заказчик
              <ChevronRightIcon className={styles.footerIcon} aria-hidden />
            </Button>
          ) : (
            <Button loading={loading} size="large" type="primary" onClick={handleCreate}>
              Создать объект
            </Button>
          )}
        </div>
      )}
    </Form>
  )
}

const FormModal: FC<IFormProps> = ({ project, onCancel }) => {
  if (project) {
    return <EditProjectForm project={project} onCancel={onCancel} />
  }

  return <CreateProjectWizard onCancel={onCancel} />
}

export default FormModal
