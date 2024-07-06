import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MONGODB_URI: z.string().url(),
    NODE_ENV: z.string().min(1),
    KNOCK_SECRET_KEY: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    FACEBOOK_CLIENT_SECRET: z.string().min(1),
    FACEBOOK_CLIENT_ID: z.string().min(1),
   
  },
  client: {
    NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY: z.string().min(1),
    NEXT_PUBLIC_KNOCK_FEED_ID: z.string().min(1),
    //for cloudinary image
    NEXT_PUBLIC_CLOUD_KEY: z.string().min(1),
    NEXT_PUBLIC_CLOUD_SECRET: z.string().min(1),
    NEXT_PUBLIC_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_CLOUD_ENV_VARIABLE: z.string().min(1),
    NEXT_PUBLIC_UPLOAD_PRESET_NAME: z.string().min(1),
  },

  runtimeEnv: {
 
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY,
    NEXT_PUBLIC_KNOCK_FEED_ID: process.env.NEXT_PUBLIC_KNOCK_FEED_ID,
    KNOCK_SECRET_KEY: process.env.KNOCK_SECRET_KEY,
    //cloudinary key
    NEXT_PUBLIC_CLOUD_KEY: process.env.NEXT_PUBLIC_CLOUD_KEY,
    NEXT_PUBLIC_CLOUD_SECRET: process.env.NEXT_PUBLIC_CLOUD_SECRET,
    NEXT_PUBLIC_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUD_NAME,
    NEXT_PUBLIC_CLOUD_ENV_VARIABLE: process.env.NEXT_PUBLIC_CLOUD_ENV_VARIABLE,
    NEXT_PUBLIC_UPLOAD_PRESET_NAME: process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME,
  },
});
