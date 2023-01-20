const User = require('../models/user');

module.exports = {
    getUsers: async (req, res, next) => {
        let users = [];
        if (req.params.id) {
            users.push(await User.findById(req.params.id))
            res.locals.users = users;
            return next();
        }
        else res.locals.users = await User.find(); next();
    },
    createUser: async (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body
        if (!email || !password) { return res.status(400).send('Email and password are required'); return next() }
        if (await User.findOne({ email: email })) { res.status(400).send('User already exists'); return next() }
        let hash = bcrypt.hashSync(password, 10)
        res.locals.user = await User.create({ firstName, lastName, email, password: hash, role })
        return next()
    },
    verifySelf: async (req, res, next) => {
        let targetID = req.params.id
        let currentUser = req.user
        if (targetID != currentUser._id) { return res.status(401).send('Unauthorized') }
        return next()
    },
    updateUser: async (req, _res, next) => {
        await User.findByIdAndUpdate(req.params.id, { $set: req.body })
        return next()
    }
}