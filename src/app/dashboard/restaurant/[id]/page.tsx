"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function RestaurantManagementPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showDishForm, setShowDishForm] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [dishName, setDishName] = useState("");
  const [dishImage, setDishImage] = useState("");
  const [dishDescription, setDishDescription] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishSpiceLevel, setDishSpiceLevel] = useState<number | null>(null);

  const { data: restaurant } = api.restaurant.getById.useQuery({
    id: restaurantId,
  });
  const { data: categories, refetch: refetchCategories } =
    api.menu.getCategories.useQuery({
      restaurantId,
    });
  const { data: dishes, refetch: refetchDishes } = api.menu.getDishes.useQuery({
    restaurantId,
  });

  const createCategory = api.menu.createCategory.useMutation({
    onSuccess: () => {
      setShowCategoryForm(false);
      setCategoryName("");
      void refetchCategories();
    },
  });

  const createDish = api.menu.createDish.useMutation({
    onSuccess: () => {
      setShowDishForm(false);
      setDishName("");
      setDishImage("");
      setDishDescription("");
      setDishPrice("");
      setDishSpiceLevel(null);
      setSelectedCategoryIds([]);
      void refetchDishes();
    },
  });

  const deleteCategory = api.menu.deleteCategory.useMutation({
    onSuccess: () => {
      void refetchCategories();
      void refetchDishes();
    },
  });

  const deleteDish = api.menu.deleteDish.useMutation({
    onSuccess: () => {
      void refetchDishes();
    },
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate({
      restaurantId,
      name: categoryName,
    });
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    createDish.mutate({
      restaurantId,
      name: dishName,
      image: dishImage || undefined,
      description: dishDescription || undefined,
      price: dishPrice || undefined,
      spiceLevel: dishSpiceLevel ?? undefined,
      categoryIds:
        selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
    });
  };

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="border-b-2 border-gray-200 bg-white/80 shadow-md backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="mb-4 font-semibold"
              >
                ← Back to Dashboard
              </Button>
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-extrabold text-transparent">
                {restaurant.name}
              </h1>
              <p className="mt-2 text-base font-medium text-gray-600">
                📍 {restaurant.location}
              </p>
            </div>
            <Button
              onClick={() => router.push(`/menu/${restaurantId}`)}
              variant="outline"
              size="lg"
              className="font-semibold"
            >
              👁️ View Public Menu
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Categories Section */}
          <Card className="border-2 border-gray-200 bg-white shadow-xl">
            <CardHeader className="pb-5">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Categories
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Manage menu categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showCategoryForm ? (
                <div className="space-y-5">
                  <Button
                    onClick={() => setShowCategoryForm(true)}
                    className="w-full border-2 border-blue-600 bg-blue-600 text-base font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                    size="lg"
                  >
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add New Category
                  </Button>
                  {categories && categories.length > 0 ? (
                    <div className="space-y-4">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-gradient-to-r from-white to-gray-50 p-5 transition-all hover:scale-[1.01] hover:border-blue-300 hover:shadow-lg"
                        >
                          <span className="text-xl font-bold text-gray-900">
                            {category.name}
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              deleteCategory.mutate({ id: category.id })
                            }
                            disabled={deleteCategory.isPending}
                            className="font-semibold"
                          >
                            <svg
                              className="mr-1.5 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            {deleteCategory.isPending
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-10 text-center">
                      <p className="text-base font-semibold text-gray-700">
                        No categories yet. 🏷️
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleCreateCategory} className="space-y-5">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="category-name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Category Name
                    </Label>
                    <Input
                      id="category-name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="e.g., Starters, Main Course"
                      required
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={createCategory.isPending}
                      className="flex-1 border-2 border-blue-600 bg-blue-600 text-base font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                      size="lg"
                    >
                      {createCategory.isPending
                        ? "Creating..."
                        : "Create Category"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setCategoryName("");
                      }}
                      className="flex-1 font-semibold"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Dishes Section */}
          <Card className="border-2 border-gray-200 bg-white shadow-xl">
            <CardHeader className="pb-5">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Dishes
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Manage menu items
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showDishForm ? (
                <div className="space-y-5">
                  <Button
                    onClick={() => setShowDishForm(true)}
                    className="w-full border-2 border-blue-600 bg-blue-600 text-base font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                    size="lg"
                  >
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add New Dish
                  </Button>
                  {dishes && dishes.length > 0 ? (
                    <div className="max-h-[600px] space-y-4 overflow-y-auto">
                      {dishes.map((dish) => (
                        <div
                          key={dish.id}
                          className="flex items-start justify-between rounded-xl border-2 border-gray-200 bg-gradient-to-r from-white to-gray-50 p-5 transition-all hover:scale-[1.01] hover:border-blue-300 hover:shadow-lg"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="mb-1 text-lg font-bold text-gray-900">
                              {dish.name}
                            </p>
                            {dish.price && (
                              <p className="mb-1 text-base font-semibold text-gray-700">
                                {dish.price}
                              </p>
                            )}
                            {dish.description && (
                              <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                                {dish.description}
                              </p>
                            )}
                            {dish.spiceLevel !== null &&
                              dish.spiceLevel !== undefined && (
                                <div className="mb-2 flex items-center gap-1">
                                  <span className="text-xs font-semibold text-gray-600">
                                    Spice:
                                  </span>
                                  <div className="flex gap-0.5">
                                    {Array.from({ length: 3 }).map((_, i) => {
                                      const spiceLevel = dish.spiceLevel ?? 0;
                                      return (
                                        <span
                                          key={i}
                                          className={`text-sm ${
                                            i < spiceLevel
                                              ? "opacity-100"
                                              : "opacity-30"
                                          }`}
                                        >
                                          🌶️
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            {dish.categories.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {dish.categories.map((dc) => (
                                  <span
                                    key={dc.id}
                                    className="rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                                  >
                                    {dc.category.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteDish.mutate({ id: dish.id })}
                            disabled={deleteDish.isPending}
                            className="ml-3 shrink-0 font-semibold"
                          >
                            <svg
                              className="mr-1.5 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            {deleteDish.isPending ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed bg-gray-50 px-4 py-8 text-center">
                      <p className="text-sm font-medium text-gray-600">
                        No dishes yet.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleCreateDish}
                  className="max-h-[600px] space-y-5 overflow-y-auto pr-2"
                >
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="dish-name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Dish Name
                    </Label>
                    <Input
                      id="dish-name"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      placeholder="Dish name"
                      required
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="dish-image"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Image URL{" "}
                      <span className="font-normal text-gray-500">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="dish-image"
                      type="url"
                      value={dishImage}
                      onChange={(e) => setDishImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="dish-description"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Description{" "}
                      <span className="font-normal text-gray-500">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="dish-description"
                      value={dishDescription}
                      onChange={(e) => setDishDescription(e.target.value)}
                      placeholder="Dish description"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="dish-price"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Price{" "}
                      <span className="font-normal text-gray-500">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="dish-price"
                      value={dishPrice}
                      onChange={(e) => setDishPrice(e.target.value)}
                      placeholder="e.g., ₹ 80"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="dish-spice"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Spice Level{" "}
                      <span className="font-normal text-gray-500">
                        (0-3, optional)
                      </span>
                    </Label>
                    <Input
                      id="dish-spice"
                      type="number"
                      min="0"
                      max="3"
                      value={dishSpiceLevel ?? ""}
                      onChange={(e) =>
                        setDishSpiceLevel(
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      placeholder="0-3"
                      className="h-11 text-base"
                    />
                  </div>
                  {categories && categories.length > 0 && (
                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold text-gray-700">
                        Categories{" "}
                        <span className="font-normal text-gray-500">
                          (select multiple)
                        </span>
                      </Label>
                      <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border-2 bg-gray-50 p-3">
                        {categories.map((category) => (
                          <label
                            key={category.id}
                            className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-white"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategoryIds.includes(
                                category.id,
                              )}
                              onChange={() =>
                                toggleCategorySelection(category.id)
                              }
                              className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-2 border-gray-300 focus:ring-2"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {category.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={createDish.isPending}
                      className="flex-1 border-2 border-blue-600 bg-blue-600 text-base font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                      size="lg"
                    >
                      {createDish.isPending ? "Creating..." : "Create Dish"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowDishForm(false);
                        setDishName("");
                        setDishImage("");
                        setDishDescription("");
                        setDishPrice("");
                        setDishSpiceLevel(null);
                        setSelectedCategoryIds([]);
                      }}
                      className="flex-1 font-semibold"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
