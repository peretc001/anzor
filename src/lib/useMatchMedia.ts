'use client'

import { useLayoutEffect, useState } from 'react'

const queries = [
  '(min-width: 1200px)',
  '(max-width: 576px)',
  '(max-width: 767px)',
  '(max-width: 991px)',
  '(max-width: 1199px)'
]

export const useMatchMedia = (): {
  isDesktop?: boolean // min-width: 1199px
  isMobile?: boolean // max-width: 1199px
  isMobileMD?: boolean // max-width: 767px
  isMobileSM?: boolean // max-width: 576px
  isMobileXL?: boolean // max-width: 991px
} => {
  const [values, setValues] = useState<boolean[]>([])

  useLayoutEffect(() => {
    const mediaQueryLists = queries.map(query => matchMedia(query))

    const getValues = () => mediaQueryLists.map(list => list.matches)

    const handler = () => setValues(getValues)

    handler()

    mediaQueryLists.map(list => (list.onchange = handler))
    return () => {
      mediaQueryLists.map(list => (list.onchange = handler))
    }
  }, [])

  return ['isDesktop', 'isMobileSM', 'isMobileMD', 'isMobileXL', 'isMobile'].reduce(
    (acc, screen, index) => ({
      ...acc,
      [screen]: values[index]
    }),
    {}
  )
}
