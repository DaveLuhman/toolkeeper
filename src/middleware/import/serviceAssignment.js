import { fs } from 'fs/promises'
import ServiceAssignment from '../../models/ServiceAssignment.model.js'

async function checkForDuplicates (memberID, mLastName) {
  const searchResult = ServiceAssignment.find({
    $or: [{ name: memberID }, { description: mLastName }]
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
async function determineServiceAssignmentType (memberID, mLastName) {
  try {
    const stockrooms = ['TOOL1', 'ZLOST', 'ZUP01', '00000', '00021']
    if (!memberID || memberID === '' || memberID.length == 7) {
      throw new Error('Invalid Member ID')
    if (memberID[1] === 'C') return 'Contract Jobsite'
    if (memberID[1] === 'S') return 'Service Jobsite'
    if (stockrooms.includes(memberID)) return 'Stockroom'
    if (memberID[1] == /[0-9]/) {
      if (mLastName.includes('VAN' || 'TRUCK')) return 'Vehicle'
      else return 'Employee'
    } else return 'Imported - Uncategorized'
  } catch (e) {
    console.error(
      'An error has occured while importing service assignments: \n' + memberID + '\n' + e.message
    )
    return 'Error - Uncategorized'
  }
}
async function createServiceAssignment(row) {
  try {
    console.table(row)
    let name = row[0]
    let description = row[1]
    if (checkForDuplicates(row[0], row[1])) {
      name = `Duplicate ${row[0]}`
      description = `Duplicate ${row[1]}`
    }
    const serviceAssignmentDocument = {
      name,
      description,
      notes: `${row[4]} ${row[5]} Legacy Service Creation Date: ${row[10]}`,
      phone: row[2].match(/[0-9]{3}.[0-9]{3}.[0-9]{4}/),
      type: determineServiceAssignmentType(row[0], row[1]),
    }
      const newSA = await ServiceAssignment.create(serviceAssignmentDocument)
      console.log(newSA)
      successCount++
  } catch (error) {
    // error handling is hard
    console.log(error)
    // no it's not
  }
}
export async function importServiceAssignments(file) {
  const importDataBuffer = Buffer.from(file.data)
  const importDataString = importDataBuffer.toString('ascii').replaceAll(`"`, '').replaceAll(`'`, '').replaceAll(` `, '')
  const importDataParentArray = importDataString.split('\n')
  const members = []
  importDataParentArray.forEach((row) => { return members.push(row.split(','))})
  let successCount = new Number
  let failedRows = new Array
  let result =  {
    successMsg: `${successCount} successfully imported.`,
    errorMsg: `${failedRows.length} failed to import properly.`,
    successCount: successCount,
    failedRows
  }
  members.forEach(async (row) => { await createServiceAssignment(row)})
  return result;
}

export function countImportServiceAssignments (db) {
  let targetRows = []
  function hoistRows (err, rows) {
    if (err) {
      console.error(err)
    }
    targetRows = rows
  }
  const query =
    'SELECT COUNT(*) DISTINCT x.memberid,x.mlastname FROM "MEMBER" x'
  try {
    db.all(query, hoistRows)
  } catch (error) {
    return 'failed to process service assignment import target'
  }
  return targetRows.length
}
