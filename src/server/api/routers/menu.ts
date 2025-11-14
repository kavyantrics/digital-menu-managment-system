import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const menuRouter = createTRPCRouter({
  // Category operations
  createCategory: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify restaurant ownership
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          userId: ctx.session.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found.",
        });
      }

      const category = await ctx.db.category.create({
        data: {
          name: input.name,
          restaurantId: input.restaurantId,
        },
      });

      return category;
    }),

  getCategories: protectedProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify restaurant ownership
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          userId: ctx.session.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found.",
        });
      }

      const categories = await ctx.db.category.findMany({
        where: { restaurantId: input.restaurantId },
        orderBy: { name: "asc" },
      });

      return categories;
    }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership through restaurant
      const category = await ctx.db.category.findFirst({
        where: { id: input.id },
        include: { restaurant: true },
      });

      if (!category || category.restaurant.userId !== ctx.session.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found.",
        });
      }

      const updated = await ctx.db.category.update({
        where: { id: input.id },
        data: { name: input.name },
      });

      return updated;
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership through restaurant
      const category = await ctx.db.category.findFirst({
        where: { id: input.id },
        include: { restaurant: true },
      });

      if (!category || category.restaurant.userId !== ctx.session.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found.",
        });
      }

      await ctx.db.category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Dish operations
  createDish: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        name: z.string().min(1),
        image: z.string().url().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        spiceLevel: z.number().int().min(0).max(3).optional(),
        categoryIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify restaurant ownership
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          userId: ctx.session.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found.",
        });
      }

      // Verify categories belong to the restaurant if provided
      if (input.categoryIds && input.categoryIds.length > 0) {
        const categories = await ctx.db.category.findMany({
          where: {
            id: { in: input.categoryIds },
            restaurantId: input.restaurantId,
          },
        });

        if (categories.length !== input.categoryIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Some categories do not belong to this restaurant.",
          });
        }
      }

      const dish = await ctx.db.dish.create({
        data: {
          name: input.name,
          image: input.image,
          description: input.description,
          price: input.price,
          spiceLevel: input.spiceLevel,
          restaurantId: input.restaurantId,
          categories: {
            create: input.categoryIds?.map((categoryId) => ({
              categoryId,
            })),
          },
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      return dish;
    }),

  getDishes: protectedProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify restaurant ownership
      const restaurant = await ctx.db.restaurant.findFirst({
        where: {
          id: input.restaurantId,
          userId: ctx.session.userId,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found.",
        });
      }

      const dishes = await ctx.db.dish.findMany({
        where: { restaurantId: input.restaurantId },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return dishes;
    }),

  updateDish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        image: z.string().url().optional(),
        description: z.string().optional(),
        price: z.string().optional().nullable(),
        spiceLevel: z.number().int().min(0).max(3).optional().nullable(),
        categoryIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership through restaurant
      const dish = await ctx.db.dish.findFirst({
        where: { id: input.id },
        include: { restaurant: true },
      });

      if (!dish || dish.restaurant.userId !== ctx.session.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dish not found.",
        });
      }

      // Verify categories if provided
      if (input.categoryIds && input.categoryIds.length > 0) {
        const categories = await ctx.db.category.findMany({
          where: {
            id: { in: input.categoryIds },
            restaurantId: dish.restaurantId,
          },
        });

        if (categories.length !== input.categoryIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Some categories do not belong to this restaurant.",
          });
        }
      }

      // Update dish
      await ctx.db.dish.update({
        where: { id: input.id },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.image !== undefined && { image: input.image }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
          ...(input.price !== undefined && { price: input.price }),
          ...(input.spiceLevel !== undefined && {
            spiceLevel: input.spiceLevel,
          }),
        },
      });

      // Update categories if provided
      if (input.categoryIds !== undefined) {
        // Delete existing dish categories
        await ctx.db.dishCategory.deleteMany({
          where: { dishId: input.id },
        });

        // Create new dish categories
        if (input.categoryIds.length > 0) {
          await ctx.db.dishCategory.createMany({
            data: input.categoryIds.map((categoryId) => ({
              dishId: input.id,
              categoryId,
            })),
          });
        }
      }

      // Fetch updated dish with categories
      const dishWithCategories = await ctx.db.dish.findUnique({
        where: { id: input.id },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      return dishWithCategories;
    }),

  deleteDish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership through restaurant
      const dish = await ctx.db.dish.findFirst({
        where: { id: input.id },
        include: { restaurant: true },
      });

      if (!dish || dish.restaurant.userId !== ctx.session.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dish not found.",
        });
      }

      await ctx.db.dish.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
