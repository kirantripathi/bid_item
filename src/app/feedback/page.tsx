"use client";

import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { createFeedBackAction } from "./action";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className=" flex justify-center ">
      <form
        ref={ref}
        onSubmit={async (e) => {
          e.preventDefault();

          const form = e.currentTarget as HTMLFormElement;
          const formData = new FormData(form);
          const feedBack = formData.get("feedback") as string;

          if (!feedBack) {
            return;
          }

          setLoading(true);
          let response = await createFeedBackAction({ feedBack });

          if (response && response?.status == 500) {
            alert("some error occires");
          } else {
            //clear input only if success submission
            ref.current?.reset();
          }

          setLoading(false);
        }}
        className=" flex flex-col items-center w-full"
      >
        <label className="text-xl font-bold" htmlFor="feedback">
          Do you have any suggestion to make our Website better ?
        </label>
        <Textarea
          id="feedback"
          required
          className="mt-5 h-[40vh] text-lg border-2 border-black"
          name="feedback"
          placeholder="Add Your Feedback"
        />

        <Button disabled={loading} className="mt-10 w-[200px]" type="submit">
          {loading && <Loader2 size={16} className="animate-spin" />}
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Page;
