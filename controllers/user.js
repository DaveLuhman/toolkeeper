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

controller.getUserByID = async (req, res) => {
    let user = await User.findById(req.body.id)
    if (!user) { return res.status(404).send('User not found by ID') }
    return res.status(200).json(user)
}

// @desc  Create a new user
// @route POST /user
// @access Manager
controller.createUser = (req, res, next) => {
    let { firstName, lastName, email, password, role } = req.body
    if (!email || !password) { return res.status(400).send('Email and password are required') }
    User.register(new User({ email, firstName, lastName, role }), password, function (err) {
            if (err) {
                console.log('error while creating user', err)
                return next(err)
            }
    return res.status(201).json({ "message": "success" })
        })
}

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
    if (!users) { return res.sendstatus(404).send('No users found to display for your management') }
    return res.render('userManagement', { users: users })}

module.exports = controller