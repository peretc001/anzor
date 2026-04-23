export const openAttachContractorModal = (projectId: number) => {
  const event = new CustomEvent('openAttachContractorModal', { detail: { projectId } })
  document.dispatchEvent(event)
}
