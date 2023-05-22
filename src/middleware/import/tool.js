export function countImportTools(db) {
  let targetRows = []
  function hoistRows(err, rows) {
    if (err) {
      console.error(err)
    }
    targetRows = rows
  }
  const query = `SELECT COUNT(*) DISTINCT x.stockid,x.sbarcodeid FROM "TOOLS" x`
  try {
    db.all(query, hoistRows)
  } catch (error) {
    return 'failed to process service assignment import target'
  }
  return targetRows.length
}

export function determineLastUpdatedTool(db) {
  let result
  const query = `SELECT x.scheckout FROM "TRANSACTION_HISTORY" x ORDER BY x.scheckout DESC LIMIT 1`
  return db.get(query, function (err, row) {
    result = row
    return
  })
}
