import { EmptyState } from "@/app/auctions/empty-state";
import { ItemCard } from "@/app/item-card";
import { auth } from "@/auth";
import { getAlUserAuctionItem } from "@/data-access/items";

import { ItemType } from "@/db/model/items.model";

import { pageTitleStyles } from "@/styles";


export default async function MyAuctionPage() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // const allItems = await database.query.items.findMany({
  //   where: eq(items.userId, session.user.id!),
  // });
  const allItems = await getAlUserAuctionItem(session.user.id!);

  const hasItems = allItems.length > 0;

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>Your Current Auctions</h1>

      {hasItems ? (
        <div className="grid grid-cols-4 gap-8">
          {allItems.map((item: any, index: number) => (
            <ItemCard key={index} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
