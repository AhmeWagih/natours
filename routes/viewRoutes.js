const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get(
  "/",
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview,
);
router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get("/account", authController.protect, viewsController.getAccount);
router.get("/login", viewsController.getLoginForm);
router.get("/signup", viewsController.getSignupForm);
router.get("/my-tours", authController.protect, viewsController.getMyTours);
router.get("/my-favorites", authController.protect, viewsController.getMyFavorites);
router.get("/my-reviews", authController.protect, viewsController.getMyReviews);

// Admin routes
router.get(
  "/admin/tours",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getAdminTours,
);
router.get(
  "/admin/users",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getAdminUsers,
);
router.get(
  "/admin/reviews",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getAdminReviews,
);
router.get(
  "/admin/bookings",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getAdminBookings,
);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData,
);

module.exports = router;
