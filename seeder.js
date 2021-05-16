const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bootcamp = require("./src/models/Bootcamp");
const Course = require("./src/models/Course");
const User = require("./src/models/User");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/src/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/src/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
	fs.readFileSync(`${__dirname}/src/_data/users.json`, "utf-8")
);

// Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
		console.log("Data entered");
		process.exit();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		console.log("Data deleted...");
		process.exit();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

if (process.argv[2] === "-import" || process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-delete" || process.argv[2] === "-d") {
	deleteData();
}
