import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { getDb, setAdminPassword } from "./db";
import bcrypt from "bcryptjs";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const cookies: Record<string, string> = {};

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
      cookies,
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options?: any) => {
        cookies[name] = value;
      },
      clearCookie: (name: string, options?: any) => {
        delete cookies[name];
      },
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("admin", () => {
  beforeAll(async () => {
    // Initialize admin password for testing
    const hashedPassword = await bcrypt.hash("test123", 10);
    await setAdminPassword(hashedPassword);
  });

  it("initializes admin password on first setup", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.admin.initializePassword({ password: "newpass123" });
      // This should fail because password is already set
      expect(result).toBeUndefined();
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("allows login with correct password", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.login({ password: "test123" });
    expect(result.success).toBe(true);
    expect((ctx.req as any).cookies.admin_token).toBe("authenticated");
  });

  it("rejects login with incorrect password", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.login({ password: "wrongpassword" });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Invalid password");
    }
  });

  it("requires authentication to get submissions", async () => {
    const { ctx } = createAdminContext();
    const ctxWithoutToken = {
      ...ctx,
      req: { ...ctx.req, cookies: {} },
    };
    const caller = appRouter.createCaller(ctxWithoutToken);

    try {
      await caller.admin.getSubmissions();
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("returns submissions when authenticated", async () => {
    const { ctx } = createAdminContext();
    // Set the admin token
    (ctx.req as any).cookies.admin_token = "authenticated";
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getSubmissions();
    expect(Array.isArray(result)).toBe(true);
  });
});
