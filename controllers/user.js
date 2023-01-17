const bcrypt = require('bcrypt')
const User = require('../models/user');

const controller = {}

// @desc  Return all users
// @route GET /users
// @access Manager
controller.getAllUsers = async (_req, res, next) => {
    const users = await User.find()
    if(users.length != 0) res.sendStatus(200).json(users)
    else res.status(404).send('No users found')
}

controller.userProfileByID = async (req, res) => {
    let user = await User.findById(req.body.id)
    if (!user) { return res.status(404).send('User not found by ID') }
    return res.status(200).json(user)
}

controller.getUserByEmail = async (req, res) => {
    let user = await User.findOne({email: req.body.email})
    if (!user) { return res.status(404).send('User not found by ID') }
    return res.status(200).json(user)
}

// @desc  Create a new user
// @route POST /user
// @access Manager
controller.createUser = async (req, res) => {
    let { firstName, lastName, email, password, role } = req.body
    let userExists = await User.findOne({ email: email })
    console.log(userExists)
    if (!email || !password) { return res.status(400).send('Email and password are required') }
    if(userExists) { return res.status(400).send('User already exists') }
    let hash = bcrypt.hashSync(password, 10)
    let createdUser = await User.create({ firstName, lastName, email, password: hash, role })
    console.log(createdUser)
    return res.json({ "message": "success", "result": createdUser })}


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