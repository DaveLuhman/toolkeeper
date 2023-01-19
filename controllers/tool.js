const Tool = require('../models/tool');

const controller = {}
controller.parseToolToObject = (data) => {
    const toolObject = {
        "_id": data._id,
        "serialNumber": data.serialNumber,
        "partNumber": data.partNumber,
        "barcode": data.barcode,
        "serviceAssignment": data.serviceAssignment,
        "manufacturer": data.manufacturer,
        "status": data.status,
        "description": data.description,
        "image": data.image,
        "updatedBy": data.user._id
    }
    return toolObject
}

// @desc     Get all tools
// @route    GET /api/tools
// @context  User
controller.getAllTools = async () => {
     return  Tool.find({ archived: false })
}

// @desc     Get unique tool by _id or serial number
// @route    GET /api/tool
// @context  User
controller.getToolByID = async (req, res) => {
    console.log(req.params.id)
    let tool = await Tool.findById(req.params.id)
    if (!tool) { return res.status(404).send('Tool not found') }
    return res.render('editTool', { tool: tool })
}



controller.importFromCSV = async (req, res) => {
    let serviceAssignment
    let arrayOfRows = req.files.csvFile.importFile.toString().split('\r\n')
    let status = 'Checked Out'
    for (let i = 0; i < arrayOfRows.length; i++) {
        let row = arrayOfRows[i].split(',')
        if(row[4] == "" ) { console.log('no status value'.red); status = 'CHECKED IN'; serviceAssignment = 'IN STOCK' }
        if(row[4] != "" ) { status = 'CHECKED OUT'; serviceAssignment = row[4] }
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