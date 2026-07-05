import { describe, it, expect, afterEach } from "vitest";
import { checkPassword, AUTH_COOKIE, AUTH_VALUE } from "./auth";

afterEach(() => { delete process.env.APP_PASSWORD; });

describe("checkPassword", () => {
  it("accepts the default password 'vinay' when env unset", () => {
    expect(checkPassword("vinay")).toBe(true);
  });
  it("rejects a wrong password", () => {
    expect(checkPassword("nope")).toBe(false);
  });
  it("uses APP_PASSWORD when set", () => {
    process.env.APP_PASSWORD = "secret1";
    expect(checkPassword("secret1")).toBe(true);
    expect(checkPassword("vinay")).toBe(false);
  });
  it("exposes stable cookie name and value", () => {
    expect(AUTH_COOKIE).toBe("eb_auth");
    expect(AUTH_VALUE).toBe("ok");
  });
});
