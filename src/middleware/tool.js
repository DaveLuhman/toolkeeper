import Tool from '../models/tool.js';
import { paginate } from './util.js';

async function getAllTools(req, res, next) {
  console.info('[MW] getAllTools-in'.bgBlue.white);
  const tools = await Tool.find({});
  tools.sort((a, b) => a.serialNumber - b.serialNumber);
  let { trimmedData, pageCount, targetPage} = paginate(tools, req.query.p, 10);
  res.locals.pagination = { page: targetPage, pageCount: pageCount }; //pagination
  res.locals.tools = trimmedData; //array of tools
  console.info(`[MW] getAllTools-out`.bgWhite.blue);
  return next();
}
async function getToolByID(req, res, next) {
  const id = req.params.id;
  console.info(`[MW] searching id: ${id}`);
  let tools = await Tool.findById({ $eq: id });
  res.locals.tools = [tools];
  return next();
}
async function searchTools(req, res, next) {
  console.info('[MW] searchTools-in'.bgBlue.white);
  const { searchBy, searchValue } = req.body;
  const tools = Tool.find({ [searchBy]: { $regex: searchValue, $options: 'i' } });
  tools.sort((a, b) => a.serialNumber - b.serialNumber);
  let { trimmedData, pageCount, targetPage} = paginate(tools, req.query.p, 10);
  res.locals.pagination = { page: targetPage, pageCount: pageCount }; //pagination
  res.locals.tools = trimmedData; //array of tools
  console.info(`[MW] searchTools-out`.bgWhite.blue);
  return next();
}
async function createTool(req, res, next) {
  console.info('[MW] createTool-in'.bgBlue.white);
  const { serialNumber, partNumber, barcode, description, serviceAssignment, status } = req.body;
  if (!(serialNumber || partNumber) || !barcode) {
    res.locals.message = 'Either Serial Num and Barcode or Part Num and Barcode required';
    console.error('[MW] createTool-out-1'.red);
    res.status(400).redirect('back');
    return;
  }
  const existing = await Tool.findOne({ $or: [{ 'serialNumber': serialNumber }, { 'barcode': barcode }] });
  if (existing) {
    res.locals.message = 'Tool already exists';
    res.locals.tools = [existing];
    console.error('[MW] createTool-out-2'.red);
    res.status(400).redirect('back');
    return next();
  }
  let newTool = await Tool.create({ serialNumber, partNumber, barcode, description, serviceAssignment, status, updatedBy: req.user._id, createdBy: req.user._id });
  res.locals.message = 'Successfully Made A New Tool';
  res.locals.tools = [newTool];
  res.locals.pagination = { pageCount: 1 };
  res.status(201);
  console.info(`[MW] Tool Successfully Created ${newTool._id}`.green);
  console.info('[MW] createTool-out-3'.bgWhite.blue);
  next();
}
async function updateTool(req, res, next) {
  console.info('[MW] updateTool-in'.bgBlue.white);
  let updatedToolArray = [];
  if (typeof req.body._id === 'string') {
    const { _id, partNumber, description, serviceAssignment, status } = req.body;
    let updatedTool = await Tool.findByIdAndUpdate(_id,
      {
        partNumber: partNumber,
        description: description,
        serviceAssignment: serviceAssignment,
        status: status
      }, { new: true }).exec();
    console.info(`updatedTool: ${updatedTool}`.green)
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
      console.info(`updatedTool: ${updatedTool}`.green)
      updatedToolArray.push(updatedTool);
    }
  }
  res.locals.tools = updatedToolArray;
  res.locals.pagination = { 'page': 1, 'pageCount': 1 }
  res.status(201);
  console.info('[MW] Successfully Updated Tools: '.green + updatedToolArray);
  console.info('[MW] updateTool-out-1'.bgWhite.blue);
  next();
}
async function archiveTool(req, res, next) {
  console.info('[MW] archiveTool-in'.bgBlue.white);
  const { id } = req.params;
  const { serialNumber, partNumber, barcode, description, serviceAssignment } = req.body;
  let archivedTool = await Tool.findOneAndUpdate({ _id: id }, { serialNumber, partNumber, barcode, description, serviceAssignment, updatedBy: req.user._id, archived: true }, { new: true });
  res.locals.message = 'Successfully Marked Tool Archived';
  res.locals.tools = archivedTool;
  res.locals.pageCount = 0;
  res.status(201);
  console.info('[MW] archiveTool-out-1'.bgWhite.blue);
  next();
}
async function checkTools(req, res, next) {
  console.info('[MW] checkTools-in'.bgBlue.white);
  console.log(JSON.stringify(req.body))
  if (req.body === "") { res.locals.message = 'No Tools Submitted For Status Change'; console.warn('[MW checkTools-out-1'.bgWhite.blue); res.status(400).redirect('back'); return; }
  const { searchTerm } = req.body;
  let checkingTools = [];
  for (let i = 0; i < searchTerm.length; i++) {
    if (searchTerm[i] === "") { continue; }
    let tempTool = await Tool.findOne({ $or: [{ 'serialNumber': searchTerm[i] }, { 'barcode': searchTerm[i] }] });
    if (tempTool.status === "Checked In") {
      let pendingTool = {
        _id: tempTool._id,
        serialNumber: tempTool.serialNumber,
        partNumber: tempTool.partNumber,
        barcode: tempTool.barcode,
        description: tempTool.description,
        serviceAssignment: 'FILL THIS IN',
        serviceAssignmentChanged: true,
        status: "Checked Out",
        statusChanged: true
      };
      checkingTools.push(pendingTool);
    }
    if (tempTool.status === "Checked Out") {
      let pendingTool = {
        _id: tempTool._id,
        serialNumber: tempTool.serialNumber,
        partNumber: tempTool.partNumber,
        barcode: tempTool.barcode,
        description: tempTool.description,
        status: "Checked In",
        statusChanged: true,
        serviceAssignment: 'Tool Room',
        serviceAssignmentChanged: false
      };
      checkingTools.push(pendingTool);
    }
  }
  if (!checkingTools || checkingTools.length === 0) {
    res.locals.message = 'Tools not found';
    res.locals.tools = [];
    console.warn('[MW] Tools Not Found'.yellow);
    console.info('[MW] checkTools-out-2'.bgWhite.blue);
    res.status(400).redirect('back');
    return;
  }

  res.locals.tools = checkingTools;
  res.locals.pageCount = Math.ceil(checkingTools.length / 10);
  res.status(200);
  console.info('[MW] checkTools-out-3'.bgWhite.blue);
  next();
}

export { getAllTools, getToolByID, searchTools, createTool, updateTool, archiveTool, checkTools };