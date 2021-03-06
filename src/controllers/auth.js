const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;
	const user = await User.create({
		name,
		password,
		email,
		role,
	});

	sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate email and password
	if (!email || !password) {
		return next(new ErrorResponse("Please provide email and password", 400));
	}

	// Check for user
	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}

	// Check if password matches
	const isMatched = await user.matchPassword(password);

	if (!isMatched) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}

	sendTokenResponse(user, 200, res);
});

// @desc    Get current loggedIn user
// @route   POST /api/v1/auth/login
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({ success: true, data: user });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorResponse("No user with mentioned email.", 404));
	}

	const resetToken = await user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	// Create reset URL
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/resetpassword/${resetToken}`;

	const message = `Please make a PUT request to ${resetURL}`;

	try {
		sendEmail({
			email: user.email,
			subject: "Password Reset Token",
			message,
		});

		res.status(200).json({ success: true, data: "Reset email sent" });
	} catch (error) {
		console.log(error);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse("Email could not be sent", 500));
	}
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJWTToken();

	const options = {
		expires: new Date(
			Date.now() +
				parseInt(process.env.JWT_COOKIE_EXPIRE, 10) * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res
		.status(statusCode)
		.cookie("token", token, options)
		.json({ success: true, token });
};
