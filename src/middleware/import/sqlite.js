import { sqlite3 } from 'sqlite3'
import {Tool} from '/src/models/Tool.model'
import {ToolHistory} from '/src/models/ToolHistory.model'

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

export function importTools(db) {
  const query = 'select name from sqlite_master where type=\'table\''
  const tables = db.all(query, (err, rows) => {
    if (err) {
      console.error(err)
    }
    rows.forEach((row) => {

    })
  })
}

db.close((err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Close the database connection.')
})