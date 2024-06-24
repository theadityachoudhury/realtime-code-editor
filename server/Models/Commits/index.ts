import mongoose, { Document, Schema, Model } from "mongoose";
import { IRoom } from "../Room";
import { IUser } from "../Users";

export interface ICommit extends Document {
    room: IRoom["_id"];
    committedBy: IUser["_id"];
    message: string;
    changes: Array<{
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
        committedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true
        },
        changes: [
            {
                file: { type: Schema.Types.ObjectId, ref: "File", required: true },
                content: { type: String, required: true }
            }
        ]
    },
    { timestamps: true }
);

const CommitModel: Model<ICommit> = mongoose.model<ICommit>("Commit", CommitSchema);

export default CommitModel;
