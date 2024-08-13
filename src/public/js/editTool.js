/*
 * Adds event listeners to each form field and if any change occurs, adds a class
 * that makes the background red and the text white so users know which (if any )
 * fields have been changed.
 */
const form = document.querySelector('form')
const inputs = form.querySelectorAll("[id^='edit-tool_']")

inputs.forEach((input) => {
  input.addEventListener('change', () => {
    input.classList.add('changed')
  })
})
/*
* prompts the user with a warning before archiving a tool
*/
const archiveButton = document.getElementById('archive-button')
if (archiveButton) {
  archiveButton.addEventListener('click', function (e) {
    e.preventDefault()
    if (window.confirm('Would you like to archive this tool?')) {
      window.location.href = '/tool/archive/{{tools.0.id}}'
    }
  })
}

/*
*                  CLONE TOOL START
/*
* sets the unchanging values of the cloned tool's hidden fields
* on the modal
*/
document.getElementById('clone-tool_modelNumber').value =
  document.getElementById('edit-tool_modelNumber').value
document.getElementById('clone-tool_description').value =
  document.getElementById('edit-tool_description').value
document.getElementById('clone-tool_manufacturer').value =
  document.getElementById('edit-tool_manufacturer').value
document.getElementById('clone-tool_category').value =
  document.getElementById('edit-tool_category').value
document.getElementById('clone-tool_width').value =
  document.getElementById('edit-tool_width').value
document.getElementById('clone-tool_length').value =
  document.getElementById('edit-tool_length').value
document.getElementById('clone-tool_height').value =
  document.getElementById('edit-tool_height').value
document.getElementById('clone-tool_weight').value =
  document.getElementById('edit-tool_weight').value

  /*
  * populate service assignments on the clone form
  */
document.getElementById('clone-tool_serviceAssignment').innerHTML = document.getElementById('edit-tool_serviceAssignment').innerHTML

function removeNumberAfterDash(input) {
  return input.replace(/(\w+)-\d+/, '$1-');
}

