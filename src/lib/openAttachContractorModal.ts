export const openAttachContractorModal = () => {
  const event = new CustomEvent('openAttachContractorModal')
  document.dispatchEvent(event)
}
