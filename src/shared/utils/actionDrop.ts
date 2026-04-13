export const actionDrop = (
  acceptedFiles: File[],
  files: [] | File[],
  setFieldValue: (name: string, value: any) => void,
  errorCallback: () => void
) => {
  // берем имена файлов в стейте
  const filesName = files.map(f => f.name)

  // фильтруем уже добавленные файлы по имени
  const newFiles = acceptedFiles.filter(f => !filesName.includes(f.name))

  // если пришло больше чем надо выводим сообщение
  if (newFiles.length !== acceptedFiles.length && errorCallback) errorCallback()
  if (acceptedFiles.length > 10 && errorCallback) errorCallback()

  // записываем новые в стейт
  setFieldValue(
    'files',
    [
      ...files,
      ...newFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    ].slice(0, 10)
  )
}
