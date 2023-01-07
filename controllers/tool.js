const Tool = require('../models/tool');

const controller = {}

controller.getAllTools = async (req, res) => {
    const tools = await Tool.find()
    res.json(tools)
}

module.exports = controller