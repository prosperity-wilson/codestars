import { describe, expect, it } from "vitest";
import { getCategory, resolveAdminAccess } from "@/lib/admin/categories";

describe("admin access", () => {
  it("sends signed-out visitors to the login page", () => {
    expect(resolveAdminAccess(false, false)).toBe("login");
  });
  it("rejects signed-in users without the admin role", () => {
    expect(resolveAdminAccess(true, false)).toBe("denied");
  });
  it("lets admins in", () => {
    expect(resolveAdminAccess(true, true)).toBe("ok");
  });
});

describe("status options", () => {
  it("financial aid uses only the database aid statuses", () => {
    expect(getCategory("financial-aid")?.statuses).toEqual(["submitted", "under_review", "approved", "partially_approved", "declined"]);
  });
});
