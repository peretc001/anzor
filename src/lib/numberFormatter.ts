type NumberFormatter = (number: null | number | string | undefined, isCut?: boolean) => string

const numberFormatter: NumberFormatter = (number, isCut = false) => {
  if (number === null || number === undefined) return '-'

  // Удаляем пробелы, запятые, проценты
  const numberWithoutSpaces = number.toString().replace(/[\s,%]/g, '')

  // Если число = не число возвращаем '-'
  if (isNaN(Number(numberWithoutSpaces))) return '-'

  const num = Number(numberWithoutSpaces)
  const hundredths = num * 100
  let numberRounded: number

  // Округляем до сотых
  if (hundredths > 0 && hundredths < 1) {
    // Если от 0 до 1
    numberRounded = Math.ceil(num * 100) / 100
  } else if (hundredths < 0 && hundredths > -1) {
    // Если от 0 до -1
    numberRounded = -Math.ceil(Math.abs(num * 100)) / 100
  } else {
    numberRounded = Math.round(num * 100) / 100
  }

  // Проверяем, является ли число целым
  const isInteger = Number.isInteger(numberRounded)
  const numberFormatted = isInteger ? numberRounded.toString() : numberRounded.toFixed(2)

  // Делим на две части: целая и дробная части
  const parts = numberFormatted.split('.')

  // Функция для сокращения чисел с добавлением суффиксов K, M, G
  const cuttingFormat = (splitter: number, letter: string) => {
    const divided = Number(parts[0]) / splitter
    parts[0] = divided.toFixed(1) + letter
    parts.splice(1, 1)
  }

  // Если нужно, сокращаем
  if (isCut) {
    const numValue = Math.abs(Number(parts[0]))
    if (numValue >= 1_000 && numValue < 1_000_000) {
      cuttingFormat(1_000, 'K')
    } else if (numValue >= 1_000_000 && numValue < 1_000_000_000) {
      cuttingFormat(1_000_000, 'M')
    } else if (numValue >= 1_000_000_000) {
      cuttingFormat(1_000_000_000, 'G')
    }
  }

  // Вставляем запятые между тысячами
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return parts.join('.')
}

export default numberFormatter
