// import { Item } from "@/db/schema";

import { Item, ItemType } from "@/db/model/items.model";
export function isBidOver(item: ItemType) {
  return item.endDate < new Date();
}
