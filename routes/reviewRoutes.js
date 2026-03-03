const express = require("express");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserId,
    reviewController.createReview,
  );

router
  .route("/:id")
  .delete(authController.protect, reviewController.deleteReview)
  .patch(authController.protect, reviewController.updateReview);

module.exports = router;
