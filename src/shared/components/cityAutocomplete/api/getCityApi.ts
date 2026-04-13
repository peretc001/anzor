export const getCityApi = async (city: string) => {
  if (city.length < 3) return

  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
  const token = process.env.NEXT_PUBLIC_DADATA_TOKEN

  const options: any = {
    body: JSON.stringify({
      from_bound: { value: 'city' },
      query: city,
      to_bound: { value: 'city' }
    }),
    headers: {
      Accept: 'application/json',
      Authorization: 'Token ' + token,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    mode: 'cors'
  }

  try {
    const response = await fetch(url, options)

    const result = await response.json()
    return result?.suggestions || []
  } catch (err) {
    console.log('getCityApi', err)
  }
}
