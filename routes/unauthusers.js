var express = require("express")
var router = express.Router();
var controller = require("../controllers")


router.post("/",controller.User.create)
router.post("/login",controller.User.login)


module.exports = router;