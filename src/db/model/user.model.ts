import { Schema, models, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new Schema({
  id: {
    type: String,
    default: uuidv4(),
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  image: {
    type: String,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
