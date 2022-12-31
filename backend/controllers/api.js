const Tool = require('../models/tool');
const User = require('../models/user');

const controller = {}


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
    const matchValues = [_id, serialNumber, partNumber, barcode, serviceAssignment, manufacturer, status]
    // check for non-empty values so we know which field to search with
    for (let i = 0; i < matchValues.length; i++) {
        if (matchValues[i] != null) {
            const matchKey = matchValues[i].toString()
            let tools = await Tool.find({ [matchKey]: matchValues[i] })
            if (tools.length > 0) { return res.status(200).json(tools) }
        }
    }
    return res.status(404).send('No tools found')
}
// @desc    Create a new tool
// @route   POST /api/tool
// @access  User
controller.createTool = async (req, res) => {
    if (!req.body.serialNumber) { return res.status(400).send('Serial Number is required') }
    let tool = await Tool.create(req.body)
    if (tool._id != null) { return res.status(201).json(tool) }
}
// @desc    Update a tool by ID
// @route   PUT /api/tool
// @access  User
controller.updateTool = async (req, res) => {
    const { _id, serialNumber, partNumber, barcode, serviceAssignment, manufacturer, status, description, image } = req.body
    let toolJSON = {
        "_id": _id,
        "serialNumber": serialNumber,
        "partNumber": partNumber,
        "barcode": barcode,
        "serviceAssignment": serviceAssignment,
        "manufacturer": manufacturer,
        "status": status,
        "description": description,
        "image": image,
        "updatedBy": req.user
    }
    let tool = await Tool.findByIdAndUpdate(_id, toolJSON)
    if (tool._id != null) { return res.status(200).json(tool) }
    return res.status(404).send('Tool not found')
}
// @desc    Return Current User Details
// @route   GET /api/user
// @access  User
controller.getCurrentUser = async (req, res) => {
    let user
    const { _id, email } = req.body
    if (!_id && !email) { return res.status(400).send('No unique value provided') }
    if (_id) {
        user = await User.findById(_id)
    }
    else if (email) {
        user = await User.findOne({ email: email })
    }
    if (user == null) { return res.status(404).send('User not found') }
    return res.status(200).json(user)
}

// @desc  Update a user by ID
// @route PUT /api/user
// @access Manager
controller.updateUserByID = async (req, res) => {
    const { _id, firstName, lastName, email, role, disabled } = req.body
    let userJSON = {
        "_id": _id,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "role": role,
        "disabled": disabled,
    }
    let user = await User.findByIdAndUpdate(_id, userJSON)
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
// @desc  Create a new user
// @route POST /api/user
// @access Manager
controller.createUser = async (req, res) => {
    let { firstName, lastName, email, password, role } = req.body
    if (!email || !password) { return res.status(400).send('Email and password are required') }
    let user = await User.create({ firstName, lastName, email, password, role })
    return res.status(201).json({"message": "success", user})
}

module.exports = controller