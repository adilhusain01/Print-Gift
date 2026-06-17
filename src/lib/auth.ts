import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/printngift";
const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB || "printngift");

export const auth = betterAuth({
  appName: "Print&Gift CMS",
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const allowedEmail = process.env.ADMIN_EMAIL;
          if (allowedEmail && user.email.toLowerCase() !== allowedEmail.toLowerCase()) {
            throw new Error("Merchant account registration is restricted.");
          }
          return { data: user };
        },
      },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://printngift.store",
    "https://www.printngift.store",
  ],
});
