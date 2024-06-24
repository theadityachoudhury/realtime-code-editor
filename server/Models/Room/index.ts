import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "../Users";
import { ICommit } from "../Commits";

export interface IRoom extends Document {
    createdBy: IUser["_id"];
    files: Number;
    createdAt: Date;
    updatedAt: Date;
    head: ICommit["_id"];
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
        head: {
            type: Schema.Types.ObjectId,
            ref: "Commit"
        }
    },
    { timestamps: true }
);

const RoomModel: Model<IRoom> = mongoose.model<IRoom>("Room", RoomSchema);

export default RoomModel;
