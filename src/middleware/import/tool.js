import Tool from '../../models/Tool.model'

function createImportedTool (row) {
  let serialNumber = row[x]
  let barcode
  let description
  let modelNumber
  let toolID
  let manufacturer

}

export function importTools (file) {
  const importDataBuffer = Buffer.from(file.data)
  const importDataString = importDataBuffer
    .toString('ascii')
    .replaceAll('"', '')
    .replaceAll("'", '')
  const importDataParentArray = importDataString.split('\n')
  const tools = []
  importDataParentArray.forEach((row) => {
    return tools.push(row.split(','))
  })

  for (let i = 0; i < tools.length; i++) {
    createImportedTool(tools[i])
  }
  return tools
}

export function determineLastUpdatedTool (db) {
  let result
  const query =
    'SELECT x.scheckout FROM "TRANSACTION_HISTORY" x ORDER BY x.scheckout DESC LIMIT 1'
  return db.get(query, function (err, row) {
    result = row
  })
}
