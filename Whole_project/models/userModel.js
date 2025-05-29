
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = model("User", UserSchema);

export default UserModel; // Use export default