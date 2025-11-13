"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import QRCodeSVG from "react-qr-code";

export default function PublicMenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setRestaurantId(p.restaurantId));
  }, [params]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: menuData } = api.publicMenu.getRestaurantMenu.useQuery(
    {
      restaurantId,
    },
    {
      enabled: !!restaurantId,
    },
  );

  useEffect(() => {
    if (
      menuData?.categories &&
      menuData.categories.length > 0 &&
      !activeCategory
    ) {
      setActiveCategory(menuData.categories[0]?.id ?? null);
    }
  }, [menuData, activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (!menuData?.categories) return;

      // Find which category is currently in view
      for (const category of menuData.categories) {
        const element = categoryRefs.current[category.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuData]);

  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveCategory(categoryId);
      setShowMenuModal(false);
    }
  };

  const currentCategory = menuData?.categories.find(
    (c) => c.id === activeCategory,
  );
  const menuUrl = typeof window !== "undefined" ? window.location.href : "";

  if (!menuData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div className="fixed top-0 right-0 left-0 z-40 border-b-2 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {menuData.restaurant.name}
          </h1>
          {currentCategory && (
            <p className="mt-1 text-base font-semibold text-gray-700">
              {currentCategory.name}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 pb-28">
        {menuData.categories.map((category) => (
          <div
            key={category.id}
            ref={(el) => {
              categoryRefs.current[category.id] = el;
            }}
            className="mb-10"
          >
            <div className="container mx-auto px-4">
              <h2 className="mb-6 border-b-2 border-gray-200 pb-2 text-3xl font-bold text-gray-900">
                {category.name}
              </h2>
              {category.dishes.length > 0 ? (
                <div className="space-y-5">
                  {category.dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="flex gap-5 rounded-lg border-2 bg-white p-5 transition-shadow hover:shadow-lg"
                    >
                      <div className="flex-1">
                        <div className="mb-2 flex items-start gap-3">
                          <div className="mt-2 h-3 w-3 shrink-0 rounded-full bg-yellow-400 shadow-sm" />
                          <h3 className="text-xl font-bold text-gray-900">
                            {dish.name}
                          </h3>
                        </div>
                        {dish.price && (
                          <p className="mb-2 ml-6 text-lg font-bold text-gray-800">
                            {dish.price}
                          </p>
                        )}
                        {dish.description && (
                          <p className="mb-3 ml-6 text-sm leading-relaxed text-gray-600">
                            {dish.description}
                          </p>
                        )}
                        {dish.spiceLevel !== null &&
                          dish.spiceLevel !== undefined && (
                            <div className="ml-6 flex items-center gap-2">
                              <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                Spice:
                              </span>
                              <div className="flex gap-1">
                                {Array.from({ length: 3 }).map((_, i) => {
                                  const spiceLevel = dish.spiceLevel ?? 0;
                                  return (
                                    <span
                                      key={i}
                                      className={`text-lg ${
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
                      </div>
                      {dish.image && (
                        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-gray-200 shadow-md">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed bg-gray-50 px-4 py-12 text-center">
                  <p className="text-sm font-medium text-gray-600">
                    No dishes in this category yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Menu Button */}
      <Button
        onClick={() => setShowMenuModal(true)}
        className="hover:shadow-3xl fixed right-6 bottom-6 z-50 h-16 w-16 rounded-full border-4 border-white bg-blue-600 text-white shadow-2xl transition-all duration-200 hover:scale-110 hover:bg-blue-700"
        size="lg"
        aria-label="Menu"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </Button>

      <Dialog open={showMenuModal} onOpenChange={setShowMenuModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto border-2 bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Menu Categories
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {menuData.categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                variant={activeCategory === category.id ? "default" : "outline"}
                className="h-auto w-full justify-between p-4 text-left"
              >
                <span className="font-semibold">{category.name}</span>
                <span
                  className={`text-sm ${
                    activeCategory === category.id
                      ? "text-primary-foreground/80"
                      : "text-gray-500"
                  }`}
                >
                  {category.dishes.length}{" "}
                  {category.dishes.length === 1 ? "item" : "items"}
                </span>
              </Button>
            ))}
          </div>
          <div className="mt-6 border-t-2 pt-4">
            <Button
              onClick={() => {
                setShowMenuModal(false);
                setShowQRModal(true);
              }}
              className="w-full"
              variant="outline"
              size="lg"
            >
              Share Menu / QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="border-2 bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Share Menu
            </DialogTitle>
          </DialogHeader>
          <div className="mb-5 flex flex-col items-center gap-5">
            <div className="rounded-lg border-2 border-gray-200 bg-white p-5 shadow-md">
              <QRCodeSVG value={menuUrl} size={220} />
            </div>
            <div className="w-full space-y-2.5">
              <Label className="text-sm font-semibold text-gray-700">
                Menu Link
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={menuUrl}
                  readOnly
                  className="h-11 flex-1 border-2 text-sm"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(menuUrl);
                    alert("Link copied to clipboard!");
                  }}
                  className="border-2 border-blue-600 bg-blue-600 font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                  size="lg"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
