import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  name: {
    fname: string;
    mname?: string;
    lname?: string;
  };
  email: string;
  password: string;
  role: string;
  verified: boolean;
  deleted: boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      fname: {
        type: String,
        required: true,
      },
      mname: {
        type: String,
        required: false,
      },
      lname: {
        type: String,
        required: false,
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
