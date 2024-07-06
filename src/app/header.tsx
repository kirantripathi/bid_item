"use client";

import { ModeToggle } from "@/components/ThemToggleButton";
import { Button } from "@/components/ui/button";
import { formatToDollar } from "@/util/currency";
import {
  NotificationCell,
  NotificationFeedPopover,
  NotificationIconButton,
} from "@knocklabs/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const session = useSession();

  const userId = session?.data?.user?.id;

  return (
    <div className="bg-gray-200 dark:bg-black py-2">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <Image src="/logo.png" width="50" height="50" alt="Logo" />
            CheapBid.com
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:underline flex items-center gap-1">
              All Auctions
            </Link>

            {userId && (
              <>
                <Link
                  href="/items/create"
                  className="hover:underline flex items-center gap-1"
                >
                  Create Auction
                </Link>

                <Link
                  href="/auctions"
                  className="hover:underline flex items-center gap-1"
                >
                  My Auctions
                </Link>

                <Link
                  href="/feedback"
                  className="hover:underline flex items-center gap-1"
                >
                  FeedBack
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {userId && (
            <>
              <NotificationIconButton
                ref={notifButtonRef}
                onClick={(e) => setIsVisible(!isVisible)}
              />
              <NotificationFeedPopover
                buttonRef={notifButtonRef}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                renderItem={({ item, ...props }) => {
                  return (
                    <NotificationCell {...props} item={item}>
                      <div className="rounded-xl">
                        <Link
                          className="text-blue-400 hover:text=blue-500"
                          onClick={() => {
                            setIsVisible(false);
                          }}
                          href={`/items/${item?.data?.bidUpdate.itemId}`}
                        >
                          Someone outbidded you on{" "}
                          <span className="font-bold">
                            {item?.data?.bidUpdate.itemName}
                          </span>{" "}
                          by ${formatToDollar(item?.data?.bidUpdate?.amount)}
                        </Link>
                      </div>
                    </NotificationCell>
                  );
                }}
              />
            </>
          )}

          {session?.data?.user?.image && (
            <Image
              src={session.data.user.image}
              width="40"
              height="40"
              alt="user avatar"
              className="rounded-full"
            />
          )}
          <div>{session?.data?.user?.name}</div>

          <ModeToggle />

          <div>
            {userId ? (
              <Button
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
              >
                Sign Out
              </Button>
            ) : (
              <Button type="submit" onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
