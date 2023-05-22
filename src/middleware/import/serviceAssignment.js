import ServiceAssignment from '../../models/ServiceAssignment.model.js'

function checkForDuplicates(memberID, mLastName) {
  const searchResult = ServiceAssignment.find({
    $or: [{ name: memberID }, { description: mLastName }],
  })
  if (searchResult.length > 0) return true
  else return false
}

/**
 * @description Check what type of service assignment is currently being imported
 * @param {string} memberID
 * @param {string} mLastName
 * @returns Service Assignment Type
 */
function determineServiceAssignmentType(memberID, mLastName) {
  try {
    const stockrooms = ['TOOL1', 'ZLOST', 'ZUP01', '00000', '00021']
    if (!memberID || memberID === '' || memberID.length == 5)
      throw new Error('Invalid Member ID')
    if (memberID[0] === 'C') return 'Contract Jobsite'
    if (memberID[0] === 'S') return 'Service Jobsite'
    if (stockrooms.includes(memberID)) return 'Stockroom'
    if (memberID[0] == /[0-9]/) {
      if (mLastName.includes('VAN' || 'TRUCK')) return 'Vehicle'
      else return 'Employee'
    } else return 'Imported - Uncategorized'
  } catch (e) {
    console.error(
      'An error has occured while importing service assignments: \n' + e
    )
    return 'Error - Uncategorized'
  }
}

export function importServiceAssignments(file) {


  let successCount = new Number
  let result = []
  members.forEach((row) => {
    try {
      let name = row[0]
      let description = row[1]
      if (checkForDuplicates(row[0], row[1])) {
        name = `Duplicate ${row[0]}`
        description = `Duplicate ${row[1]}`
      }
      const serviceAssignmentDocument = {
        name,
        description,
        notes: `${row[4]}\n${row[5]}\n'Legacy Service Creation Date: ${row[10]}`,
        phone: row[2].match(/[0-9]{3}.[0-9]{3}.[0-9]{4}/),
        type: determineServiceAssignmentType(row[0], row[1]),
      }
      try {
        ServiceAssignment.create(serviceAssignmentDocument)
        successCount++
      } catch (error) {
        console.error(`${row[0]} was unable to be imported due to ${error}`)
        failedRows.push(`${row[0]} was unable to be imported due to ${error}`)
      }
    } catch (error) {
      // error handling is hard
      console.log(error)
      // no it's not
    }
  })
  return {
    successMsg: `${successCount} successfully imported.`,
    errorMsg: `${failedRows.length} failed to import properly.`,
    successCount: successCount,
    failedRows
  }
}

export function countImportServiceAssignments(db) {
  let targetRows = []
  function hoistRows(err, rows) { if(err) {console.error(err)} targetRows = rows}
  const query = `SELECT COUNT(*) DISTINCT x.memberid,x.mlastname FROM "MEMBER" x`
  try {
    db.all(query, hoistRows)
  } catch (error) {
    return "failed to process service assignment import target"
  }
  return targetRows.length
}