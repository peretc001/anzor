export const openSignupModal = () => {
  const event = new CustomEvent('openSignupModal')
  document.dispatchEvent(event)
}
