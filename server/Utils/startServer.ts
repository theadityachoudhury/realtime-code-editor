import { connectToDB } from "./connectToDB";
import Config from "../Config";
import consola from "consola";
import { Application } from "express";
import { createServer } from "http";
import { initializeSocket } from "./socket";

export const startServer = async (app: Application) => {
	await connectToDB();
	const server = createServer(app);
	const io = initializeSocket(server);
	const port = Config.PORT || 5000;
	server.listen(port, () => {
		consola.success({
			message: `Server is running at http://localhost:${port}`,
			badge: true,
		});
	});
};