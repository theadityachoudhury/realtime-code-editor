import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "../Users";

export interface IRoom extends Document {
    createdBy: IUser["_id"];
    files: Number;
    createdAt: Date;
    updatedAt: Date;
}

const RoomSchema: Schema<IRoom> = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        files: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);

const RoomModel: Model<IRoom> = mongoose.model<IRoom>("Room", RoomSchema);

export default RoomModel;
