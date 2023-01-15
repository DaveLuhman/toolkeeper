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
controller.getToolByID = async (req, res, next) => {
    let { _id } = req.params._id
    let tool = await Tool.findById(_id)
    if (!tool) { return res.status(404).send('Tool not found') }
}
// @desc    Search for a match based on the provided values
// @route   GET /tools/search
// @access  User
controller.getMatchingTools = async (req, res) => {
    const { _id, serialNumber, partNumber, barcode, serviceAssignment, manufacturer, status } = req.body
    const matchKeys = ["_id", "serialNumber", "partNumber", "barcode", "serviceAssignment", "manufacturer", "status"]
    const matchValues = [_id, serialNumber, partNumber, barcode, serviceAssignment, manufacturer, status]
    // check for non-empty values so we know which field to search with
    for (let i = 0; i < matchValues.length; i++) {
        if (matchValues[i] != null) {
            let tools = await Tool.find({ [matchKeys[i]]: matchValues[i] })
            if (tools.length > 0) { return res.status(200).json(tools) }
        }
    }
    return res.status(404).send('No tools found')
}

// @desc    Create a new tool
// @route   POST /tool
// @access  User
controller.createTool = async (req, res) => {
    const { serialNumber, partNumber, barcode, description } = req.body
    console.table(req.body)
    if (!(serialNumber || partNumber) || !barcode) {
         return res.status(400).render('dashboard', {message:'Either Serial Num and Barcode or Part Num and Barcode required'})
        }
    let existing = await Tool.findOne({ serialNumber: serialNumber })
    console.log(existing)
    if (existing) { return res.status(400).render('dashboard', {message: 'That Tool Already Exists, I looked it up by serial number', tool: existing}) }
    let newTool = await Tool.create({serialNumber, partNumber, barcode, description, updatedBy: req.user._id, createdBy: req.user._id  })
    if (newTool._id != null) { return res.status(201).render('dashboard', {message: "Successfully Made A New Tool", tool: newTool, user: req.user}) }
}

// @desc    Update a tool by ID
// @route   PUT /tool
// @access  User
controller.updateToolbyID = async (req, res) => {
    let tJ = this.parseToolToObject(req.body)
    try {
        let tool = await Tool.findByIdAndUpdate(tJ._id, tJ)
        return res.status(200).json({message: success, result: tool})
    } catch (error) {
        throw new Error(error)
    }
    return res.status(404).send('Tool not found')
}

controller.importFromCSV = async (req, res) => {
    let importFile = req.files.csvFile.data
    let arrayOfRows = importFile.toString().split('\n')
    let newStatus = 'CO - In Stock'
    for (let i = 0; i < arrayOfRows.length; i++) {
        let row = arrayOfRows[i].split(',')
        if(row[4] != 'null') { newStatus = 'CO - Deployed' }
        let newTool = await Tool.create({
            serialNumber: row[0],
            barcode: row[1],
            description: row[2],
            partNumber: row[3],
            serviceAssignment: row[4],
            status: newStatus,
            updatedBy: req.user,
            createdBy: req.user })
        if (newTool._id != null) { console.log(`Successfully Made A New Tool: ${newTool}`) }
    }

}
module.exports = controller