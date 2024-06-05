import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "../Users";

export interface IAuth extends Document {
	userId: IUser["_id"];
	auth_type: string;
	otp: string;
}

const AuthSchema: Schema<IAuth> = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		auth_type: {
			type: String,
			required: true,
		},
		otp: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const AuthModel: Model<IAuth> = mongoose.model<IAuth>("Auth", AuthSchema);

export default AuthModel;
