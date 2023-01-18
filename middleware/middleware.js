const { resolve } = require("path")
const Tool = require('../models/tool')

middleware = {}

middleware.checkAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
        res.locals.pagination = { pageCount: 0}
        return next()
    }
    res.redirect('/login')
}

middleware.getTools = async (req, res, next) => {
    console.log('entering middleware')
    var tools = null
    const { serialNumber, partNumber, barcode, serviceAssignment } = req.body
    console.log(`search parameters, if any, are ${JSON.stringify(req.body)}`)
    if (serialNumber === "" && partNumber === "" && barcode === "" && serviceAssignment === "") {
        console.log('leaving middleware without searching')
    next()
    }
    if (serialNumber !== "") {
        console.log(`Searching for ${serialNumber}...`)
        res.locals.searchTerms = `Serial Number: ${serialNumber}`
        res.locals.tools = await Tool.find({ serialNumber: serialNumber })
    }
    if (partNumber  !== "") {
        console.log(`Searching for ${partNumber}...`)
        res.locals.tools = await Tool.find({ partNumber: partNumber })
    }
    if (barcode  !== "") {
        console.log(`Searching for ${barcode}...`)
        res.locals.tools = await Tool.find({ barcode: barcode })
    }
    if (serviceAssignment  !== "") {
        console.log(`Searching for ${serviceAssignment}...`)
        res.locals.tools = await Tool.find({ serviceAssignment: serviceAssignment })
    }
    if (!tools) { req.message = 'No Tool Found Matching Your Search Parameters' }
    console.log('leaving middleware')
    res.locals.pagination = { pageCount: 1}
    next()
}


module.exports = middleware