const User = require('../models/user');

const controller = {}

controller.getAllUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
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

module.exports = controller