import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { username, admin } from "better-auth/plugins";
import { pool } from "@/lib/db";

export const auth = betterAuth({
  database: pool,
  // Optionnel : fiabilise les callbacks/redirections. Sur Vercel, définir
  // BETTER_AUTH_URL = https://<domaine>. Sinon, Better Auth déduit des headers.
  baseURL: process.env.BETTER_AUTH_URL,
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
    // Gestion multi-accès : un admin peut créer/lister/supprimer des comptes
    // depuis le back-office, même avec le signup public fermé.
    admin({
      defaultRole: "admin",
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],
});
