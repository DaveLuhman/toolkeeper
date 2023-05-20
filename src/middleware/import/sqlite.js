import { sqlite3 } from 'sqlite3'
import { Tool } from '/src/models/Tool.model'
import { ToolHistory } from '/src/models/ToolHistory.model'
import { serviceAssignment } from '/src/models/serviceAssignment.model'

const db = new sqlite3.Database(
  '/database.sqlite',
  sqlite3.OPEN_READONLY,
  (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('connected to sqlite legacy database.')
  }
)

export function importServiceAssignments(db) {
  const query = 'SELECT x.*,x.rowid FROM "MEMBER" x'
  const members = db.all(query)
  members.forEach((row) => {
    const importedNotes = `${row[4]}\n${row[5]}\n'Legacy Service Creation Date: ${row[10]}`
    const serviceAssignmentDocument = {
      name: row[0],
      description: row[1],
      notes: importedNotes,
      phone: row[2],
    }
    serviceAssignment.create(serviceAssignmentDocument)
  })
}

db.close((err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Close the database connection.')
})
