const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const bookingRouter = require("../routes/bookingRoutes");
const router = express.Router();

// Nested booking routes: /users/:userId/bookings
router.use("/:userId/bookings", bookingRouter);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updatePassword", authController.updatePassword);

router
  .route("/currentUser")
  .get(userController.getCurrentUser, userController.getUser);

router
  .route("/favorites")
  .get(userController.getFavorites);

router
  .route("/favorites/:tourId")
  .patch(userController.toggleFavorite);

router
  .route("/")
  .get(authController.restrictTo("admin"), userController.getAllUsers)
  .delete(userController.deleteCurrentUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser,
  )
  .delete(authController.restrictTo("admin"), userController.deleteUser);

module.exports = router;
