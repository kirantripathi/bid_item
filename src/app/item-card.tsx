import { Button } from "@/components/ui/button";
import { ItemDoc } from "@/db/model/items.model";
import { isBidOver } from "@/util/bids";
import { formatToDollar } from "@/util/currency";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export function ItemCard({
  item,
  myAuction,
}: {
  item: ItemDoc;
  myAuction?: boolean;
}) {
  console.log(item, "ee the val");

  return (
    <div className="border  p-8  rounded-xl space-y-2 shadow-md">
      <div className="w-[200px] h-[200px]  flex self-center">
        <Image
          style={{ objectFit: "contain" }}
          src={item.fileKey !== "undefined" ? item.fileKey : "/logo.png"}
          alt={item.name}
          width={200}
          height={200}
        />
      </div>

      <h2 className="text-xl font-bold truncate">{item.name.toUpperCase()}</h2>
      <p className="text-lg">
        <span className="font-bold">Starting Price:</span> $
        {formatToDollar(item.startingPrice)}
      </p>

      <p className="text-lg">
        <span className="font-bold">Current Price:</span> $
        {formatToDollar(item.currentBid)}
      </p>

      {isBidOver(item) ? (
        <p className="text-lg">Bidding is Over</p>
      ) : (
        <p className="text-lg ">
          <span className="font-bold">Ends On:</span>
          {format(item.endDate, "eee M/dd/yy")}
        </p>
      )}

      <div className=" flex  mx-12 ">
        <Button
          className=""
          asChild
          variant={isBidOver(item) ? "outline" : "default"}
        >
          <Link href={`/items/${item._id}`}>
            {myAuction || isBidOver(item) ? "View Bid" : "Place Bid"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
