import mongoose, { Schema, Document } from "mongoose";

export type IUser = {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  rememberMe: boolean;
};

const UserSchema: Schema<IUser> = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    rememberMe: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
