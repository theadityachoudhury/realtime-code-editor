import consola from "consola";
import mongoose from "mongoose";
import Config from "../Config";

export async function connectToDB() {
    try {
        await mongoose.connect(Config.DB, {
            serverSelectionTimeoutMS: Config.REQUEST_TIMEOUT,
            writeConcern: { w: "majority" },
        });
        consola.start({
            message: "Connecting to"+Config.DB,
            badge: true,
        });
        consola.success({
            message: `Suceessfully connected to the DB`,
            badge: true,
        });
    } catch (err) {
        console.error({
            message: `Error connecting to the DB ${err}`,
            badge: true,
        });
        await connectToDB();
    }
}