"use client";

import { createItemAction } from "@/app/items/create/actions";
import { DatePickerDemo } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageTitleStyles } from "@/styles";
import { getCloudinaryImageUrl } from "@/util/getCloudinaryUrl";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function CreatePage() {
  const [date, setDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <main className="space-y-8 flex items-center flex-col ">
      <h1 className={pageTitleStyles}>Post Item For Auction</h1>

      <form
        className="flex flex-col border p-8 rounded-xl space-y-4 w-[80vw] xl:w-[50vw] items-center bg-gray-200 dark:bg-black"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!date) {
            return;
          }
          setLoading(true);

          const form = e.currentTarget as HTMLFormElement;

          const formData = new FormData(form);
          const file = formData.get("file") as File;

          const secure_url = await getCloudinaryImageUrl(file);

          if (secure_url == "error") {
            alert("error uploading image.Please try again");
          }

          formData.set("file", secure_url);
          const name = formData.get("name") as string;
          const startingPrice = parseInt(
            formData.get("startingPrice") as string
          );
          const startingPriceInCents = Math.floor(startingPrice * 100);
          const fileName = formData.get("file") as string;

          await createItemAction({
            name,
            startingPrice: startingPriceInCents,
            fileName,
            endDate: date,
          });
        }}
      >
        <label htmlFor="name" className="max-w-lg font-bold">
          Name your item
        </label>
        <Input id="name" required className="max-w-lg" name="name" />

        <label htmlFor="startingPrice" className="max-w-lg font-bold">
          What to start your auction at
        </label>
        <Input
          id="startingPrice"
          required
          className="max-w-lg"
          name="startingPrice"
          type="number"
        />
        <label className="font-bold" htmlFor="file">
          Upload an image of your item
        </label>
        <Input className="max-w-lg" id="file" type="file" name="file"></Input>

        <label className="font-bold" htmlFor="date">
          Pick a Date
        </label>
        <DatePickerDemo id="date" date={date} setDate={setDate} />
        <Button
          disabled={loading}
          className="self-center bg-green-500"
          type="submit"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Post Item
        </Button>
      </form>
    </main>
  );
}
