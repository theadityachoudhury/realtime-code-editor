import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "../Users";

export interface IEmailLog extends Document {
  userId: IUser["_id"];
  to: string[];
  subject: string;
  body: string;
  status: string;
  type: string;
  messageId: string;
}

const EmailLogSchema: Schema<IEmailLog> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: [String],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    messageId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EmailLogModel: Model<IEmailLog> = mongoose.model<IEmailLog>("EmailLog", EmailLogSchema);

export default EmailLogModel;
