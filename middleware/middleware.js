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
    let tools;
    let perPage = 10;
    let page = req.query.p || 1;
    if (req.body.tools) {console.log('tools already being passed in'); return next();}
    const { serialNumber, partNumber, barcode, serviceAssignment } = req.body;
    if ((serialNumber === "" && partNumber === "" && barcode === "" && serviceAssignment === "" || (!serialNumber && !partNumber && !barcode && !serviceAssignment))) {
        console.log('no search parameters provided');
        res.locals.tools =  await Tool.find({}).skip((perPage * page) - perPage).limit(perPage);
        res.locals.pagination = { pageCount: Math.ceil(await Tool.countDocuments() / perPage) };
        console.log('leaving middleware - all tools returned');
    return next();
    }
    else if (serialNumber !== "") {
        res.locals.searchTerms = `Serial Number: ${serialNumber}`;
        tools = await Tool.find({ serialNumber: serialNumber }).skip((perPage * page) - perPage).limit(perPage);
    }
    else if (partNumber  !== "") {
        res.locals.searchTerms = `Part Number: ${partNumber}`;
        tools = await Tool.find({ partNumber: partNumber }).skip((perPage * page) - perPage).limit(perPage);
    }
    else if (barcode  !== "") {
        res.locals.searchTerms = `Barcode: ${barcode}`;
        tools = await Tool.find({ barcode: barcode }).skip((perPage * page) - perPage).limit(perPage);
    }
    else if (serviceAssignment  !== "") {
        res.locals.searchTerms = `Service Assignment: ${serviceAssignment}`;
        tools = await Tool.find({ serviceAssignment: serviceAssignment }).skip((perPage * page) - perPage).limit(perPage);
    }
    if (!tools) {
        res.locals.message = `No Tool Found Matching ${res.locals.searchTerms}`;
      console.log('leaving search middleware having found no matches');
    }
    res.locals.tools = tools;
    console.log('leaving middleware');

    next();
};

module.exports = middleware;