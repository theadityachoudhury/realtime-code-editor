import mongoose, { Document, Schema, Model } from "mongoose";
import { IRoom } from "../Room";
import { IUser } from "../Users";

export interface ICommit extends Document {
    room: IRoom["_id"];
    status: "staging" | "committed" | "reverted";
    stagedBy: IUser["_id"];
    committedBy: IUser["_id"];
    message: string;
    changes: Array<{
        fileName: String;
        file: string;
        content: string;
    }>;
    createdAt: Date;
}

const CommitSchema: Schema<ICommit> = new Schema(
    {
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },
        status: {
            type: String,
            enum: ["staging", "committed", "reverted"],
            default: "staging"
        },
        stagedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        committedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        message: {
            type: String,
        },
        changes: [
            {
                file: { type: Schema.Types.ObjectId, ref: "File", required: true },
                fileName: { type: String, required: true },
                content: { type: String, required: true },
            }
        ]
    },
    { timestamps: true }
);

const CommitModel: Model<ICommit> = mongoose.model<ICommit>("Commit", CommitSchema);

export default CommitModel;
