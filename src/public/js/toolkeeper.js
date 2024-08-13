// eslint-disable-next-line no-unused-vars
export function btnToSpinner() {
  const submitBtn = document.querySelector('#testButton')

  submitBtn.addEventListener('click', () => {
    submitBtn.outerHTML =
      '<span class="loading loading-infinity loading-lg"></span>'
  })
}
