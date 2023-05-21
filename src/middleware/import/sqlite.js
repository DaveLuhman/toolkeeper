import { Tool } from '/src/models/Tool.model'
import { ToolHistory } from '/src/models/ToolHistory.model'
import { serviceAssignment } from '/src/models/serviceAssignment.model'
import { sqlite3 } from '../../config/dependencies'

function mountSqliteDatabase() {
  return sqlite3.Database('/database.sqlite', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('connected to sqlite legacy database.')
  })
}

export function importServiceAssignments(_req, res, next) {
  const db = mountSqliteDatabase()
  const query = 'SELECT x.*,x.rowid FROM "MEMBER" x'
  const members = db.all(query)
  let successCount
  members.forEach((row) => {
    const importedNotes = `${row[4]}\n${row[5]}\n'Legacy Service Creation Date: ${row[10]}`
    const phoneNumber = row[2].match(/[0-9]{3}.[0-9]{3}.[0-9]{4}/)
    const serviceAssignmentDocument = {
      name: row[0],
      description: row[1],
      notes: importedNotes,
      phone: phoneNumber,
    }
    try {
      const newSA = serviceAssignment.create(serviceAssignmentDocument)
      successCount++
    } catch (error) {
      console.error(`${row[0]} was unable to be imported due to ${error}`)
      res.locals.message = res.locals.message + `${row[0]} was unable to be imported due to ${error}`
    }
  })
  res.locals.message = `${successCount} records were successfully imported.`
  next()
}
export function importTools(_req, res, next) {
  const db = mountSqliteDatabase()
  const query = 'SELECT x.*,x.rowid FROM "MEMBER" x'
  const members = db.all(query)
  let successCount
  members.forEach((row) => {
    try {
    const importedNotes = `${row[4]}\n${row[5]}\n'Legacy Service Creation Date: ${row[10]}`
    const phoneNumber = row[2].match(/[0-9]{3}.[0-9]{3}.[0-9]{4}/) || null
    const serviceAssignmentDocument = {
      name: row[0],
      description: row[1],
      notes: importedNotes,
      phone: phoneNumber,
    }
      const newSA = serviceAssignment.create(serviceAssignmentDocument)
      successCount++
    } catch (error) {
      console.error(`${row[0]} was unable to be imported due to ${error}`)
      res.locals.message = res.locals.message + `${row[0]} was unable to be imported due to ${error}`
    }
  })
  res.locals.message = `${successCount} records were successfully imported.`
  next()
}



db.close((err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Close the database connection.')
})
