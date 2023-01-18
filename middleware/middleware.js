const { resolve } = require("path")
const Tool = require('../models/tool')

middleware = {}

middleware.checkAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
        return next()
    }
    res.redirect('/login')
}

middleware.getTools = async (req, res, next) => {
    console.log('entering middleware')
    var tools = null
    const { serialNumber, partNumber, barcode, serviceAssignment } = req.params
    console.log(`search parameters, if any, are ${JSON.stringify(req.params)}`)
    if (serialNumber == null && partNumber == null && barcode == null && serviceAssignment == null) {
        console.log('leaving middleware without searching')
    next()
    }
    if (serialNumber) {
        console.log(`Searching for ${serialNumber}...`)
        tools = await Tool.findOne({ serialNumber: serialNumber })
    }
    if (partNumber) {
        console.log(`Searching for ${partNumber}...`)
        tools = await Tool.findOne({ partNumber: partNumber })
    }
    if (barcode) {
        console.log(`Searching for ${barcode}...`)
        tools = await Tool.findOne({ barcode: barcode })
    }
    if (serviceAssignment) {
        console.log(`Searching for ${serviceAssignment}...`)
        tools = await Tool.findOne({ serviceAssignment: serviceAssignment })
    }
    if (!tools) { req.message = 'No Tool Found Matching Your Search Parameters' }
    console.log('leaving middleware')
    next()
}


module.exports = middleware