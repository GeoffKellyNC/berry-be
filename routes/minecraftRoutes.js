const express = require("express")
const minecraftControllers = require("../controllers/minecraftControllers")
const router = express.Router();


router
    .route("/test")
    .get(minecraftControllers.test)


module.exports = router;