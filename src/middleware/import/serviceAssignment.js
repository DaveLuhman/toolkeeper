import ServiceAssignment from '../../models/ServiceAssignment.model.js'

function checkForDuplicates (memberID, mLastName) {
  const searchResult = ServiceAssignment.find({
    $or: [{ name: memberID }, { description: mLastName }]
  }).exec()
  if (searchResult.length > 0) return true
  else return false
}

/**
 * @description Check what type of service assignment is currently being imported
 * @param {string} memberID
 * @param {string} mLastName
 * @returns Service Assignment Type
 */
function determineServiceAssignmentType (memberID, mLastName) {
  const stockrooms = ['TOOL1', 'ZLOST', 'ZUP01', '00000', '00021']
  if (!memberID || memberID === '') {
    console.error('Invalid Member ID' + memberID)
    return 'Imported - Uncategorized'
  }
  if (memberID[0] === 'C') return 'Contract Jobsite'
  if (memberID[0] === 'S') return 'Service Jobsite'
  if (stockrooms.includes(memberID)) return 'Stockroom'
  if (memberID[0] === '0') {
    if (mLastName.includes('VAN' || 'TRUCK')) return 'Vehicle'
    else return 'Employee'
  } else return 'Imported - Uncategorized'
}

async function createServiceAssignment (row) {
  let name = row[0]
  let description = row[1].trim()
  if (checkForDuplicates(row[0], row[1])) {
    name = `Duplicate ${row[0]}`
    description = `Duplicate ${row[1]}`
  }
  const serviceAssignmentDocument = {
    name,
    description,
    notes: row[4].trim() + ' ' + row[5].trim() + ' ' + row[10].trim(),
    phone: row[2].trim(),
    type: determineServiceAssignmentType(row[0], row[1])
  }
  console.log(serviceAssignmentDocument)
  await ServiceAssignment.create(serviceAssignmentDocument).save
}
export function importServiceAssignments (file) {
  const importDataBuffer = Buffer.from(file.data)
  const importDataString = importDataBuffer
    .toString('ascii')
    .replaceAll('"', '')
    .replaceAll("'", '')
  const importDataParentArray = importDataString.split('\n')
  const members = []
  importDataParentArray.forEach((row) => {
    return members.push(row.split(','))
  })
  const result = {
    successMsg: `${members.length} successfully processed.`
  }
  for (let i = 0; i < members.length; i++) {
    createServiceAssignment(members[i])
  }
  return result
}
