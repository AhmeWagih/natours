const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");
const factory = require("../controllers/handlerController");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.checkIfBooked = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({
    tour: req.body.tour,
    user: req.body.user,
  });
  if (!booking) {
    return next(
      new AppError("You can only review a tour that you have booked.", 403)
    );
  }
  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
