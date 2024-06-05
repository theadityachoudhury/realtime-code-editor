import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "../Users";

export interface IRefreshToken extends Document {
	userId: IUser["_id"];
	refreshToken: string[];
}

const RefreshTokenSchema: Schema<IRefreshToken> = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		refreshToken: {
			type: [String],
			required: true,
		},
	},
	{ timestamps: true }
);

const RefreshTokenModel: Model<IRefreshToken> = mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);

export default RefreshTokenModel;
