export function importTools(file) {
  console.log('importing tools lol')
}

export function determineLastUpdatedTool(db) {
  let result
  const query = `SELECT x.scheckout FROM "TRANSACTION_HISTORY" x ORDER BY x.scheckout DESC LIMIT 1`
  return db.get(query, function (err, row) {
    result = row
    return
  })
}
