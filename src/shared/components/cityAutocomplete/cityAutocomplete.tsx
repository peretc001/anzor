import React, { FC, useState } from 'react'
import { AutoComplete } from 'antd'
import { useTranslations } from 'next-intl'

import { useMutation } from '@tanstack/react-query'

import { useDebouncedCallback } from '@/lib/useDebouncedCallback'

import { getCityApi } from './api/getCityApi'
import { ICityOption, ICitySuggestion } from './interface'

interface ICityAutocomplete {
  readonly defaultCity: string | undefined
  readonly onClearCity?: () => void
  readonly onSelectCity: (option: ICityOption) => void
}

const CityAutocomplete: FC<ICityAutocomplete> = ({ defaultCity, onClearCity, onSelectCity }) => {
  const t = useTranslations('account')

  const [city, setCity] = useState(defaultCity)
  const [cities, setCities] = useState<[] | ICitySuggestion[]>([])

  const { mutate } = useMutation({
    mutationFn: (query: string) => getCityApi(query),
    onSuccess: (data: ICitySuggestion[]) => {
      if (data?.length > 0) {
        setCities(data)
      } else {
        setCities([])
      }
    }
  })

  const loadCity = async (value: string) => mutate(value)

  const getCityDebounced = useDebouncedCallback<(city: string) => void>(loadCity, 200)

  const handleChangeCity = (value: string) => {
    setCity(value)

    getCityDebounced(value)
  }

  const citiesList = cities.map((city: ICitySuggestion) => ({
    id: city.data.city_kladr_id,
    label: city.data.city,
    value: city.data.city
  }))

  const onSelect = (data: string, option: ICityOption) => {
    onSelectCity(option)
  }

  return (
    <AutoComplete
      id="info_city"
      allowClear={!!onClearCity}
      maxLength={255}
      options={citiesList}
      placeholder={t('about.city.placeholder')}
      value={city}
      onChange={handleChangeCity}
      onClear={onClearCity}
      onSelect={onSelect}
    />
  )
}

export default CityAutocomplete
