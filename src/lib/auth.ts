import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { pool } from "@/lib/db";

export const auth = betterAuth({
  database: pool,
  disabledPaths: ["/sign-in/email"],
  emailAndPassword: {
    enabled: true,
    disableSignUp: process.env.DISABLE_SIGNUP === "true",
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 32,
    }),
    nextCookies(),
  ],
});
