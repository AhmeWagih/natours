const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", authController.isLoggedIn, viewsController.getOverview);
router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get("/account", authController.protect, viewsController.getAccount);
router.get("/login", viewsController.getLoginForm);
router.get("/signup", viewsController.getSignupForm);

router.post("/submit-user-data", authController.protect, viewsController.updateUserData);

module.exports = router;
