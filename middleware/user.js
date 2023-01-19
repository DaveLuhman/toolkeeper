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
    }
}