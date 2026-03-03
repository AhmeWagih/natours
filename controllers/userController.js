const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerController')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for password updates. Please use /updatePassword.', 400));
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
})

exports.deleteUser = factory.deleteOne(User);

exports.deleteCurrentUser =  catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    return next(new AppError("You are not logged in", 404));
  }
  res.status(204).json({ status: "success", data: null });
});