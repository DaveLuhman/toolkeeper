const Tool = require('../models/tool');


module.exports = {
    getTools: async (req, res, next) => {
        console.log('entering mw - getTools');
        let search = [];
        let tools = [];
        const perPage = 10;
        let page = req.query.p || 1;
        const id = req.params.id;
        if (id) {
            console.log(`searching for tool by id: ${id}`);
            tools = await Tool.findById(req.params.id)
            console.log(tools)
            res.locals.tools = [tools];
            res.locals.pagination = { pageCount: 1 };
            console.log('leaving mw - tool found');
            return next();
        }
        const { serialNumber, partNumber, barcode, serviceAssignment } = req.body;
        if ((id === "" && serialNumber === "" && partNumber === "" && barcode === "" && serviceAssignment === "" || (!id && !serialNumber && !partNumber && !barcode && !serviceAssignment))) {
            console.log('no search parameters provided');
            res.locals.tools = await Tool.find({}).skip((perPage * page) - perPage).limit(perPage);
            res.locals.pagination = { pageCount: Math.ceil(await Tool.countDocuments() / perPage) };
            console.log('leaving mw - all tools returned');
            return next();
        }
        else if (serialNumber) {
            console.log(`Serial Number: ${serialNumber}`);
            res.locals.searchTerms = `Serial Number: ${serialNumber}`;
            search = await Tool.findOne({ serialNumber: serialNumber }).skip((perPage * page) - perPage).limit(perPage)
        }
        else if (partNumber) {
            res.locals.searchTerms = `Part Number: ${partNumber}`;
            search = await Tool.find({ partNumber: partNumber }).skip((perPage * page) - perPage).limit(perPage)
        }
        else if (barcode) {
            res.locals.searchTerms = `Barcode: ${barcode}`;
            search = await Tool.find({ barcode: barcode }).skip((perPage * page) - perPage).limit(perPage)

        }
        else if (serviceAssignment) {
            res.locals.searchTerms = `Service Assignment: ${serviceAssignment}`;
            search = await Tool.find({ serviceAssignment: serviceAssignment }).skip((perPage * page) - perPage).limit(perPage)
        }
        if (!search || search.length === 0) {
            res.locals.message = `No Tool Found Matching ${res.locals.searchTerms}`;
            res.locals.tools = [];
            console.log('leaving search mw having found no matches');
            return next();
        }

        for (let i = 0; i < search.length; i++) tools.push(search[i]);
        if (!search.length) { tools = [search]}
        res.locals.tools = tools;
        console.log(`leaving mw - tools returned`.blue);
        return next();
    },
    createTool: async (req, res, next) => {
        console.log('entering mw - createTool')
        const { serialNumber, partNumber, barcode, description, serviceAssignment } = req.body;
        if (!(serialNumber || partNumber) || !barcode) {
            res.locals.message = 'Either Serial Num and Barcode or Part Num and Barcode required'
            res.status(400)
            console.log('exiting mw - createTool - missing required fields')
            return next()
        }
        const existing = await Tool.findOne({ $or: [{ 'serialNumber': serialNumber }, { 'barcode': barcode }] })
        if (existing) {
            res.locals.message = 'Tool already exists'
            res.locals.tools = [existing]
            res.status(400)
            console.log('exiting mw - createTool - tool already exists')
            return next()
        }
        let newTool = await Tool.create({ serialNumber, partNumber, barcode, description, serviceAssignment, updatedBy: req.user._id, createdBy: req.user._id })
        console.log(`tool id: ${newTool._id}, ${newTool.description} created`)
        res.locals.message = 'Successfully Made A New Tool';
        res.locals.tools = [newTool];
        res.locals.pageCount = 0;
        res.status(201)
        console.log('exiting mw - createTool - new tool created')
        next();
    },
    updateTool: async (req, res, next) => {
        console.log('entering mw - updateTool')
        const { _id } = req.params;
        const { serialNumber, partNumber, barcode, description, serviceAssignment } = req.body;
        let updatedTool = await Tool.findOneAndUpdate({ _id: _id }, { serialNumber, partNumber, barcode, description, serviceAssignment, updatedBy: req.user._id, updatedBy: req.user._id }, { new: true })
        console.log(`tool id: ${updatedTool._id} updated`)
        res.locals.message = 'Successfully Updated Tool';
        res.locals.tools = updatedTool;
        res.locals.pageCount = 0;
        res.status(201)
        next();
    }
}
