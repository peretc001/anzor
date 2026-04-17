'use client'

import { useEffect, useState } from 'react'

import '@fancyapps/ui/dist/fancybox/fancybox.css'

import { Fancybox, type FancyboxOptions } from '@fancyapps/ui/dist/fancybox/'

export default function useFancybox(options: Partial<FancyboxOptions> = {}) {
  const [root, setRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (root) {
      Fancybox.bind(root, '[data-fancybox]', options)
      return () => Fancybox.unbind(root)
    }
    // options намеренно не в deps: дефолтный аргумент {} иначе новый объект каждый рендер
  }, [root])

  return [setRoot]
}
