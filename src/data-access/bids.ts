import { connectToDatabase } from "@/db/index";
import mongoose, { Types } from "mongoose";
import Bid, { BidType } from "@/db/model/bids.model";

export async function getBidsForItem(itemId: string) {
  try {
    await connectToDatabase();

    const itemObjectId = mongoose.Types.ObjectId.isValid(itemId)
      ? new mongoose.Types.ObjectId(itemId)
      : itemId;

    const allBids = await Bid.find({
      itemId: new mongoose.Types.ObjectId(itemObjectId),
    })
      .sort({ _id: -1 })
      .populate({
        path: "userId",
        model: "User",
        select: "name image email", // Specify which fields from the User model to include
      })
      .populate({
        path: "itemId",
        model: "Item",
        select: "name userId", // Specify which fields from the User model to include
      })
      .exec();

    return JSON.parse(JSON.stringify(allBids));
  } catch (error) {
    console.log(error);
  }
}

export async function insertBidsForItem({
  latestBidValue,
  itemId,
  userId,
}: {
  latestBidValue: number;
  itemId: string;
  userId: string;
}) {
  try {
    await connectToDatabase();
    console.log(itemId, "See the irem id");
    console.log(userId, "See the user id too");
    let newBid = await new Bid({
      amount: latestBidValue,
      itemId: new mongoose.Types.ObjectId(itemId),
      userId: new mongoose.Types.ObjectId(userId),
      timestamp: new Date(),
    });
    newBid.save();
  } catch (error) {
    console.log(error, "error while inserting bid");
  }
}
