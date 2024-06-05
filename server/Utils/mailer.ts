import nodemailer from "nodemailer";
import Config from "../Config";
import EmailLogs from "../Models/EmailLogs";

const { SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_SENDER_NAME } = Config;

const save_message = async (
	userId: string,
	to: string,
	subject: string,
	body: string,
	status: string,
	type: string,
	messageId: string
) => {
	let log = new EmailLogs({
		userId,
		to,
		subject,
		body,
		status,
		type,
		messageId,
	});
	await log.save();
};

const sendMailWithRetry = async (transporter: any, message: any, retries: number = 3, delay: number = 1000) => {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			let info = await transporter.sendMail(message);
			return info;
		} catch (error) {
			if (attempt < retries) {
				console.error(`Attempt ${attempt} to send email failed. Retrying in ${delay} ms...`);
				await new Promise(res => setTimeout(res, delay));
				delay *= 2; // Exponential backoff
			} else {
				console.error(`All ${retries} attempts to send email failed.`);
				throw error;
			}
		}
	}
};

export const mailer = async (
	to: any,
	subject: string,
	hbody: string,
	userId: string,
	type: string
) => {
	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT,
		secure: true,
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS,
		},
	});
	if (!Array.isArray(to)) {
		to = [to];
	}

	let message = {
		from: `${SMTP_SENDER_NAME} <${SMTP_USER}>`, // sender address
		to: to.join(", "), // List of receivers, join the array into a comma-separated string
		subject: subject, // Subject line
		html: hbody, // html body
	};

	try {
		let info = await sendMailWithRetry(transporter, message);
		for (const recipient of to) {
			await save_message(
				userId,
				recipient,
				subject,
				hbody,
				"success",
				type,
				info.messageId
			);
		}
	} catch (error) {
		console.error('Failed to send email:', error);
		for (const recipient of to) {
			await save_message(
				userId,
				recipient,
				subject,
				hbody,
				"failure",
				type,
				""
			);
		}
	}
};
