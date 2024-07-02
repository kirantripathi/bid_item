"use client";

import "@knocklabs/react/dist/index.css";
import { env } from "@/env";
import { KnockProvider, KnockFeedProvider } from "@knocklabs/react";
import { useSession } from "next-auth/react";

import { ReactNode } from "react";

export function AppKnockProviders({ children }: { children: ReactNode }) {
  const { data: session,status } = useSession();


console.log(session,"see the session data now in client")

  if (status === "loading") {
    return <p>Loading...</p>; // Optional: Show a loading indicator while session is being fetched
  }

 
  return (
    <KnockProvider
      apiKey={env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
      userId={session?.user?.id ?? ""}
    >
      <KnockFeedProvider feedId={env.NEXT_PUBLIC_KNOCK_FEED_ID}>
        {children}
      </KnockFeedProvider>
    </KnockProvider>
  );
}
