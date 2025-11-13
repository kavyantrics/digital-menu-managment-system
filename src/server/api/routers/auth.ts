import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { sendVerificationCode } from "~/server/email";
import { createSession } from "~/server/session";

export const authRouter = createTRPCRouter({
  requestVerificationCode: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Check if user exists
      let user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        // Create new user if doesn't exist
        user = await ctx.db.user.create({
          data: {
            email: input.email,
            verificationCode: code,
          },
        });
      } else {
        // Update existing user with new code
        user = await ctx.db.user.update({
          where: { email: input.email },
          data: {
            verificationCode: code,
          },
        });
      }

      // Send verification code via email
      await sendVerificationCode(input.email, code);

      return { success: true };
    }),

  verifyCode: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found. Please request a verification code first.",
        });
      }

      if (user.verificationCode !== input.code) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid verification code.",
        });
      }

      // Clear verification code and mark as verified
      await ctx.db.user.update({
        where: { id: user.id },
        data: {
          verificationCode: null,
          verified: true,
        },
      });

      // Create session and get the token
      const sessionToken = await createSession(user.id);

      // Store session token in context so route handler can access it
      if (ctx.setSessionToken) {
        ctx.setSessionToken(sessionToken);
      }

      return { success: true, userId: user.id };
    }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        country: true,
        verified: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }

    return user;
  }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    // Signal that session should be deleted
    if (ctx.deleteSession) {
      ctx.deleteSession();
    }
    return { success: true };
  }),
});
