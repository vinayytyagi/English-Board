export const AUTH_COOKIE = "eb_auth";
export const AUTH_VALUE = "ok";

export function checkPassword(input: string): boolean {
  const expected = process.env.APP_PASSWORD ?? "vinay";
  return input === expected;
}
