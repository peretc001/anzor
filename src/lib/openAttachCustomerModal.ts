export const openAttachCustomerModal = (projectId: number) => {
  const event = new CustomEvent('openAttachCustomerModal', { detail: { projectId } })
  document.dispatchEvent(event)
}
