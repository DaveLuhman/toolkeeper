const Tool = require('../models/tool');

const controller = {}

controller.importFromCSV = async (req, res) => {
    let serviceAssignment
    let arrayOfRows = req.files.csvFile.importFile.toString().split('\r\n')
    let status = 'Checked Out'
    for (let i = 0; i < arrayOfRows.length; i++) {
        let row = arrayOfRows[i].split(',')
        if (row[4] == "") { console.log('no status value'.red); status = 'CHECKED IN'; serviceAssignment = 'IN STOCK' }
        if (row[4] != "") { status = 'CHECKED OUT'; serviceAssignment = row[4] }
        let toolObject = {
            serialNumber: row[0],
            barcode: row[1],
            description: row[2],
            partNumber: row[3],
            serviceAssignment: serviceAssignment,
            status: status,
            updatedBy: req.user,
            createdBy: req.user
        }
        let newTool = await Tool.create(toolObject)
        if (newTool._id != null) { console.log(`Successfully Made A New Tool: ${newTool}`) }
    }
    res.status(201).send('Successfully Imported')
}
module.exports = controller