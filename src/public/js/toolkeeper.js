function btnToSpinner () {
  const submitBtn = document.getElementById('importSubmitBtn')

  submitBtn.addEventListener(
    'click',
    (submitBtn.outerHTML =
      '<span class="loading loading-infinity loading-lg"></span>')
  )
}
