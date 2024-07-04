import { Schema, models, model } from "mongoose";

const FeedBackSchema = new Schema({
  feedBack: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create the Mongoose model
const FeedBack = models.FeedBack || model("FeedBack", FeedBackSchema);

export default FeedBack;
