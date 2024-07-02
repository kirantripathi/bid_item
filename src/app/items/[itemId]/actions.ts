"use server";

import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { Knock } from "@knocklabs/node";
import { env } from "@/env";
import { isBidOver } from "@/util/bids";
import { getItem, updateItem } from "@/data-access/items";
import { getBidsForItem, insertBidsForItem } from "@/data-access/bids";

const knock = new Knock(env.KNOCK_SECRET_KEY);

export async function createBidAction(itemId: string) {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("You must be logged in to place a bid");
  }

  const item = await getItem(itemId);

  if (!item) {
    throw new Error("Item not found here");
  }

  if (isBidOver(item)) {
    throw new Error("This auction is already over");
  }

  const latestBidValue = item.currentBid + item.bidInterval;

  await insertBidsForItem({
    latestBidValue,
    itemId,
    userId,
  });

  await updateItem({
    itemId,
    latestBidValue,
  });

  //these are all for notification

  const currentBids = await getBidsForItem(itemId);

  const recipients: {
    id: string;
    name: string;
    email: string;
  }[] = [];

  console.log(currentBids, "See all current bidI");

  let itemOwnerInfo = currentBids && currentBids.length > 0 && currentBids[0];

  if (
    itemOwnerInfo &&
    !recipients.find(
      (recipient) => recipient.id === itemOwnerInfo.itemId.userId
    )
  ) {
    recipients.push({
      id: itemOwnerInfo.itemId.userId + "",
      name: "Product_Owner",
      email: "",
    });
  }

  for (const bid of currentBids) {
    if (
      bid.userId &&
      bid.userId._id !== userId &&
      !recipients.find((recipient) => recipient.id === bid.userId._id)
    ) {
      recipients.push({
        id: bid.userId._id + "",
        name: "Product Onwer",
        email: bid.userId.email,
      });
    }
  }

  console.log(recipients, "See the recipient info");

  if (recipients.length > 0) {
    console.log("knock called");
    await knock.workflows.trigger("trigger-updateauction", {
      actor: {
        id: userId,
        name: session.user.name ?? "Anonymous",
        email: session.user.email,
        collection: "users",
      },
      recipients,
      // data: {
      //   itemId,
      //   bidAmount: latestBidValue,
      //   itemName: item.name,
      // },
      data: {
        bidUpdate: {
          itemId,
          amount: latestBidValue,
          itemName: item.name,
        },
      },
    });
  }

  revalidatePath(`/items/${itemId}`);
}
