import { createAuthClient } from "better-auth/client";
import { usernameClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
  plugins: [usernameClient(), adminClient()],
});
