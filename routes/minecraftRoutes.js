const express = require("express")
const minecraftControllers = require("../controllers/minecraftControllers")
const router = express.Router();


router
    .route("/test")
    .get(minecraftControllers.test)

router
    .route("/test")
    .post(minecraftControllers.testPost)


module.exports = router;