import { Types } from "mongoose";
import { connectToDatabase } from "@/db/index";
import { Item } from "@/db/model/items.model";
import { User } from "next-auth";
import FeedBack from "@/db/model/feedback.model";

export async function getAlAuctionItem() {
  try {
    await connectToDatabase();

    const allItems = await Item.find({});
    return JSON.parse(JSON.stringify(allItems));
  } catch (error) {
    console.log(error, "error in getting all user auction otem");
  }
}

export async function getAlUserAuctionItem(userId: string) {
  try {
    await connectToDatabase();

    const allItems = await Item.find({ userId });
    return JSON.parse(JSON.stringify(allItems));
  } catch (error) {
    console.log(error, "error in getting all user auction otem");
  }
}

export async function getItem(itemId: string) {
  try {
    await connectToDatabase();

    const item = await Item.findOne({ _id: itemId });
    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    console.log(error, "See in get item");
  }
}

export async function insertItem({
  name,
  startingPrice,
  fileName,
  user,
  endDate,
}: {
  name: string;
  startingPrice: number;
  fileName: String;
  endDate: Date;
  user: User;
}) {
  try {
    await connectToDatabase();

    const newItem = new Item({
      name: name,
      startingPrice: startingPrice,
      fileKey: fileName,
      currentBid: startingPrice, // Assuming currentBid starts with the same value as startingPrice
      userId: user.id,
      endDate: endDate,
    });
    const savedItem = await newItem.save();

    return savedItem;
  } catch (error) {
    console.log(error, "error creating item");
  }
}

export async function updateItem({
  itemId,
  latestBidValue,
}: {
  itemId: string;
  latestBidValue: number;
}) {
  try {
    await connectToDatabase();

    const itemObjectId = Types.ObjectId.createFromHexString(itemId.toString());

    await Item.findOneAndUpdate(
      {
        _id: itemObjectId,
      },
      {
        currentBid: latestBidValue,
      }
    );
  } catch (error) {
    console.log(error, "error updating item");
  }
}

export async function insertFeedBack({
  feedBack,
  user,
}: {
  feedBack: string;
  user: User;
}) {
  try {
    await connectToDatabase();

    console.log(user, feedBack, "see got info");
    const newItem = new FeedBack({
      feedBack,
      userId: user.id,
    });

    const savedItem = await newItem.save();

    let response = {
      status: 200,
      data: savedItem,
    };

    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    const response = {
      status: 500,
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred",
    };

    return JSON.parse(JSON.stringify(response));
  }
}
