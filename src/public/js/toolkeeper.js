// eslint-disable-next-line no-unused-vars
function btnToSpinner() {
  const submitBtn = document.querySelector('#testButton')

  submitBtn.addEventListener('click', () => {
    submitBtn.outerHTML =
      '<span class="loading loading-infinity loading-lg"></span>'
  })
}

/*
* Function to open the printer friendly tools in a new tab
*/
// eslint-disable-next-line no-unused-vars
const openInNewTab = () => {
  const x = window.open()
  const newPage = x.document.createElement('div')
  newPage.width = '100%'
  newPage.height = '100%'
  newPage.innerHTML = document.getElementById('printerFriendlyTools').innerHTML
  x.document.body.appendChild(newPage)
}

