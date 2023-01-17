const Router = require("express").Router();
const api = require("../controllers/api");

// @endpoint /api/
// @desc Test endpoint
// @access Public
Router.get("/", (req, res) => { res.send("ok");})

// @endpoint /api/tool/search
// @desc Search for a tool by SN, PN, BC, or SA
// @access API
Router.get("/tool/search", api.search);