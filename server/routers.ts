import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContactSubmission, getAllContactSubmissions, getAdminCredentials, setAdminPassword } from "./db";
import { notifyOwner } from "./_core/notification";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email"),
          company: z.string().optional(),
          message: z.string().min(1, "Message is required"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await createContactSubmission({
            name: input.name,
            email: input.email,
            company: input.company || null,
            message: input.message,
          });

          await notifyOwner({
            title: "New Contact Form Submission from Bridgia",
            content: `New inquiry from ${input.name} (${input.email})${input.company ? ` at ${input.company}` : ""}\n\nMessage: ${input.message}`,
          });

          return { success: true };
        } catch (error) {
          console.error("Contact submission error:", error);
          throw error;
        }
      }),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const credentials = await getAdminCredentials();
          if (!credentials) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Admin credentials not set up",
            });
          }

          const isValid = await bcrypt.compare(input.password, credentials.password);
          if (!isValid) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid password",
            });
          }

          ctx.res.cookie("admin_token", "authenticated", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
          });

          return { success: true };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Admin login error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Login failed",
          });
        }
      }),

    getSubmissions: publicProcedure.query(async ({ ctx }) => {
      try {
        const adminToken = ctx.req.cookies?.admin_token;
        if (!adminToken) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }

        const submissions = await getAllContactSubmissions();
        return submissions;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Get submissions error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch submissions",
        });
      }
    }),

    setPassword: publicProcedure
      .input(z.object({ currentPassword: z.string(), newPassword: z.string().min(6) }))
      .mutation(async ({ input }) => {
        try {
          const credentials = await getAdminCredentials();
          if (!credentials) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Admin credentials not set up",
            });
          }

          const isValid = await bcrypt.compare(input.currentPassword, credentials.password);
          if (!isValid) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Current password is incorrect",
            });
          }

          const hashedPassword = await bcrypt.hash(input.newPassword, 10);
          await setAdminPassword(hashedPassword);

          return { success: true };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Set password error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to set password",
          });
        }
      }),

    initializePassword: publicProcedure
      .input(z.object({ password: z.string().min(6) }))
      .mutation(async ({ input }) => {
        try {
          const credentials = await getAdminCredentials();
          if (credentials) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Admin password already set",
            });
          }

          const hashedPassword = await bcrypt.hash(input.password, 10);
          await setAdminPassword(hashedPassword);

          return { success: true };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Initialize password error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to initialize password",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
