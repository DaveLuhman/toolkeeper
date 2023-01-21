import Tool from '../models/tool.js';


async function getTools(req, res, next) {
    console.log('entering mw - getTools');
    let search = [];
    let tools = [];
    const perPage = 10;
    let page = req.query.p || 1;
    const id = req.params.id;
    if (id) {
        console.log(`searching for tool by id: ${id}`);
        tools = await Tool.findById(req.params.id);
        res.locals.tools = [tools];
        res.locals.pagination = { pageCount: 1 };
        console.log('leaving mw - tool found');
        return next();
    }
    const { serialNumber, partNumber, barcode, serviceAssignment } = req.body;
    if ((id === "" && serialNumber === "" && partNumber === "" && barcode === "" && serviceAssignment === "" || (!id && !serialNumber && !partNumber && !barcode && !serviceAssignment))) {
        console.log('no search parameters provided');
        res.locals.tools = await Tool.find({}).skip((perPage * page) - perPage).limit(perPage);
        res.locals.pagination = { pageCount: Math.ceil(await res.locals.tools.length / perPage) };
        console.log('leaving mw - all tools returned');
        return next();
    }
    else if (serialNumber) {
        console.log(`Serial Number: ${serialNumber}`);
        res.locals.searchTerms = `Serial Number: ${serialNumber}`;
        search = await Tool.findOne({ serialNumber: serialNumber }).skip((perPage * page) - perPage).limit(perPage);
    }
    else if (partNumber) {
        res.locals.searchTerms = `Part Number: ${partNumber}`;
        search = await Tool.find({ partNumber: partNumber }).skip((perPage * page) - perPage).limit(perPage);
    }
    else if (barcode) {
        res.locals.searchTerms = `Barcode: ${barcode}`;
        search = await Tool.find({ barcode: barcode }).skip((perPage * page) - perPage).limit(perPage);

    }
    else if (serviceAssignment) {
        res.locals.searchTerms = `Service Assignment: ${serviceAssignment}`;
        search = await Tool.find({ serviceAssignment: serviceAssignment }).skip((perPage * page) - perPage).limit(perPage);
    }
    if (!search || search.length === 0) {
        res.locals.message = `No Tool Found Matching ${res.locals.searchTerms}`;
        res.locals.tools = [];
        console.log('leaving search mw having found no matches');
        return next();
    }

    for (let i = 0; i < search.length; i++)
        tools.push(search[i]);
    if (!search.length) { tools = [search]; }
    res.locals.tools = tools;
    console.log(`leaving mw - tools returned`.blue);
    return next();
}
async function createTool(req, res, next) {
    console.log('entering mw - createTool');
    const { serialNumber, partNumber, barcode, description, serviceAssignment, status } = req.body;
    if (!(serialNumber || partNumber) || !barcode) {
        res.locals.message = 'Either Serial Num and Barcode or Part Num and Barcode required';
        res.status(400);
        console.log('exiting mw - createTool - missing required fields');
        return next();
    }
    const existing = await Tool.findOne({ $or: [{ 'serialNumber': serialNumber }, { 'barcode': barcode }] });
    if (existing) {
        res.locals.message = 'Tool already exists';
        res.locals.tools = [existing];
        res.status(400);
        console.log('exiting mw - createTool - tool already exists');
        return next();
    }
    let newTool = await Tool.create({ serialNumber, partNumber, barcode, description, serviceAssignment, status, updatedBy: req.user._id, createdBy: req.user._id });
    console.log(`tool id: ${newTool._id}, ${newTool.description} created`);
    res.locals.message = 'Successfully Made A New Tool';
    res.locals.tools = [newTool];
    res.locals.pageCount = 0;
    res.status(201);
    console.log('exiting mw - createTool - new tool created');
    next();
}
async function updateTool(req, res, next) {
    console.log('entering mw - updateTool');
    const { _id } = req.params;
    const { serialNumber, partNumber, barcode, description, serviceAssignment } = req.body;
    let updatedTool = await Tool.findOneAndUpdate({ _id: _id }, { serialNumber, partNumber, barcode, description, serviceAssignment, updatedBy: req.user._id, updatedBy: req.user._id }, { new: true });
    console.log(`tool id: ${id} updated`);
    res.locals.message = 'Successfully Updated Tool';
    res.locals.tools = updatedTool;
    res.locals.pageCount = 0;
    res.status(201);
    next();
}
async function archiveTool(req, res, next) {
    console.log('entering mw - archivedTool');
    const { id } = req.params;
    const { serialNumber, partNumber, barcode, description, serviceAssignment } = req.body;
    let archivedTool = await Tool.findOneAndUpdate({ _id: id }, { serialNumber, partNumber, barcode, description, serviceAssignment, updatedBy: req.user._id, updatedBy: req.user._id, archived: true }, { new: true });
    console.log(archivedTool);
    res.locals.message = 'Successfully Marked Tool Archived';
    res.locals.tools = archivedTool;
    res.locals.pageCount = 0;
    res.status(201);
    next();
}
async function checkTool(req, res, next) {
    var pendingTool = {}
    console.log('entering mw - checkTool');
    const { serialNumber, barcode } = req.body;
    const inboundTool = await Tool.findOne({ $or: [{ 'serialNumber': serialNumber }, { 'barcode': barcode }] });
    if (!inboundTool) {
        res.locals.message = 'Tool not found';
        res.locals.tools = [];
        res.status(400);
        console.log('exiting mw - checkTool - tool does not exist');
        return next();
    }
    if (inboundTool.status === "Checked In") {
        let pendingTool = {
            serialNumber: inboundTool.serialNumber,
            partNumber: inboundTool.partNumber,
            barcode: inboundTool.barcode,
            description: inboundTool.description,
            status: "Checked Out"
        };
        res.locals.tools = pendingTool;
    }
    else {
        let pendingTool = {
            serialNumber: inboundTool.serialNumber,
            partNumber: inboundTool.partNumber,
            barcode: inboundTool.barcode,
            description: inboundTool.description,
            status: "Checked In"
        };
        res.locals.tools = pendingTool;
    }
    console.log(pendingTool);
    res.locals.message = 'PulledToolForStatusChange';
    res.locals.tools = pendingTool;
    res.locals.pageCount = 0;
    res.status(200);
    next();
}
export { getTools, createTool, updateTool, archiveTool };