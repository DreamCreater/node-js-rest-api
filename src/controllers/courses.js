const asyncHandler = require("../middleware/asyncHandler");
const Bootcamp = require("../models/Bootcamp");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");

// @desc       Get all Courses
// @route      GET /api/v1/courses
// @route      GET /api/v1/bootcamps/:id/courses
// @access     Public
exports.getCourses = asyncHandler(async (req, res, next) => {
	if (req.params.id) {
		const courses = await Course.find({ bootcamp: req.params.id });

		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		return res.status(200).json(res.advancedResults);
	}
});

// @desc       Get Single Course
// @route      GET /api/v1/courses/:id
// @access     Public
exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!course) {
		next(new ErrorResponse(`No course with Id ${req.params.id}`, 404));
	}

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc       Get Single Course
// @route      POST /api/v1/bootcamps/:id/courses
// @access     Private
exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.id;

	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		next(new ErrorResponse(`No bootcamp exists with Id ${req.params.id}`, 400));
	}

	const course = await Course.create(req.body);

	if (!course) {
		next(new ErrorResponse(`No course with Id ${req.params.id}`, 404));
	}

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc       Update Single Course
// @route      PUT /api/v1/courses/:id
// @access     Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!course) {
		next(new ErrorResponse(`No course with Id ${req.params.id}`, 404));
	}

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc       Delete Single Course
// @route      DELETE /api/v1/courses/:id
// @access     Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		next(new ErrorResponse(`No course with Id ${req.params.id}`, 404));
	}

	await course.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
