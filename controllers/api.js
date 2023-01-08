const Tool = require('../models/tool');
const User = require('../models/user');

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
controller.parseUserToObject = (data) => {
    const userObject = {
        "_id": data._id,
        "firstName": data.firstName,
        "lastName": data.lastName,
        "email": data.email,
        "role": data.role,
        "disabled": data.disabled,
        "lastLogin": data.lastLogin
    }
    return userObject
}
// @desc    Get unique tool by _id or serial number
// @route   GET /api/tool
// @access  User
controller.getUniqueTool = async (req, res) => {
    let { _id, serialNumber } = req.body
    let tool = _id ?  (await Tool.findById(_id)) : (await Tool.findOne({ serialNumber: serialNumber }))
    if (!tool) { return res.status(404).send('Tool not found') }
}
// @desc    Get all tools
// @route   GET /api/tools
// @access  User
controller.getAllTools = async (_req, res) => {
    const tools = await Tool.find() ? await Tool.find() : res.status(404).send('No tools found')
    return res.status(200).json(tools)
},
// @desc    Search for a match based on the provided values
// @route   GET /api/tools/search
// @access  User
controller.getToolsByMatch = async (req, res) => {
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
// @route   POST /api/tool
// @access  User
controller.createTool = async (req, res) => {
    let tJ = this.parseToolToObject(req.body)
    if (tJ.serialNumber.length > 0 || tJ.barcode.length > 0 || tJ.partNumber.length > 0) {
         return res.status(400).send('Serial Number is required')
        }
    let tool = await Tool.create(tJ)
    if (tool._id != null) { return res.status(201).json({message: success, tool}) }
}
// @desc    Update a tool by ID
// @route   PUT /api/tool
// @access  User
controller.updateTool = async (req, res) => {
    let tJ = this.parseToolToObject(req.body)
    try {
        let tool = await Tool.findByIdAndUpdate(tJ._id, tJ)
        return res.status(200).json({message: success, result: tool})
    } catch (error) {
        throw new Error(error)
    }
    return res.status(404).send('Tool not found')
}
// @desc    Return Current User Details
// @route   GET /api/user
// @access  User
controller.getCurrentUser = async (req, res) => {
    let user = this.parseUserToObject(req.body)
    if (!user._id && !userObject.email) return res.status(400).send('No unique value provided')
    if (user._id) {
        let result = await User.findById(user._id)
        if (result._id == null) { return res.status(404).send('No Matching User Found')}
        return res.status(200).json(result)}
    else if (user.email) {
        let result = await User.findOne({ email: user.email })
        if (result._id == null) { return res.status(404).send('No Matching User Found')}
        return res.status(200).json(result)}
}

// @desc  Update a user by ID
// @route PUT /api/user
// @access Manager
controller.updateUserByID = async (req, res) => {
    let userObject = this.parseUserToObject(req.body)
    let user = await User.findByIdAndUpdate(userObject._id, userObject)
    if (user._id != null) { return res.status(200).json(user) }
    return res.status(404).send('User not found')
}

// @desc  Return all users
// @route GET /api/users
// @access Manager
controller.getAllUsers = async (_req, res) => {
    const users = await User.find() ? await User.find() : res.status(404).send('No users found')
    return res.status(200).json(users)
}

// @desc  Return all users by role
// @route GET /api/users/search
// @access Manager
controller.getUsersByRole = async (req, res) => {
    let users = req.body.role ? await User.find({ role: req.body.role }) : res.status(404).send('No users in the provided role found')
}


module.exports = controller