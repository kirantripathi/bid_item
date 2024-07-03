import { ItemCard } from "@/app/item-card";
import { getAlAuctionItem } from "@/data-access/items";
import { EmptyState } from "./auctions/empty-state";

export default async function HomePage() {
  // const allItems = await database.query.items.findMany();

  const allItems = await getAlAuctionItem();
  console.log(allItems, "See the item plz");
  return (
    <main className="space-y-8 flex flex-col ">
      <h1 className="text-4xl font-bold">Items For Sale</h1>

      {allItems.length > 0 ? (
        <div className="grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allItems.map((item: any,index:number) => (
            <ItemCard key={index} item={item} />
          ))}
        </div>
      ) : (
        <div className="h-[80vh] flex items-center justify-center">
          <div className="self-center">
            <EmptyState />
          </div>
        </div>
      )}
    </main>
  );
}
