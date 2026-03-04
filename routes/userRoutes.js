const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword,
);

router
  .route("/currentUser")
  .get(
    authController.protect,
    userController.getCurrentUser,
    userController.getUser,
  );

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .delete(authController.protect, userController.deleteCurrentUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser,
  );

module.exports = router;
