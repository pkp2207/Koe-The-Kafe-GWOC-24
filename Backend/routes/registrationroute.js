const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError.js");
const {showAllRegistration,workshopRegistration,destroyRegistration,updateRegistration} = require("../controllers/registrationcontroller.js");
const { validateRegistration } = require("../middlewares/homepagemiddleware.js");


router.get("/", wrapAsync(showAllRegistration))


router.route("/:id")
    .get(wrapAsync(workshopRegistration))

    .delete(wrapAsync(destroyRegistration))

// router.patch("/edit/:id",validateRegistration,wrapAsync(updateRegistration));

module.exports = router;