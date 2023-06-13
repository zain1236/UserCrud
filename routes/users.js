var express = require("express")
var router = express.Router();
var controller = require("../controllers")


router.get("/",controller.User.getAll)
router.get("/:id",controller.User.getOne)
router.delete("/:id",controller.User.delete)
router.put("/:id",controller.User.update)


module.exports = router;