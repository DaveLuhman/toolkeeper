// eslint-disable-next-line no-unused-vars
function btnToSpinner() {
  const submitBtn = document.querySelector('#testButton')

  submitBtn.addEventListener('click', () => {
    submitBtn.outerHTML =
      '<span class="loading loading-infinity loading-lg"></span>'
  })
}

// eslint-disable-next-line no-unused-vars
const openInNewTab = () => {
  console.log('Ive seen you click the button via the function, not the event listener')
  const uriComponent = document.getElementById('printerFriendlyTools').innerHTML
  const encodedHtml = encodeURIComponent(uriComponent)
  const x = window.open()
  const newPage = x.document.createElement('div')
  newPage.width = '100%'
  newPage.height = '100%'
  newPage.innerHTML = document.getElementById('printerFriendlyTools').innerHTML
  x.document.body.appendChild(newPage)
}
