/**
 * Increments the rightmost consecutive digits in a string by a given iteration.
 *
 * @param {string} str - The input string.
 * @param {number} iteration - The number to increment by.
 * @returns {string} - The modified string with the rightmost consecutive digits incremented.
 */
export const incrementRightmostNumber = (str, iteration) => {
  const regex = /\d+(?!.*\d)/
  const match = str.match(regex)

  if (match) {
    const rightmostNumber = match[0]
    const incrementedNumber = Number.parseInt(rightmostNumber, 10) + Number.parseInt(iteration, 10)
    const startPosition = match.index
    const endPosition = startPosition + rightmostNumber.length
    return str.slice(0, startPosition) + incrementedNumber + str.slice(endPosition)
  }

  return str
}

/**
 * Checks if a string ends with a number.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} Returns true if the string ends with a number, otherwise returns false.
 */
export const endsWithNumber = (str) => {
  const regex = /\d+$/
  return regex.test(str)
}
let entriesCount = 1
const plusButton = document.querySelector('#plusButton')

/**
 * Adds another tool row to the form.
 *
 * @param {Event} e - The event object.
 * @returns {void}
 */
export const addAnotherTool = (e) => {
  const baseBarcode = document.querySelector('#barcode_0').value
  const baseSerialNumber = document.querySelector('#serialNumber_0').value
  const baseToolID = document.querySelector('#toolID_0').value
  const autoincrementBarcode = document.querySelector('#autoincrement-barcode-toggle')
  const autoincrementSerialNumber = document.querySelector('#autoincrement-serialNumber-toggle')
  const autoincrementToolID = document.querySelector('#autoincrement-toolID-toggle')
  const autoincrementCheckboxes = document.querySelectorAll('[id^="autoincrement-"]')
  const additionalToolHtml = `
    <input
    id='barcode_${entriesCount}'
    name='barcode'
    type='text'
    placeholder='Barcode'
    class='input input-bordered'
    />
    <input
    id='serialNumber_${entriesCount}'
    name='serialNumber'
    type='text'
    placeholder='Serial Number'
    class='input input-bordered'
    minlength='5'
    />
    <div class="w-full">
        <input
        id='toolID_${entriesCount}'
        name='toolID'
        type='text'
        placeholder='Tool ID ${entriesCount}'
        class='input input-bordered relative w-[90%] mr-2' />
        <div id="delete-row-${entriesCount}-button" class="btn btn-accent w-4 float-right absolute">-</div>
        </div>       `
  e.preventDefault()
  // make and insert the new row with no values
  const additionalToolElement = document.createElement('div')
  additionalToolElement.setAttribute('id', `row-${entriesCount}`)
  additionalToolElement.classList.add('grid', 'grid-rows-1', 'grid-cols-3', 'gap-2', 'mt-2')
  additionalToolElement.innerHTML = additionalToolHtml
  const toolRows = document.querySelectorAll('[id^="row-"]')
  const lastToolRow = toolRows[toolRows.length - 1]
  lastToolRow.insertAdjacentElement('afterend', additionalToolElement)
  // new row exists and attributes can be modified

  //add event listener to minus button
  document.querySelector(`#delete-row-${entriesCount}-button`).addEventListener('click', (e) => {
    e.preventDefault()
    const rowToDelete = e.target.parentElement.parentElement
    rowToDelete.remove()
  })
  const incrementingErrorToastr = () => {
    toastr.options.closeMethod = 'fadeOut'
    toastr.options.closeDuration = 1000
    toastr.options.closeEasing = 'swing'
    toastr.error(
      'Unable to increment a blank or non-number value. You must manually enter values, or refresh the page to try again.'
    )
  }

  // barcode incrementing if necessary
  if (autoincrementBarcode.checked) {
    if (endsWithNumber(baseBarcode) === false || baseBarcode === '') {
      autoincrementBarcode.checked = false
      incrementingErrorToastr()
    } else {
      const barcodeElement = document.querySelector(`#barcode_${entriesCount}`)
      barcodeElement.value = incrementRightmostNumber(baseBarcode, entriesCount)
      barcodeElement.disabled = true
    }
  }
  // serial number incrementing if necessary
  if (autoincrementSerialNumber.checked) {
    if (endsWithNumber(baseSerialNumber) === false || baseSerialNumber === '') {
      autoincrementSerialNumber.checked = false
      incrementingErrorToastr()
    } else {
      const serialNumberElement = document.querySelector(`#serialNumber_${entriesCount}`)
      serialNumberElement.value = incrementRightmostNumber(baseSerialNumber, entriesCount)
      serialNumberElement.disabled = true
    }
  }
  // tool ID incrementing if necessary
  if (autoincrementToolID.checked) {
    if (endsWithNumber(baseToolID) === false || baseToolID === '') {
      autoincrementToolID.checked = false
      incrementingErrorToastr()
    } else {
      const toolIDElement = document.querySelector(`#toolID_${entriesCount}`)
      toolIDElement.value = incrementRightmostNumber(baseToolID, entriesCount)
      toolIDElement.disabled = true
    }
  }
  // disable all autoincrement checkboxes on first row creation
  if (entriesCount === 1) {
    for(const element in autoincrementCheckboxes) {
      element.disabled = true
      element.nextElementSibling.style.color = 'gray'
      element.classList.add = 'cursor-not-allowed'
    }
  }
  entriesCount++
}
// add event listener to new row button
plusButton.addEventListener('click', addAnotherTool)
// remove disabled attribute from all fields on form submission so all fields are included
document.forms[0].addEventListener('submit', function () {
  const disabledFields = this.querySelectorAll('[disabled]')
  for (const field in disabledFields){
    field.disabled = false
  }
})
