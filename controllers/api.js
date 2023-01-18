c = {}
const Tool = require('../models/tool')

// search for a tool by SN, PN, BC, or SA
c.search = async (req, res) => {
const { sn, pn, bc, sa } = req.params
const tools = await Tool.find({ $or: [{ serialNumber: sn }, { partNumber: pn }, { barcode: bc }, { serviceAssignment: sa }] })
res.send(200).json(tools)
}

module.exports = c

