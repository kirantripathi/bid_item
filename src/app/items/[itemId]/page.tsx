import { createBidAction } from "@/app/items/[itemId]/actions";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBidsForItem } from "@/data-access/bids";
import { getItem } from "@/data-access/items";
import { pageTitleStyles } from "@/styles";
import { isBidOver } from "@/util/bids";
import { formatToDollar } from "@/util/currency";
import { formatDistance } from "date-fns";
import Image from "next/image";
import Link from "next/link";

function formatTimestamp(timestamp: Date) {
  return formatDistance(timestamp, new Date(), { addSuffix: true });
}

export default async function ItemPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const session = await auth();

  const item = await getItem(itemId);

  if (!item) {
    return (
      <div className="space-y-8 flex flex-col items-center mt-12">
        <Image src="/package.svg" width="200" height="200" alt="Package" />

        <h1 className={pageTitleStyles}>Item not found</h1>
        <p className="text-center">
          The item you&apos;re trying to view is invalid.
          <br />
          Please go back and search for a different auction item.
        </p>

        <Button asChild>
          <Link href={`/`}>View Auctions</Link>
        </Button>
      </div>
    );
  }

  const allBids = await getBidsForItem(item._id);

  console.log(allBids, "See all bids first");

  const hasBids = allBids.length > 0;

  const canPlaceBid =
    session && item.userId !== session.user.id && !isBidOver(item);

  return (
    <main className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-6  items-center">
          <h1 className={pageTitleStyles}>
            <span className="font-normal">Auction for</span> {item.name}
          </h1>
          {isBidOver(item) && (
            <Badge className="w-fit" variant="destructive">
              Bidding Over
            </Badge>
          )}

          {item.fileKey !== "undefined" && (
            <Image
              className="rounded-xl"
              src={item.fileKey}
              alt={item.name}
              width={400}
              height={400}
            />
          )}
          <div className="text-xl space-y-4">
            <h2 className="font-bold">
              Current Bid :
              <span className="font-normal">
                ${formatToDollar(item.currentBid)}
              </span>
            </h2>
            <h2 className="font-bold">
              Starting Price of :
              <span className="font-normal">
                ${formatToDollar(item.startingPrice)}
              </span>
            </h2>
            <h2 className="font-bold">
              Bid Interval :
              <span className="font-normal">
                ${formatToDollar(item.bidInterval)}
              </span>
            </h2>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Current Bids</h2>
            {canPlaceBid && (
              <form action={createBidAction.bind(null, item._id)}>
                <Button>Place a Bid</Button>
              </form>
            )}
          </div>

          {hasBids ? (
            <ul className="space-y-4 overflow-y-scroll  max-h-[70vh] no-scrollbar">
              {allBids.map((bid) => (
                <li key={bid._id} className="bg-gray-100 rounded-xl p-8">
                  <div className="flex gap-4">
                    <div>
                      <span className="font-bold">
                        ${formatToDollar(bid.amount)}
                      </span>{" "}
                      by{" "}
                      <span className="font-bold">
                        {bid?.userId?.name ?? "Anonymous"}
                      </span>
                    </div>
                    <div className="">{formatTimestamp(bid.timestamp)}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-8 bg-gray-100 rounded-xl p-12">
              <Image
                src="/package.svg"
                width="200"
                height="200"
                alt="Package"
              />
              <h2 className="text-2xl font-bold">No bids yet</h2>
              {canPlaceBid && (
                <form action={createBidAction.bind(null, item._id)}>
                  <Button>Place a Bid</Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
