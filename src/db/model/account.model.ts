import { Schema, models, model } from "mongoose";

const AccountSchema = new Schema({
  userId: {
    type: String,
    ref: "user",
  },
  provider: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  providerAccountId: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
  },
  access_token: {
    type: String,
  },
  expires_at: {
    type: Number,
  },
  token_type: {
    type: String,
  },
  scope: {
    type: String,
  },
  id_token: {
    type: String,
  },
  session_state: {
    type: String,
  },
});

// Create a compound index to ensure uniqueness of provider and providerAccountId
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account = models.account || model("account", AccountSchema);

export default Account;
