"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { insertItem } from "@/data-access/items";

export async function createItemAction({
  fileName,
  name,
  startingPrice,
  endDate,
}: {
  fileName: string;
  name: string;
  startingPrice: number;
  endDate: Date;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = session.user;

  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  await insertItem({
    name,
    startingPrice,
    fileName,
    user,
    endDate,
  });

  redirect("/");
}
