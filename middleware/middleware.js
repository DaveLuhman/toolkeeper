const Tool = require('../models/tool');

const middleware = {};

middleware.checkAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        res.locals.pagination = { pageCount: 0};
        return next();
    }
    res.redirect('/login');
};

middleware.getTools = async (req, res, next) => {
    console.log('entering middleware');
    let perPage = 10;
    let page = req.query.p || 1;
    if (req.body.tools) {console.log('tools already being passed in'); next();}
    var tools;
    const { serialNumber, partNumber, barcode, serviceAssignment } = req.body;
    console.log(`search parameters, if any, are ${JSON.stringify(req.body)}`);
    if (serialNumber === "" && partNumber === "" && barcode === "" && serviceAssignment === "") {
        console.log('leaving middleware without searching');
    next();
    }
    if (serialNumber !== "") {
        console.log(`Searching for ${serialNumber}...`);
        res.locals.searchTerms = `Serial Number: ${serialNumber}`;
        res.locals.tools = await Tool.find({ serialNumber: serialNumber }).skip((perPage * page) - perPage).limit(perPage);
    }
    if (partNumber  !== "") {
        console.log(`Searching for ${partNumber}...`);
        res.locals.tools = await Tool.find({ partNumber: partNumber }).skip((perPage * page) - perPage).limit(perPage);
    }
    if (barcode  !== "") {
        console.log(`Searching for ${barcode}...`);
        res.locals.tools = await Tool.find({ barcode: barcode }).skip((perPage * page) - perPage).limit(perPage);
    }
    if (serviceAssignment  !== "") {
        console.log(`Searching for ${serviceAssignment}...`);
        res.locals.tools = await Tool.find({ serviceAssignment: serviceAssignment }).skip((perPage * page) - perPage).limit(perPage);
    }
    if (!tools) {
      req.message = 'No Tool Found Matching Your Search Parameters';
      console.log('leaving search middleware having found no matches');
      next();
    }
    console.log('leaving middleware');

    next();
};

module.exports = middleware;