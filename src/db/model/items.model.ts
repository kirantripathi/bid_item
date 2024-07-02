import { Schema, InferSchemaType, models, model, Document } from "mongoose";

const ItemSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "user", // Assuming 'User' is the Mongoose model for users collection
  },
  name: {
    type: String,
    required: true,
  },
  fileKey: {
    type: String,
    required: true,
  },
  currentBid: {
    type: Number,
    required: true,
    default: 0,
  },
  startingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  bidInterval: {
    type: Number,
    required: true,
    default: 100,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

// Create the Mongoose model
const Item = models.Item || model("Item", ItemSchema);

type ItemType = InferSchemaType<typeof ItemSchema>;

interface ItemDoc extends Document {
  userId: string;
  name: string;
  fileKey: string;
  currentBid: number;
  startingPrice: number;
  bidInterval: number;
  endDate: Date;
}

export type { ItemType,ItemDoc };
export { Item };
