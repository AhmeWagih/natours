const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }

  let isFavorite = false;
  if (res.locals.user && Array.isArray(res.locals.user.favorites)) {
    isFavorite = res.locals.user.favorites.some(
      (favId) => favId.toString() === tour._id.toString(),
    );
  }

  res.status(200).render("tour", {
    title: `${tour.name} tour`,
    tour,
    isFavorite,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

exports.getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Sign up",
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render("account", {
    title: "Your account",
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = await bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render("overview", {
    title: "My tours",
    tours,
  });
});

exports.getMyFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("favorites");
  const tours = user.favorites || [];

  res.status(200).render("overview", {
    title: "My favorite tours",
    tours,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate({ path: "tour", select: "name slug imageCover" })
    .sort("-createdAt");

  res.status(200).render("myReviews", {
    title: "My reviews",
    reviews,
  });
});

// Admin management views
exports.getAdminTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("adminTours", {
    title: "Manage tours",
    tours,
  });
});

exports.getAdminUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render("adminUsers", {
    title: "Manage users",
    users,
  });
});

exports.getAdminReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
    .populate({ path: "user", select: "name email" })
    .populate({ path: "tour", select: "name" })
    .sort("-createdAt");
  res.status(200).render("adminReviews", {
    title: "Manage reviews",
    reviews,
  });
});

exports.getAdminBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate({ path: "user", select: "name email" })
    .populate({ path: "tour", select: "name" })
    .sort("-createdAt");
  res.status(200).render("adminBookings", {
    title: "Manage bookings",
    bookings,
  });
});
