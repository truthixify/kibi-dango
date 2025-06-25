import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", userSchema);
export default User;
