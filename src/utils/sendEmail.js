const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	// send mail with defined transport object
	let message = {
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
		to: options.email, // list of receivers
		subject: options.subject, // Subject line
		text: options.message, // plain text body
	};

	console.log(message);

	await transporter.sendMail(message);
};

module.exports = sendEmail;
