const toolController = require('./tool.js')
const Tool = require('../models/tool')
c = {}


c.renderDashboard = async (req, res) => {
    console.log('entering dashboard controller')
    let perPage = 10
    let page = req.query.p || 1

    // Chcek if tools have already been passed in from search
    if (req.body.tools != null) {
        console.log('tools passed in from search')
        res.render('dashboard', {
            tools: req.body.tools,
    })}
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

module.exports = c