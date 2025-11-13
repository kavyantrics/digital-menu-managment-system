import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        country: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.userId },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.country && { country: input.country }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          country: true,
        },
      });

      return user;
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
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
});

