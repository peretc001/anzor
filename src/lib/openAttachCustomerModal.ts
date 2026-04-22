export const openAttachCustomerModal = () => {
  const event = new CustomEvent('openAttachCustomerModal')
  document.dispatchEvent(event)
}
