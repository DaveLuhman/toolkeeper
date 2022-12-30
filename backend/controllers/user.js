const User = require('/backend/models/user');

const controller = {}

controller.getAllUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
}

module.exports = controller