// eslint-disable-next-line no-unused-vars
function btnToSpinner() {
  const submitBtn = document.querySelector('#testButton')

  submitBtn.addEventListener('click', () => {
    submitBtn.outerHTML =
      '<span class="loading loading-infinity loading-lg"></span>'
  })
}
if (document.getElementById('printButton')) {
  console.log('I see the print button')
  document.getElementById('printButton').addEventListener('onclick', (e) => {
    console.log('Ive seen you click the button')
    const uriComponent = document.getElementById('printerFriendlyTools').innerHTML
    const encodedHtml = encodeURIComponent(uriComponent)
    const dataUri = 'data:text/html;charset=utf-8,' + encodedHtml
    window.open(dataUri)
  })
}

const openInNewTab = () => {
  console.log('Ive seen you click the button via the function, not the event listener')
  const uriComponent = document.getElementById('printerFriendlyTools').innerHTML
  const encodedHtml = encodeURIComponent(uriComponent)
  const x = window.open()
  const iframe = x.document.createElement('iframe')
  iframe.width = '100%'
  iframe.height = '100%'
  iframe.frameBorder = 0
  iframe.style = 'border: 0'
  iframe.src = 'data:text/html;charset=utf-8,' + encodedHtml
  x.document.body.appendChild(iframe)
}
