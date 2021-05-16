const express = require("express");

const {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");

const advancedResults = require("../middleware/advancedResults");
const { authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(
		advancedResults(Course, {
			path: "bootcamp",
			select: "name description",
		}),
		getCourses
	)
	.post(addCourse);

router
	.route("/:id")
	.get(getCourse)
	.post(authorize("publisher", "admin"), addCourse)
	.put(authorize("publisher", "admin"), updateCourse)
	.delete(authorize("publisher", "admin"), deleteCourse);

module.exports = router;
