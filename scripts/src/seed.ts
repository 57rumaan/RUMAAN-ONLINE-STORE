import { db, categoriesTable, productsTable } from "@workspace/db";

const categories = [
  {
    name: "Mobile Phones",
    slug: "mobile-phones",
    description: "Latest smartphones and mobile phones from top brands",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    allowOnlinePurchase: true,
    showPrices: true,
  },
  {
    name: "Gaming Accessories",
    slug: "gaming-accessories",
    description: "Level up your gaming experience with premium accessories",
    imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
    allowOnlinePurchase: true,
    showPrices: true,
  },
  {
    name: "Mobile Accessories",
    slug: "mobile-accessories",
    description: "Essential accessories for your mobile devices",
    imageUrl: "https://images.unsplash.com/photo-1601972599748-bf76c3c49e72?w=800&q=80",
    allowOnlinePurchase: true,
    showPrices: true,
  },
  {
    name: "Deals",
    slug: "deals",
    description: "Exclusive deals and special offers",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
    allowOnlinePurchase: false,
    showPrices: false,
  },
];

async function seed() {
  console.log("Seeding categories...");
  const insertedCategories = await db
    .insert(categoriesTable)
    .values(categories)
    .onConflictDoNothing()
    .returning();

  console.log(`Inserted ${insertedCategories.length} categories`);

  // Get all categories to reference their IDs
  const allCategories = await db.select().from(categoriesTable);
  const catMap: Record<string, number> = {};
  allCategories.forEach((c) => {
    catMap[c.slug] = c.id;
  });

  const products = [
    // Mobile Phones
    {
      name: "Samsung Galaxy S24 Ultra",
      description: "200MP camera, S Pen included, 6.8\" Dynamic AMOLED, 5000mAh battery",
      price: "289999",
      imageUrl: "https://images.unsplash.com/photo-1610945264803-c22b62831023?w=800&q=80",
      categoryId: catMap["mobile-phones"],
      featured: true,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "iPhone 15 Pro Max",
      description: "A17 Pro chip, 48MP camera system, titanium design, ProMotion display",
      price: "399999",
      imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80",
      categoryId: catMap["mobile-phones"],
      featured: true,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "OnePlus 12",
      description: "Snapdragon 8 Gen 3, 50W wireless charging, Hasselblad camera",
      price: "179999",
      imageUrl: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80",
      categoryId: catMap["mobile-phones"],
      featured: false,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "Xiaomi 14 Ultra",
      description: "Leica optics, 90W fast charging, 6.73\" AMOLED, Snapdragon 8 Gen 3",
      price: "219999",
      imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
      categoryId: catMap["mobile-phones"],
      featured: false,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    // Gaming Accessories
    {
      name: "Sony PlayStation 5 Controller",
      description: "DualSense wireless controller with haptic feedback and adaptive triggers",
      price: "19999",
      imageUrl: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80",
      categoryId: catMap["gaming-accessories"],
      featured: true,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "Razer DeathAdder V3 Pro",
      description: "Ultra-lightweight wireless gaming mouse, 30000 DPI, 90hr battery",
      price: "24999",
      imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",
      categoryId: catMap["gaming-accessories"],
      featured: false,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "SteelSeries Arctis Nova Pro",
      description: "Premium wireless gaming headset, active noise cancellation, multi-system connect",
      price: "49999",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      categoryId: catMap["gaming-accessories"],
      featured: true,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "Xbox Wireless Controller",
      description: "Wireless gamepad with textured grip, compatible with PC and Xbox",
      price: "12999",
      imageUrl: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80",
      categoryId: catMap["gaming-accessories"],
      featured: false,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    // Mobile Accessories
    {
      name: "Anker 65W Fast Charger",
      description: "GaN technology, PPS fast charge, compact design, universal compatibility",
      price: "4999",
      imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
      categoryId: catMap["mobile-accessories"],
      featured: true,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "Spigen Ultra Hybrid Case - iPhone 15",
      description: "Military grade drop protection, crystal clear back, wireless charging compatible",
      price: "2499",
      imageUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80",
      categoryId: catMap["mobile-accessories"],
      featured: false,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "Samsung 45W Super Fast Charger",
      description: "Super fast charging 2.0, USB-C, compatible with all Samsung Galaxy devices",
      price: "3999",
      imageUrl: "https://images.unsplash.com/photo-1619961602105-16fa2a5465c2?w=800&q=80",
      categoryId: catMap["mobile-accessories"],
      featured: false,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "JBL Tune 760NC Bluetooth Headphones",
      description: "Active noise cancelling, 35hr battery, foldable design, JBL Pure Bass",
      price: "14999",
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      categoryId: catMap["mobile-accessories"],
      featured: true,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    // Deals
    {
      name: "Mega Summer Sale",
      description: "Exclusive summer deals on selected products",
      price: "0",
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
      categoryId: catMap["deals"],
      featured: false,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
    {
      name: "Bundle Pack Offer",
      description: "Get the best bundle deals at amazing prices",
      price: "0",
      imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
      categoryId: catMap["deals"],
      featured: false,
      inStock: true,
      whatsappNumber: "+923001234567",
    },
  ];

  console.log("Seeding products...");
  const validProducts = products.filter((p) => p.categoryId !== undefined);
  const insertedProducts = await db
    .insert(productsTable)
    .values(validProducts as any)
    .onConflictDoNothing()
    .returning();

  console.log(`Inserted ${insertedProducts.length} products`);
  console.log("Seeding complete!");
}

seed().catch(console.error);
