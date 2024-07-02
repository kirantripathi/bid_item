import { Schema, models, model, InferSchemaType } from "mongoose";

const BidSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

type BidType = InferSchemaType<typeof BidSchema>;

export type { BidType };

// Create the Mongoose model
const Bid = models.Bid || model("Bid", BidSchema);

export default Bid;
