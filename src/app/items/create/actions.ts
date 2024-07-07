"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { insertItem } from "@/data-access/items";
import { POST } from "@/app/api/send/route";

export const maxDuration = 60;

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

  try {
    let savedItemResponse = await insertItem({
      name,
      startingPrice,
      fileName,
      user,
      endDate,
    });

    console.log(savedItemResponse, "See the response plz");

    if (savedItemResponse?.status == 200) {
      //send email once product is added to db
      await fetch("https://bid-item.vercel.app/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          userName: session?.user?.name ?? "User",
        }),
      });
    }
  } catch (err) {
    console.log(err, "see error while calling api");
  }
  redirect("/");
}
