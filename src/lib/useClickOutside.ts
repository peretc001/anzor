import React, { useEffect } from 'react'

// Типизация для ссылки на DOM-элемент
type RefType = React.RefObject<HTMLElement>

const useClickOutside = (ref: RefType, handler: any): void => {
  useEffect(() => {
    let startedInside = false
    let startedWhenMounted = false

    const listener = (event: MouseEvent | TouchEvent) => {
      // Игнорируем событие, если оно началось внутри элемента или до монтирования компонента
      if (startedInside || !startedWhenMounted) return
      // Игнорируем событие, если оно произошло на элементе, на который указывает реф, или его потомках
      if (!ref.current || ref.current.contains(event.target as Node)) return

      handler(event)
    }

    const validateEventStart = (event: MouseEvent | TouchEvent) => {
      startedWhenMounted = !!ref.current
      startedInside = ref.current ? ref.current.contains(event.target as Node) : false
    }

    document.addEventListener('mousedown', validateEventStart)
    document.addEventListener('touchstart', validateEventStart)
    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('mousedown', validateEventStart)
      document.removeEventListener('touchstart', validateEventStart)
      document.removeEventListener('click', listener)
    }
  }, [ref, handler])
}

export default useClickOutside
