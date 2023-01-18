const toolController = require('./tool.js')
const Tool = require('../models/tool')
c = {}


c.renderDashboard = (req, res) => {
    console.log('entering dashboard index controller')
    let perPage = 10
    let page = req.query.p || 1


    console.log(page)
    Tool.find({}).skip((perPage * page) - perPage).limit(perPage)
        .exec(function (err, tools) {
            Tool.count().exec(function (err, count) {
                if (err) return next(err)
                res.render('dashboard', {
                    tools: tools,
                    pagination: {
                        page: page,
                        pageCount: Math.ceil(count / perPage)
                    }
                })
            })
        })
}
c.renderSearch = async (req, res) => {
    console.log('entering dashboard search controller')
    const { serialNumber, partNumber, barcode, serviceAssignment } = req.body
    console.log(`search parameters, if any, are ${JSON.stringify(req.body)}`)
    const tools = await Tool.find({ $or: [{ serialNumber: serialNumber }, { partNumber: partNumber }, { barcode: barcode }, { serviceAssignment: serviceAssignment }] })
    console.log(`tools found: ${JSON.stringify(tools)}`)
    if (!tools) { res.render('dashboard', { message: 'No Tool Found Matching Your Search Parameters'}) }
    res.render('dashboard', { tools: tools, pagination: { pageCount: 0 } })
}


module.exports = c