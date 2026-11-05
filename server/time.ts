import "server-only";

/** Request time for server-rendered relative dates ("5 minutes ago"). */
export function requestNow(): number {
  return Date.now();
}
