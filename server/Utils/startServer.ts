import { connectToDB } from "./connectToDB";
import Config from "../Config";
import consola from "consola";

export const startServer = async (app: any) => {
	await connectToDB();
	const port = Config.PORT || 5000;
	app.listen(port, () => {
		consola.success({
			message: `Server is running at http://localhost:${port}`,
			badge: true,
		});
	});
};