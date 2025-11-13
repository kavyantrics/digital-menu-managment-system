"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function DashboardPage() {
  const router = useRouter();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState("");

  const { data: user } = api.auth.getCurrentUser.useQuery();
  const { data: restaurants, refetch: refetchRestaurants } =
    api.restaurant.getAll.useQuery();

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setShowProfileForm(false);
      router.refresh();
    },
  });

  const createRestaurant = api.restaurant.create.useMutation({
    onSuccess: () => {
      setShowRestaurantForm(false);
      setRestaurantName("");
      setRestaurantLocation("");
      void refetchRestaurants();
    },
  });

  const logout = api.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/login");
      router.refresh();
    },
  });

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfile.mutate({
      name: formData.get("name") as string,
      country: formData.get("country") as string,
    });
  };

  const handleCreateRestaurant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createRestaurant.mutate({
      name: restaurantName,
      location: restaurantLocation,
    });
  };

  if (!user) {
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
            <div>
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-extrabold text-transparent">
                Dashboard
              </h1>
              <p className="mt-2 text-base font-medium text-gray-600">
                Manage your profile and restaurants
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 text-sm font-semibold text-gray-800">
                {user.email}
              </span>
              <Button
                variant="outline"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="font-semibold"
              >
                {logout.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Section */}
          <Card className="border-2 border-gray-200 bg-white shadow-xl">
            <CardHeader className="pb-5">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Profile
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showProfileForm ? (
                <div className="space-y-5">
                  <div className="space-y-4">
                    <div className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4 shadow-sm">
                      <p className="mb-2 text-xs font-bold tracking-wider text-gray-600 uppercase">
                        Name
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.name || (
                          <span className="font-normal text-gray-500 italic">
                            Not set
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4 shadow-sm">
                      <p className="mb-2 text-xs font-bold tracking-wider text-gray-600 uppercase">
                        Country
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.country || (
                          <span className="font-normal text-gray-500 italic">
                            Not set
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowProfileForm(true)}
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
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={user.name || ""}
                      placeholder="Your full name"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="country"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      defaultValue={user.country || ""}
                      placeholder="Your country"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={updateProfile.isPending}
                      className="flex-1 border-2 border-blue-600 bg-blue-600 text-base font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                      size="lg"
                    >
                      {updateProfile.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowProfileForm(false)}
                      className="flex-1 font-semibold"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Restaurants Section */}
          <Card className="border-2 border-gray-200 bg-white shadow-xl">
            <CardHeader className="pb-5">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Restaurants
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Manage your restaurants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showRestaurantForm ? (
                <div className="space-y-5">
                  <Button
                    onClick={() => setShowRestaurantForm(true)}
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
                    Add New Restaurant
                  </Button>
                  {restaurants && restaurants.length > 0 ? (
                    <div className="space-y-4">
                      {restaurants.map((restaurant) => (
                        <div
                          key={restaurant.id}
                          className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-gradient-to-r from-white to-gray-50 p-5 transition-all hover:scale-[1.01] hover:border-blue-300 hover:shadow-lg"
                        >
                          <div className="flex-1">
                            <p className="text-xl font-bold text-gray-900">
                              {restaurant.name}
                            </p>
                            <p className="mt-1.5 text-sm font-medium text-gray-600">
                              📍 {restaurant.location}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/dashboard/restaurant/${restaurant.id}`,
                              )
                            }
                            className="ml-4 font-semibold"
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
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Manage
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-10 text-center">
                      <p className="text-base font-semibold text-gray-700">
                        No restaurants yet. Create one to get started! 🚀
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleCreateRestaurant} className="space-y-5">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="restaurant-name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Restaurant Name
                    </Label>
                    <Input
                      id="restaurant-name"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder="Restaurant name"
                      required
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="restaurant-location"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Location
                    </Label>
                    <Input
                      id="restaurant-location"
                      value={restaurantLocation}
                      onChange={(e) => setRestaurantLocation(e.target.value)}
                      placeholder="Restaurant location"
                      required
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={createRestaurant.isPending}
                      className="flex-1 border-2 border-blue-600 bg-blue-600 text-base font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                      size="lg"
                    >
                      {createRestaurant.isPending
                        ? "Creating..."
                        : "Create Restaurant"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowRestaurantForm(false);
                        setRestaurantName("");
                        setRestaurantLocation("");
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
