import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("NextGear");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        minPasswordLength: 6,
        maxPasswordLength: 18,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    user: {
        additionalFields: {
            userRole: {
                type: ["customer", "owner", "admin"],
                input: false,
                defaultValue: "customer",
                required: true,
            }
        }
    },
    database: mongodbAdapter(db, {
        client,
    }),
});
