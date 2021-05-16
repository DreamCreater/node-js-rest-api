const express = require("express");

const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	uploadPhotoBootcamp,
} = require("../controllers/bootcamps");

const advancedResult = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");
const { authorize } = require("../middleware/auth");

// Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();
// router.get("/bootcamps", (req, res, next) => {
// 	res.json({ success: true, msg: "Show all bootcamps" });
// });

// router.get("/bootcamp/:id", (req, res, next) => {
// 	res.json({ success: true, msg: "Show single bootcamp" });
// });

// router.post("/bootcamp", (req, res, next) => {
// 	res.json({ success: true, msg: "Add new bootcamp" });
// });

// router.put("/bootcamp/:id", (req, res, next) => {
// 	res.json({ success: true, msg: `update  bootcamp ${req.params.id}` });
// });

// router.delete("/bootcamp/:id", (req, res, next) => {
// 	res.json({ success: true, msg: `delete  bootcamp ${req.params.id}` });
// });

// Re-route into other resource routers
router.use("/:id/courses", courseRouter);

router
	.route("/")
	.get(advancedResult(Bootcamp, "courses"), getBootcamps)
	.post(authorize("publisher", "admin"), createBootcamp);

router
	.route("/:id")
	.get(getBootcamp)
	.put(authorize("publisher", "admin"), updateBootcamp)
	.delete(authorize("publisher", "admin"), deleteBootcamp);

router
	.route("/:id/photo")
	.put(authorize("publisher", "admin"), uploadPhotoBootcamp);

module.exports = router;
