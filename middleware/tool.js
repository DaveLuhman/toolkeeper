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
    const { searchBy, searchValue } = req.body
    if (searchValue == "" || !searchValue) {
        console.log('no search parameters provided');
        res.locals.tools = await Tool.find({}).skip((perPage * page) - perPage).limit(perPage);
        res.locals.pagination = { pageCount: Math.ceil(await res.locals.tools.length / perPage) };
        console.log('leaving mw - all tools returned');
        return next();
    }
    else if (searchBy == 'serialNumber') {
        console.log(`Serial Number: ${searchValue}`);
        res.locals.searchTerms = `Serial Number: ${searchValue}`;
        search = await Tool.findOne({ serialNumber: searchValue }).skip((perPage * page) - perPage).limit(perPage);
    }
    else if (searchBy == 'partNumber') {
        res.locals.searchTerms = `Part Number: ${searchValue}`;
        search = await Tool.find({ partNumber: searchValue }).skip((perPage * page) - perPage).limit(perPage);
    }
    else if (searchBy == 'barcode') {
        res.locals.searchTerms = `Barcode: ${searchValue}`;
        search = await Tool.find({ barcode: searchValue }).skip((perPage * page) - perPage).limit(perPage);

    }
    else if (searchBy == 'serviceAssignment') {
        res.locals.searchTerms = `Service Assignment: ${searchValue}`;
        search = await Tool.find({ serviceAssignment: searchValue }).skip((perPage * page) - perPage).limit(perPage);
    }
    if (!search || search.length === 0) {
        res.locals.message = `No Tool Found Matching ${res.locals.searchValue}`;
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
    let updatedToolArray = [];
    console.log(typeof req.body._id)
    if (typeof req.body._id === 'string') {
        const { _id, partNumber, description, serviceAssignment, status } = req.body;
        let updatedTool = await Tool.findByIdAndUpdate(_id, { partNumber, description, serviceAssignment, status }, { new: true })
        console.log('updated single Tool: ' + updatedTool);
        updatedToolArray.push(updatedTool);
    }
    if (typeof req.body._id === 'object') {
        const { _id, partNumber, description, serviceAssignment, status } = req.body;
        for (let i = 0; i < _id.length; i++) {
            let updatedTool = await Tool.findByIdAndUpdate(_id[i], {
                'partNumber': partNumber[i],
                'description': description[i],
                'serviceAssignment': serviceAssignment[i],
                'status': status[i]
            }, { new: true }).exec();
            console.log('updated iterated Tool line 103: ' + updatedTool);
            updatedToolArray.push(updatedTool);
        }
        console.log(`updated tools: ${updatedToolArray}`)
    }
    res.locals.tools = updatedToolArray
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
async function checkTools(req, res, next) {
    console.log('entering mw - checkTool');
    if (!(req.body.serialNumber || req.body.barcode)) { res.status(400); res.locals.message = 'No Tools Submitted for status change'; return next(); }
    let searchTerms = [];
    let checkingTools = [];
    for (let i = 0; i < req.body.serialNumber.length; i++) if (req.body.serialNumber[i] != '') searchTerms.push(req.body.serialNumber[i]);
    for (let i = 0; i < req.body.barcode.length; i++) if (req.body.barcode[i] != '') searchTerms.push(req.body.barcode[i]);
    for (let i = 0; i < searchTerms.length; i++) {
        let tempTool = await Tool.findOne({ $or: [{ 'serialNumber': searchTerms[i] }, { 'barcode': searchTerms[i] }] });
        if (tempTool.status === "Checked In") {
            let pendingTool = {
                _id: tempTool._id,
                serialNumber: tempTool.serialNumber,
                partNumber: tempTool.partNumber,
                barcode: tempTool.barcode,
                description: tempTool.description,
                status: "Checked Out",
                statusChanged: true
            }
            checkingTools.push(pendingTool);
        }
        if (tempTool.status === "Checked Out") {
            let pendingTool = {
                _id: tempTool._id,
                serialNumber: tempTool.serialNumber,
                partNumber: tempTool.partNumber,
                barcode: tempTool.barcode,
                description: tempTool.description,
                status: "Checked in",
                statusChanged: true,
                serviceAssignment: 'Tool Room',
                serviceAssignmentChanged: true
            }
            checkingTools.push(pendingTool);
        }
    }
    if (!checkingTools || checkingTools.length === 0) {
        res.locals.message = 'Tools not found';
        res.locals.tools = [];
        res.status(400);
        console.log('exiting mw - checkTool - no tools found');
        return next();
    }
    res.locals.message = 'Confirm your tools for status change';
    res.locals.tools = checkingTools;
    res.locals.pageCount = Math.ceil(checkingTools.length / 10)
    res.status(200);
    next();
}
function logBody(req, res, next) {
    console.log('entering mw - logBody');
    console.log(req.body);
    next();
}
export { getTools, createTool, updateTool, archiveTool, checkTools, logBody };