const Tool = require('../models/tool');
const User = require('../models/user');

const controller = {}


// @desc    Get unique tool by _id or serial number
// @route   GET /api/tool
// @access  User
controller.getUniqueTool = (req, res) => {
    let { _id, serialNumber } = req.query
    // const tool = _id ?  Tool.findById(_id) : Tool.findOne({ serialNumber: serialNumber })

    let tool
    if(!_id && !serialNumber) { return res.status(400).send('No unique value provided')}
    if(_id) {
        tool =  Tool.findById(_id)
    }
    else if(serialNumber) {
        tool =  Tool.findOne({ serialNumber: serialNumber })
    }
    if(tool._id != null) { return res.status(404).send('Tool not found')}
}
controller.getAllTools = async (_req, res) => {
    const tools = await Tool.find() ? await Tool.find() : res.status(404).send('No tools found')
    return res.status(200).json(tools)
},
controller.getToolsByMatch = async (req, res) => {
    let tools
    const { _id, serialNumber,  partNumber, barcode, serviceAssignment, manufacturer, status } = req.body
    const matchValues = [ _id, serialNumber,  partNumber, barcode, serviceAssignment, manufacturer, status]
    // check for non-empty values so we know which field to search with
    for (let i = 0; i < matchValues.length; i++) {
        if (matchValues[i] != null) {
            const matchKey = matchValues[i].toString()
            tools = await Tool.find({ matchKey: matchValues[i] })
            if(tools.length > 0) { return res.status(200).json(tools)}
        }}
    return res.status(404).send('No tools found')
}
controller.createTool = async (req, res) => {
    if(!req.body.serialNumber) { return res.status(400).send('Serial Number is required')}
    let tool = await Tool.create(req.body)
    if(tool._id != null) { return res.status(201).json(tool)}
}
controller.updateTool = async (req, res) => {
    const { _id, serialNumber,  partNumber, barcode, serviceAssignment, manufacturer, status, description, image } = req.body
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
    if(tool._id != null) { return res.status(200).json(tool)}
    return res.status(404).send('Tool not found')
}
controller.getCurrentUser = async (req, res) => {
    let user
    const { _id, email } = req.body
    if(!_id && !email) { return res.status(400).send('No unique value provided')}
    if(_id) {
        user = await User.findById(_id)
    }
    else if(email) {
        user = await User.findOne({ email: email })
    }
    if(user != null) { return res.status(404).send('User not found')}
    return res.status(200).json(user)
}
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
    if(user._id != null) { return res.status(200).json(user)}
    return res.status(404).send('User not found')
}
controller.getAllUsers = async (_req, res) => {
    const users = await User.find() ? await User.find() : res.status(404).send('No users found')
    return res.status(200).json(users)
}
controller.getUsersByRole = async (req, res) => {
    let users = req.body.role ? await User.find({ role: req.body.role}) : res.status(404).send('No users in the provided role found')
}
controller.createUser = async (req, res) => {
    let { firstName, lastName, email, password, role } = req.body
    if(!email || !password) { return res.status(400).send('Email and password are required')}
    let user = await User.create({ firstName, lastName, email, password, role })
}

module.exports = controller