import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const publicMenuRouter = createTRPCRouter({
  getRestaurantMenu: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findUnique({
        where: { id: input.restaurantId },
        select: {
          id: true,
          name: true,
          location: true,
        },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found.",
        });
      }

      // Get all categories with their dishes
      const categories = await ctx.db.category.findMany({
        where: { restaurantId: input.restaurantId },
        include: {
          dishes: {
            include: {
              dish: {
                include: {
                  categories: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      });

      // Transform the data to a more usable format
      const menuData = categories.map((category) => ({
        id: category.id,
        name: category.name,
        dishes: category.dishes.map((dc) => ({
          id: dc.dish.id,
          name: dc.dish.name,
          image: dc.dish.image,
          description: dc.dish.description,
          price: dc.dish.price,
          spiceLevel: dc.dish.spiceLevel,
          categories: dc.dish.categories.map((dcc) => ({
            id: dcc.category.id,
            name: dcc.category.name,
          })),
        })),
      }));

      return {
        restaurant,
        categories: menuData,
      };
    }),
});
