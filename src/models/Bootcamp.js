const mongoose = require("mongoose");
const slugify = require("slugify");

const BootCampSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "PLease add a name"],
			unique: true,
			trim: true,
			maxlength: [50, "Name cannot be more than 50 characters"],
		},
		slug: String,
		description: {
			type: String,
			required: [true, "Please add a description"],
			maxlength: [500, "Name cannot be more than 500 characters"],
		},
		website: {
			type: String,
			match: [
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
				"Please use a valid URL with HTTP or HTTPS",
			],
		},
		email: {
			type: String,
			match: [
				/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
				"Please use a valid email address",
			],
		},
		address: {
			type: String,
			required: [true, "Please add an address"],
		},
		careers: {
			type: [String],
			required: true,
			enum: [
				"Web Development",
				"Business",
				"Mobile Development",
				"Other",
				"UI/UX",
				"Data Science",
			],
		},
		averageRating: {
			type: Number,
			min: [1, "Rating must be at least 1"],
			max: [10, "Rating must not be more than 10"],
		},
		averageCost: {
			type: Number,
		},
		photo: {
			type: String,
			default: "no-photo.jpg",
		},
		housing: {
			type: Boolean,
			default: false,
		},
		jobAssistance: {
			type: String,
			default: false,
		},
		jobGaurantee: {
			type: Boolean,
			default: false,
		},
		acceptGi: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Create slug from name
BootCampSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// Cascde delete courses when a bootcamp is deleted
BootCampSchema.pre("remove", async function (next) {
	await this.model("Course").deleteMany({ bootcamp: this._id });
	next();
});

// Reverse populate with virtuals
BootCampSchema.virtual("courses", {
	ref: "Course",
	localField: "_id",
	foreignField: "bootcamp",
	justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootCampSchema);
