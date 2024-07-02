import { Schema, models, model } from "mongoose";

// Define the schema
const SessionSchema = new Schema({
  sessionToken: {
    type: String,
    required: true,
    unique: true, // Assuming sessionToken is unique
  },
  userId: {
    type: String,
    required: true,
    ref: "user", // Assuming 'User' is the Mongoose model for users collection
    index: true,
    // onDelete: 'cascade' is not directly supported in MongoDB/Mongoose,
    // you may need to handle cascading delete in application logic or use middleware
  },
  expires: {
    type: Date,
    required: true,
  },
});

// Create the Mongoose model
const Session = models.Session || model("Session", SessionSchema);

const VerificationTokenSchema = new Schema({
  identifier: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

// Define compound primary key
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

// Create the Mongoose model
const VerificationToken =
  models.VerificationToken ||
  model("VerificationToken", VerificationTokenSchema);

  export { Session, VerificationToken };
