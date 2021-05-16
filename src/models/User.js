const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add a name"],
	},
	email: {
		type: String,
		required: [true, "PLease enter email address"],
		unique: true,
		match: [
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
			"Please use a valid email address",
		],
	},
	role: {
		type: String,
		required: [true, "Please add a role"],
		enum: ["user", "publisher", "admin"],
		default: "user",
	},
	password: {
		type: String,
		required: [true, "Please enter a password"],
		minlength: [6, "Password should be atleast 6 characters"],
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Sign JWT and return
UserSchema.methods.getSignedJWTToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match entered password with hashed saved password
UserSchema.methods.matchPassword = async function (enteredPass) {
	return await bcrypt.compare(enteredPass, this.password);
};

module.exports = mongoose.model("User", UserSchema);
