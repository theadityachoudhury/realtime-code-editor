import mongoose, { Document, Schema, Model } from "mongoose";
import { IRoom } from "../Room";
export interface IFile extends Document {
    room: IRoom["_id"];
    fileName: String;
    content: String;
    createdAt: Date;
    updatedAt: Date;
}

const FileSchema: Schema<IFile> = new Schema(
    {
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const FileModel: Model<IFile> = mongoose.model<IFile>("File", FileSchema);

export default FileModel;
