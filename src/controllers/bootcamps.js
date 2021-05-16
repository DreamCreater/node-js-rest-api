const asyncHandler = require("../middleware/asyncHandler");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");

// @desc       Get all Bootcamps
// @route      GET /api/v1/bootcamps
// @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc       Get Single Bootcamp
// @route      GET /api/v1/bootcamp/:id
// @access     Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404)
		);
	}
	res.json({ success: true, data: bootcamp });
});

// @desc       Create new Bootcamp
// @route      POST /api/v1/bootcamp
// @access     Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	// Add user to req body
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({ success: true, msg: bootcamp._id });
});

// @desc       Update existing Bootcamp
// @route      PUT /api/v1/bootcamp/:id
// @access     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404)
		);
	}
	res.json({ success: true, msg: `updated bootcamp ${req.params.id}` });
});

// @desc       Delete existing Bootcamp
// @route      DELETE /api/v1/bootcamp/:id
// @access     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404)
		);
	}
	bootcamp.remove();
	res.json({ success: true, msg: `deleted bootcamp ${req.params.id}` });
});

// @desc       Upload photo for bootcamp
// @route      PUT /api/v1/bootcamp/:id/photo
// @access     Private
exports.uploadPhotoBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`, 404)
		);
	}
	if (!req.files) {
		return next(new ErrorResponse("Please upload a file", 400));
	}

	const file = req.files.file;

	if (file.size > parseInt(process.env.MAX_FILE_UPLOAD, 10)) {
		return next(
			new ErrorResponse(
				`Please upload an image file less than ${
					parseInt(process.env.MAX_FILE_UPLOAD, 10) / 1000000
				} MB`,
				400
			)
		);
	}

	if (!file.mimetype?.startsWith("image")) {
		return next(new ErrorResponse("Please upload an image file", 400));
	}

	// create custom file name
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	// Upload file
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse("Problem with file upload", 500));
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.json({
			success: true,
			msg: `uploaded photo ${file.name}`,
		});
	});
});
