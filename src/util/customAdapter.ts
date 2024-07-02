import mongoose, { Mongoose, Model } from "mongoose";
import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken as AdapterVerificationToken,
} from "next-auth/adapters";
import type { Account as AdapterAccount } from "next-auth";

import User from "../db/model/user.model";
import { Session } from "../db/model/session.model";
import { VerificationToken } from "../db/model/session.model"; // Assuming it's in the same file as Session
import Account from "../db/model/account.model";

interface MongooseAdapterModels {
  user?: Model<AdapterUser>;
  session?: Model<AdapterSession>;
  account?: Model<any>;
  verificationToken?: Model<AdapterVerificationToken>;
}

const MongooseAdapter = (
  connectToDatabase: () => Promise<Mongoose>,
  models?: MongooseAdapterModels
): Adapter => {
  models = models || {};
  // console.log(models, "see all the val in models");
  // Load Backup Models
  if (!models?.user) {
    // console.log("No USER model found, loading...");
    models.user = mongoose.model<AdapterUser>("User", User.schema);
  }

  if (!models?.session) {
    // console.log("No SESSION model found, loading...");
    models.session = mongoose.model<AdapterSession>("Session", Session.schema);
  }

  if (!models?.verificationToken) {
    // console.log("No VerificationToken model found, loading...");
    models.verificationToken = mongoose.model<AdapterVerificationToken>(
      "VerificationToken",
      VerificationToken.schema
    );
  }

  if (!models.account) {
    // console.log("No ACCOUNT model found, loading...");
    models.account = mongoose.model<any>("Account", Account.schema);
  }

  // Methods
  const adaptorMethods: Adapter = {
    // These methods are required for all sign in flows:
    async createUser(data) {
      // console.log("createUser: ", data);
      await connectToDatabase();
      const user = await User.create(data);
      return user;
    },

    async getUser(id) {
      // console.log("getUser: ", id);
      await connectToDatabase();
      const user = await User.findOne({ id });
      // console.log("getUser user: ", user);
      return user;
    },

    async getUserByEmail(email) {
      // console.log("getUserByEmail: ", email);

      await connectToDatabase();
      const user = await User.findOne({ email });
      return user;
    },
    async getUserByAccount(data) {
      // console.log("getUserByAccount: ", data);
      const { providerAccountId, provider } = data;
      await connectToDatabase();

      // Get Account
      const account = await Account.findOne({ providerAccountId, provider });
      if (!account || !account.userId) return null;

      if (!adaptorMethods || typeof adaptorMethods.getUser !== "function") {
        console.error(
          "adaptorMethods.getUser is not defined or not a function"
        );
        return null;
      }

      // Find User
      const user = await adaptorMethods.getUser(account.userId);
      return user;
    },
    async updateUser(data) {
      // console.log("updateUser: ", data);
      const { id, ...restData } = data;
      await connectToDatabase();
      const user = await User.findByIdAndUpdate(id, restData, {
        new: true,
        runValidators: true,
        returnDocument: "after",
      });

      return user!;
    },
    async deleteUser(userId) {
      // console.log("deleteUser: ", userId);

      await connectToDatabase();
      const user = await User.findByIdAndDelete(userId);
      return user;
    },
    async linkAccount(data: AdapterAccount): Promise<void> {
      // console.log("linkAccount: ", data);

      await connectToDatabase();
      await Account.create(data);
      // No return statement needed here, or you can explicitly return undefined
    },
    async unlinkAccount(
      data: Pick<AdapterAccount, "provider" | "providerAccountId">
    ): Promise<void> {
      console.log("unlinkAccount: ", data);
      const { providerAccountId, provider } = data;
      await connectToDatabase();

      const account = await Account.findOneAndDelete({
        providerAccountId,
        provider,
      });

      // No need to return account if found, only return if you want to handle the deleted account
      // Ensure the function returns void if not explicitly returning any other value
      return;
    },

    async createSession(data) {
      // console.log("createSession: ", data);

      await connectToDatabase();
      const session = await Session.create(data);
      console.log(session, "see created session");
      return session;
    },
    async getSessionAndUser(sessionToken) {
      // console.log("getSessionAndUser: ", sessionToken);
      await connectToDatabase();

      // Get Session
      const session = await Session.findOne({ sessionToken });

      // console.log(session,"see all the info first")

      if (
        !session ||
        !adaptorMethods ||
        typeof adaptorMethods.getUser !== "function"
      ) {
        console.error(
          "adaptorMethods.getUser is not defined or not a function"
        );
        return null;
      }

      // Find User
      const user = await adaptorMethods.getUser(session.userId);
      if (!user) return null;

      return { user, session };
    },
    async updateSession(data) {
      // console.log("updateSession: ", data);
      const { userId, ...restData } = data;
      await connectToDatabase();
      const session = await Session.findByIdAndUpdate(userId, restData, {
        new: true,
        runValidators: true,
      });
      return session;
    },
    async deleteSession(sessionToken) {
      // console.log("deleteSession: ", sessionToken);
      await connectToDatabase();
      const session = await Session.findOneAndDelete({ sessionToken });
      return session;
    },
  };

  return adaptorMethods;
};

export default MongooseAdapter;
