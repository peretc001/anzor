export const paths = {
  chat: '/chat',
  contractors: '/contractors',
  customers: '/customers',
  home: '/',
  projects: '/projects'
}

export const PROJECT_TYPES = [
  { label: 'Квартира', value: 'flat' },
  { label: 'Дом', value: 'house' },
]

export const EXECUTOR_TYPES = [
  { label: 'Исполнитель', value: 'contractor' },
  { label: 'Заказчик', value: 'customer' },
  { label: 'Дизайнер', value: 'designer' },
]

export const TASK_TYPES = [
  { label: 'Задача', value: 'task' },
  { label: 'Нарушение', value: 'infraction' },
  { label: 'Вопрос', value: 'question' },
]

export const STATUS_TYPES = [
  { label: 'К выполнению', value: 'do' },
  { label: 'В работе', value: 'progress' },
  { label: 'Выполненно', value: 'completed' },
  { label: 'Готово', value: 'done' },
]

export const PRIORITY_TYPES = [
  { label: 'Наивысший', value: 'highest' },
  { label: 'Высокий', value: 'high' },
  { label: 'Средний', value: 'medium' },
  { label: 'Низкий', value: 'low' },
  { label: 'Низший', value: 'lowest' },
]
