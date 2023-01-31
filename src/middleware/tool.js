import Tool from '../models/tool.js';


async function getTools(req, res, next) {
  console.info('[MW] getTools-in'.bgBlue.white);
  let search = [];
  let tools = [];
  const perPage = 10;
  let page = req.query.p || 1
  const id = req.params.id;
  const { searchBy, searchValue } = req.body;
  console.log(`body; ${JSON.stringify(req.body)}`)
  switch (searchValue) {
    case id:
      console.info(`[MW] searching id: ${id}`);
      tools = await Tool.findById(req.params.id);
      return next();
    case serialNumber:
      console.info(`[MW] Serial Number: ${searchValue}`);
      res.locals.searchTerms = `Serial Number: ${searchValue}`;
      search = await Tool.findOne({ serialNumber: searchValue })
      break;
    case partNumber:
      res.locals.searchTerms = `Part Number: ${searchValue}`;
      search = await Tool.find({ partNumber: searchValue })
      break;
    case barcode:
      res.locals.searchTerms = `Barcode: ${searchValue}`;
      search = await Tool.find({ barcode: searchValue })
      break;
    case serviceAssignment:
      res.locals.searchTerms = `Service Assignment: ${searchValue}`;
      search = await Tool.find({ serviceAssignment: searchValue }).skip((perPage * page) - perPage).limit(perPage);
      break;
    case status:
      res.locals.searchTerms = `Status: ${searchValue}`;
      search = await Tool.find({ status: searchValue }).skip((perPage * page) - perPage).limit(perPage);
      break;
    default:
      console.warn('[MW] no search parameters provided'.yellow);
      tools = await Tool.find().skip((perPage * page) - perPage).limit(perPage);
      let toolCount = await Tool.countDocuments()
      res.locals.tools = tools.sort((a, b) => a.serialNumber - b.serialNumber);
      res.locals.pagination = { page, pageCount: Math.ceil(toolCount / perPage) };
      console.log(`[MW] pageCount: ${res.locals.pagination.pageCount}`)
      console.info('[MW] leaving mw getTools-out-2'.bgWhite.blue);
      return next();
      break;
  }
  if (!search || search.length === 0) {
    res.locals.message = `No Tool Found Matching ${res.locals.searchValue}`;
    res.locals.tools = [];
    res.locals.pagination = { page, pageCount: 1 };
    console.info('[MW] getTools-out-3'.bgWhite.blue);
    return next();
  }
  res.locals.pagination = { page, pageCount: Math.ceil(search.length / perPage) };
  for (let i = 0; i < search.length; i++) tools.push(search[i]);
  if (!search.length) { tools = [search]; }
  res.locals.tools = tools.sort((a, b) => a.serialNumber - b.serialNumber);
  console.info(`[MW] getTools-out-4`.bgWhite.blue);
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
  res.locals.pagination = { 'page': 1, 'pageCount': 0 }
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

export { getTools, createTool, updateTool, archiveTool, checkTools };