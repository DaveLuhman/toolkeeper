import Tool from '../models/Tool.model.js'

export const toolController = {}

toolController.importFromCSV = async (req, res) => {
  const arrayOfRows = req.files.csvFile.importFile.toString().split('\r\n')
  for (let i = 0; i < arrayOfRows.length; i++) {
    const row = arrayOfRows[i].split(',')
    const toolObject = {
      serialNumber: row[0],
      barcode: row[1],
      description: row[2],
      partNumber: row[3],
      serviceAssignment: row[4],
      status: row[5],
      archived: row[6] || false,
      updatedBy: req.user,
      createdBy: req.user
    }
    const newTool = await Tool.create(toolObject)
    if (newTool._id != null) {
      console.info(`[Controller] Successfully Made A New Tool: ${newTool}`)
    }
  }
  res.status(201).send('Successfully Imported')
}
