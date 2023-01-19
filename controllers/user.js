const bcrypt = require('bcrypt')
const User = require('../models/user');

const controller = {}

// @desc  Update a user by ID
// @route PUT /user
// @access Manager
controller.updateUserByID = async (req, res) => {
    let userObject = this.parseUserToObject(req.body)
    let user = await User.findByIdAndUpdate(userObject._id, userObject)
    if (user._id != null) { return res.status(200).json(user) }
    return res.status(404).send('User not found to update by ID')
}

// @desc  Return all users by role
// @route GET /users/search
// @access Manager
controller.getUsersByRole = async (req, res) => {
    let users = req.body.role ? await User.find({ role: req.body.role }) : res.status(404).send('No users in the provided role found')
}

controller.userManagement = async (req, res) => {
    let users = await User.find()
    if (!users) { return res.status(404).send('No users found to display') }
    return res.render('userManagement', { "users": users, user: req.user })
}

module.exports = controller