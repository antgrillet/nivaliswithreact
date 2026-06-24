import "server-only";
import { auth } from "@/lib/auth";

/** Retourne l'utilisateur de session, ou null. À utiliser dans les routes API. */
export async function getSessionUser(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  return session?.user ?? null;
}
