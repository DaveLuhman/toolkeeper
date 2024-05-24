import logger from '../../config/logger.js'
import ServiceAssignment from '../../models/ServiceAssignment.model.js'
import { csvFileToEntries } from '../util.js'
let successCount = 0
const errorList = []

function determineServiceAssignmentType(memberID, mLastName) {
  const stockrooms = ['TOOL1', 'ZLOST', 'ZUP01', '00000', '00021']
  if (!memberID || memberID === '') {
    logger.error('Invalid Member ID' + memberID)
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

function createServiceAssignmentDocument(row) {
  try {
    const name = row[0] || 'ERROR'
    const description = row[1] ? row[1].trim() : ''
    const notes = row[4]?.trim() + ' ' + row[5]?.trim() + ' ' + row[10]?.trim()
    const phone = row[2]?.trim()
    const type = determineServiceAssignmentType(row[0], row[1])
    const serviceAssignmentDocument = { name, description, notes, phone, type, active: false }
    return serviceAssignmentDocument
  } catch (error) {
    throw new Error('Could not create the document due to invalid input values')
  }
}

function saveServiceAssignmentDocument(serviceAssignmentDocument) {
  try {
    const serviceAssignment = new ServiceAssignment(serviceAssignmentDocument)
    serviceAssignment.save()
    successCount++
  } catch (error) {
    errorList.push({
      key: serviceAssignmentDocument.name,
      reason: error.message
    })
  }
}

function createServiceAssignments(members) {
  const serviceAssignmentsPromises = members.map((row) => {
    const serviceAssignmentDocument = createServiceAssignmentDocument(row)
    return saveServiceAssignmentDocument(serviceAssignmentDocument)
  })
  return Promise.allSettled(serviceAssignmentsPromises)
}

export async function importServiceAssignments(file) {
  successCount = 0
  const members = csvFileToEntries(file)
  await createServiceAssignments(members)
  return { successCount, errorList }
}

export async function activateServiceAssignments(file) {
  successCount = 0
  const activeServiceRows = csvFileToEntries(file)
  const activatedSAs = activeServiceRows.map(async (entry) => { return ServiceAssignment.findOneAndUpdate({ name: entry[0] }, { active: true }, { new: true }) })
  return { successCount: activatedSAs.length, errorList }
}
