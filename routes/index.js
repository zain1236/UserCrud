var express = require('express');
var router = express.Router();
var userRouter = require("./users")
var unauthUserRouter = require("./unauthusers")
var auth = require("../middleware/authentication");

router.use("/users",unauthUserRouter);
router.use("/users",auth,userRouter);

module.exports = router;