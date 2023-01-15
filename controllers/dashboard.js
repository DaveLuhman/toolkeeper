const toolController = require('./tool.js')
controller = {}

controller.getIndexDashboard = async (req, res) => {
    let tools = await toolController.getAllTools()
    res.render('dashboard', {tools: tools, user: req.user}) }

module.exports = controller