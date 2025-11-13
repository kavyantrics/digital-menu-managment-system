import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.dishCategory.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.category.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  // Create User with Profile
  console.log("👤 Creating user...");
  const user = await prisma.user.create({
    data: {
      email: "adarshh.addi@gmail.com",
      name: "Adarsh",
      country: "United States",
      verified: true,
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create Two Restaurants
  console.log("🍽️ Creating restaurants...");
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: "The Italian Bistro",
      location: "New York, NY, USA",
      userId: user.id,
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: "Spice Garden",
      location: "Mumbai, Maharashtra, India",
      userId: user.id,
    },
  });

  console.log(`✅ Created 2 restaurants`);

  // Create Categories for Restaurant 1 (Italian Bistro)
  console.log("📂 Creating categories for The Italian Bistro...");
  const categories1 = await Promise.all([
    prisma.category.create({
      data: {
        name: "Appetizers",
        restaurantId: restaurant1.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Main Courses",
        restaurantId: restaurant1.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Pizza",
        restaurantId: restaurant1.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Pasta",
        restaurantId: restaurant1.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Desserts",
        restaurantId: restaurant1.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Beverages",
        restaurantId: restaurant1.id,
      },
    }),
  ]);

  // Create Categories for Restaurant 2 (Spice Garden)
  console.log("📂 Creating categories for Spice Garden...");
  const categories2 = await Promise.all([
    prisma.category.create({
      data: {
        name: "Starters",
        restaurantId: restaurant2.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Curries",
        restaurantId: restaurant2.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Breads",
        restaurantId: restaurant2.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Rice & Biryani",
        restaurantId: restaurant2.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Desserts",
        restaurantId: restaurant2.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Beverages",
        restaurantId: restaurant2.id,
      },
    }),
  ]);

  console.log(`✅ Created categories for both restaurants`);

  // Create Dishes for Restaurant 1 (Italian Bistro)
  console.log("🍕 Creating dishes for The Italian Bistro...");
  const dishes1 = await Promise.all([
    // Appetizers
    prisma.dish.create({
      data: {
        name: "Bruschetta",
        description:
          "Toasted bread topped with fresh tomatoes, basil, and garlic",
        price: "$12",
        image:
          "https://images.unsplash.com/photo-1572442388796-11668a457c17?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[0].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Caprese Salad",
        description:
          "Fresh mozzarella, tomatoes, and basil drizzled with balsamic",
        price: "$14",
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[0].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Antipasto Platter",
        description: "Selection of Italian cured meats, cheeses, and olives",
        price: "$18",
        image:
          "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[0].id }],
        },
      },
    }),
    // Main Courses
    prisma.dish.create({
      data: {
        name: "Chicken Parmigiana",
        description:
          "Breaded chicken breast with marinara sauce and melted mozzarella",
        price: "$24",
        image:
          "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[1].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Osso Buco",
        description: "Braised veal shanks with vegetables and white wine",
        price: "$32",
        image:
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[1].id }],
        },
      },
    }),
    // Pizza
    prisma.dish.create({
      data: {
        name: "Margherita Pizza",
        description:
          "Traditional pizza with tomato, mozzarella, and fresh basil",
        price: "$18",
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[2].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Pepperoni Pizza",
        description: "Classic pizza with pepperoni and mozzarella cheese",
        price: "$20",
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[2].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Quattro Stagioni",
        description:
          "Four seasons pizza with ham, mushrooms, artichokes, and olives",
        price: "$22",
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[2].id }],
        },
      },
    }),
    // Pasta
    prisma.dish.create({
      data: {
        name: "Spaghetti Carbonara",
        description: "Classic Roman pasta with eggs, pancetta, and parmesan",
        price: "$22",
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[3].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Fettuccine Alfredo",
        description: "Creamy pasta with butter, parmesan, and black pepper",
        price: "$20",
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[3].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Penne Arrabbiata",
        description: "Spicy pasta with tomatoes, garlic, and red chili peppers",
        price: "$19",
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
        spiceLevel: 2,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[3].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Lasagna",
        description: "Layered pasta with meat sauce, béchamel, and cheese",
        price: "$24",
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[3].id }],
        },
      },
    }),
    // Desserts
    prisma.dish.create({
      data: {
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee and mascarpone",
        price: "$10",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[4].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Cannoli",
        description: "Sicilian pastry tubes filled with sweet ricotta",
        price: "$9",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[4].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Gelato",
        description: "Italian ice cream - vanilla, chocolate, or strawberry",
        price: "$8",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[4].id }],
        },
      },
    }),
    // Beverages
    prisma.dish.create({
      data: {
        name: "Italian Red Wine",
        description: "House selection of Chianti",
        price: "$35",
        image:
          "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[5].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Espresso",
        description: "Strong Italian coffee",
        price: "$4",
        image:
          "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[5].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Limoncello",
        description: "Italian lemon liqueur",
        price: "$12",
        image:
          "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
        spiceLevel: null,
        restaurantId: restaurant1.id,
        categories: {
          create: [{ categoryId: categories1[5].id }],
        },
      },
    }),
  ]);

  // Create Dishes for Restaurant 2 (Spice Garden)
  console.log("🍛 Creating dishes for Spice Garden...");
  const dishes2 = await Promise.all([
    // Starters
    prisma.dish.create({
      data: {
        name: "Samosa",
        description:
          "Crispy fried pastries filled with spiced potatoes and peas",
        price: "₹ 60",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        spiceLevel: 1,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[0].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Paneer Tikka",
        description: "Grilled cottage cheese marinated in spices",
        price: "₹ 180",
        image:
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        spiceLevel: 2,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[0].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Chicken 65",
        description: "Spicy deep-fried chicken pieces with curry leaves",
        price: "₹ 220",
        image:
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        spiceLevel: 3,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[0].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Vegetable Pakora",
        description:
          "Mixed vegetables dipped in spiced chickpea batter and fried",
        price: "₹ 120",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        spiceLevel: 1,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[0].id }],
        },
      },
    }),
    // Curries
    prisma.dish.create({
      data: {
        name: "Butter Chicken",
        description: "Creamy tomato-based curry with tender chicken pieces",
        price: "₹ 320",
        image:
          "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
        spiceLevel: 1,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[1].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Lamb Vindaloo",
        description: "Spicy and tangy curry with tender lamb pieces",
        price: "₹ 380",
        image:
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        spiceLevel: 3,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[1].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Dal Makhani",
        description: "Creamy black lentils cooked with butter and spices",
        price: "₹ 220",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        spiceLevel: 1,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[1].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Palak Paneer",
        description: "Spinach curry with cottage cheese cubes",
        price: "₹ 250",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        spiceLevel: 1,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[1].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Chicken Tikka Masala",
        description: "Grilled chicken in creamy tomato and spice sauce",
        price: "₹ 340",
        image:
          "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
        spiceLevel: 2,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[1].id }],
        },
      },
    }),
    // Breads
    prisma.dish.create({
      data: {
        name: "Garlic Naan",
        description: "Soft bread brushed with garlic and butter",
        price: "₹ 80",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[2].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Butter Naan",
        description: "Classic Indian flatbread with butter",
        price: "₹ 70",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[2].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Roti",
        description: "Whole wheat flatbread",
        price: "₹ 50",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[2].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Tandoori Roti",
        description: "Clay oven-baked whole wheat bread",
        price: "₹ 60",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[2].id }],
        },
      },
    }),
    // Rice & Biryani
    prisma.dish.create({
      data: {
        name: "Chicken Biryani",
        description: "Fragrant basmati rice with spiced chicken and herbs",
        price: "₹ 350",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        spiceLevel: 2,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[3].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Vegetable Biryani",
        description: "Aromatic basmati rice with mixed vegetables and spices",
        price: "₹ 280",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        spiceLevel: 1,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[3].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Basmati Rice",
        description: "Steamed long-grain basmati rice",
        price: "₹ 120",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[3].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Jeera Rice",
        description: "Basmati rice tempered with cumin seeds",
        price: "₹ 140",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[3].id }],
        },
      },
    }),
    // Desserts
    prisma.dish.create({
      data: {
        name: "Gulab Jamun",
        description: "Sweet milk dumplings in rose-flavored syrup",
        price: "₹ 100",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[4].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Kheer",
        description: "Rice pudding with cardamom and nuts",
        price: "₹ 90",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[4].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Rasmalai",
        description: "Soft cheese dumplings in sweetened milk with saffron",
        price: "₹ 110",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[4].id }],
        },
      },
    }),
    // Beverages
    prisma.dish.create({
      data: {
        name: "Mango Lassi",
        description: "Sweet yogurt drink with mango",
        price: "₹ 80",
        image:
          "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[5].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Masala Chai",
        description: "Spiced Indian tea with milk",
        price: "₹ 50",
        image:
          "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[5].id }],
        },
      },
    }),
    prisma.dish.create({
      data: {
        name: "Fresh Lime Soda",
        description: "Refreshing lime drink with soda",
        price: "₹ 60",
        image:
          "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
        spiceLevel: null,
        restaurantId: restaurant2.id,
        categories: {
          create: [{ categoryId: categories2[5].id }],
        },
      },
    }),
  ]);

  console.log(`✅ Created dishes for both restaurants`);

  const totalDishes = dishes1.length + dishes2.length;
  console.log(`✅ Created ${totalDishes} dishes total`);

  console.log("\n✨ Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - User: ${user.email} (${user.name})`);
  console.log(`   - Restaurants: 2`);
  console.log(`   - Categories: ${categories1.length + categories2.length}`);
  console.log(`   - Dishes: ${totalDishes}`);
  console.log("\n🎉 You can now test the application with this data!");
  console.log(`\n💡 Login with: ${user.email} (user is already verified)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
