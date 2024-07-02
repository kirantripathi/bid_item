import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { env } from "@/env";
import { Adapter } from "next-auth/adapters";
import { connectToDatabase } from "./db";
import MongooseAdapter from "./util/customAdapter";
import { Types } from "mongoose";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      _id: Types.ObjectId;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: env.AUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
  ],

  //adapter help to connect our mongodb db to the user oauth option and it give us table like users , session, account
  // adapter: MongoDBAdapter(clientPromise, {
  //   databaseName: "auction",
  // }) as Adapter,

  adapter: MongooseAdapter(connectToDatabase) as Adapter,

  callbacks: {
    session({ session, user }) {
      console.log(session, "see it");
      console.log(user, "see too");
      // @ts-ignore
      session.user.id = user?._id;

      return session;
    },
  },
});
