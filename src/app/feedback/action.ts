"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { insertFeedBack } from "@/data-access/items";

export async function createFeedBackAction({ feedBack }: { feedBack: string }) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = session.user;

  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  let response = await insertFeedBack({
    feedBack,
    user,
  });

  return response;

  //   redirect("/");
}
