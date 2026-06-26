import { getSessionFromCookies } from "@/lib/auth/session";
import type { SessionPayload } from "@/types/auth";

export type GraphQLContext = {
  user: SessionPayload | null;
};

export async function buildContext(): Promise<GraphQLContext> {
  try {
    const user = await getSessionFromCookies();
    return { user };
  } catch {
    return { user: null };
  }
}
