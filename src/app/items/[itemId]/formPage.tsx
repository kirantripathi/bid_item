"use client";

import React, { FormEvent, useState } from "react";
import { createBidAction } from "@/app/items/[itemId]/actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const FormPage = ({ itemId }: { itemId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const startNewBid = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await createBidAction(itemId);
    setLoading(false);
  };

  return (
    <form onSubmit={(e) => startNewBid(e)}>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 size={16} className="animate-spin" />}
        Place a Bid
      </Button>
    </form>
  );
};

export default FormPage;
