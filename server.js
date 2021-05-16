const express = require("express");
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");

// Database
const connectDB = require("./config/db");

// Middleware
const morgan = require("morgan");
const logger = require("./src/middleware/logger");
const errorHandler = require("./src/middleware/error");
const { protect } = require("./src/middleware/auth");

// Route files
const bootcampRouter = require("./src/routers/bootcamps");
const courseRouter = require("./src/routers/courses");
const authRouter = require("./src/routers/auth");

// Load env vars
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

// Body Parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

app.use(fileupload());

app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", protect, bootcampRouter);
app.use("/api/v1/courses", protect, courseRouter);
app.use("/api/v1/auth", authRouter);

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
// app.use(logger);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
	console.log(`App listening in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error, promise) => {
	console.log(`Unhandeled Rejection ::: ${error.message}`);
	server.close(() => {
		process.exit(1);
	});
});
