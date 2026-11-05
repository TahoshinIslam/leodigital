import "server-only";
import bcrypt from "bcryptjs";

const COST = 12;
// Pre-computed hash used when the email doesn't exist, so a login attempt for
// an unknown account takes as long as one for a real account (no user enumeration by timing).
const DUMMY_HASH = "$2b$12$w7/2E8v8VFAaAB3AJQMe9.KO9tHqArL6t6qfjv3H2UezVZd//PeRO";

export const hashPassword = (plain: string) => bcrypt.hash(plain, COST);

export async function verifyPassword(plain: string, hash: string | null): Promise<boolean> {
  const ok = await bcrypt.compare(plain, hash ?? DUMMY_HASH);
  return hash !== null && ok;
}
