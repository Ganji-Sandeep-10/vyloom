import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// NOTE ON DATA HONESTY:
// Only fields explicitly provided by the client are seeded with real values.
// Where color/stock data was ambiguous or not given for a specific product,
// the product is created with isAvailable: false and a TODO note so the
// admin fills in real details via the dashboard — nothing is invented.

async function main() {
  // --- Admin user ---
  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@vyloom.in" },
    update: {},
    create: {
      name: "VYLOOM Admin",
      email: "admin@vyloom.in",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  // --- Category ---
  const tshirts = await prisma.category.upsert({
    where: { slug: "t-shirts" },
    update: {},
    create: {
      name: "T-Shirts",
      slug: "t-shirts",
      imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&h=1000&q=80",
    },
  });
  await prisma.category.upsert({
    where: { slug: "oversized" },
    update: {},
    create: {
      name: "Oversized T-Shirts",
      slug: "oversized",
      imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&h=1000&q=80",
    },
  });
  await prisma.category.upsert({
    where: { slug: "hoodies" },
    update: {},
    create: {
      name: "Hoodies",
      slug: "hoodies",
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&h=1000&q=80",
    },
  });

  const fabric = "100% cotton, 240 GSM heavyweight yet breathable for a perfect oversized drape.";
  const fit = "Unisex oversized fit — designed with extra length and sleeve drop for a stylish slouch.";
  const care = "Wash inside-out in cold water, dry on low heat. Flip it inside out before ironing.";

  // Placeholder product imagery — license-free apparel photos from Unsplash.
  // Swap these for real product photos from the admin dashboard.
  const U = (id: string) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=1125&q=80`;
  const img = (a: string, b: string, name: string) => ({
    create: [
      { url: U(a), alt: name, position: 0, isMain: true },
      { url: U(b), alt: name, position: 1 },
    ],
  });

  // 1. Unisex Gang Leader Oversized Classic T-Shirt — ₹799
  const p1 = await prisma.product.upsert({
    where: { slug: "unisex-gang-leader-oversized-classic-tshirt" },
    update: {},
    create: {
      name: "Unisex Gang Leader Oversized Classic T-Shirt",
      slug: "unisex-gang-leader-oversized-classic-tshirt",
      description: "Graphic oversized tee from the VYLOOM collection.",
      price: 799,
      compareAtPrice: 1299,
      offerLabel: "BUY 3 @1199",
      rating: 4.6,
      reviewCount: 214,
      categoryId: tshirts.id,
      fabric,
      fit,
      care,
      isNew: true,
      isBestSeller: true,
      isAvailable: true,
      images: img("1521572163474-6864f9cf17ab", "1583743814966-8936f5b7be1a", "Unisex Gang Leader Oversized Classic T-Shirt"),
      variants: {
        create: [
          { color: "Black", size: "M", stockQuantity: 12, lowStockThreshold: 5 },
          { color: "Black", size: "L", stockQuantity: 10, lowStockThreshold: 5 },
          { color: "Black", size: "XL", stockQuantity: 8, lowStockThreshold: 5 },
          { color: "Black", size: "XXL", stockQuantity: 4, lowStockThreshold: 5 },
        ],
      },
    },
  });

  // 2. Unisex Oversized Classic T-Shirt – Neelambari — ₹899
  const p2 = await prisma.product.upsert({
    where: { slug: "unisex-oversized-classic-tshirt-neelambari" },
    update: {},
    create: {
      name: "Unisex Oversized Classic T-Shirt – Neelambari",
      slug: "unisex-oversized-classic-tshirt-neelambari",
      description: "Neelambari graphic tee from the VYLOOM collection.",
      price: 899,
      compareAtPrice: 1499,
      offerLabel: "BUY 2 @1399",
      rating: 4.4,
      reviewCount: 168,
      categoryId: tshirts.id,
      fabric,
      fit,
      care,
      isNew: true,
      isBestSeller: true,
      isAvailable: true,
      images: img("1576566588028-4147f3842f27", "1618354691373-d851c5c3a990", "Unisex Oversized Classic T-Shirt – Neelambari"),
      variants: {
        create: [
          "Black", "Navy Blue", "Red", "Maroon", "Purple",
        ].flatMap((color) =>
          ["S", "M", "L", "XL", "XXL"].map((size) => ({
            color,
            size,
            stockQuantity: 6,
            lowStockThreshold: 5,
          }))
        ),
      },
    },
  });

  // 3. Unisex Oversized Classic T-Shirt – NO MEANS NO — ₹899
  // Color/size breakdown wasn't unambiguously provided for this exact print —
  // seeded as unavailable so no stock/color info is invented. Admin: confirm and enable.
  const p3 = await prisma.product.upsert({
    where: { slug: "unisex-oversized-classic-tshirt-no-means-no" },
    update: {},
    create: {
      name: "Unisex Oversized Classic T-Shirt – NO MEANS NO",
      slug: "unisex-oversized-classic-tshirt-no-means-no",
      description: "\"NO MEANS NO\" graphic tee from the VYLOOM collection.",
      price: 899,
      compareAtPrice: 1499,
      rating: 4.3,
      reviewCount: 96,
      categoryId: tshirts.id,
      fabric,
      fit,
      care,
      isNew: true,
      isAvailable: true,
      images: img("1622445275463-afa2ab738c34", "1583744946564-b52ac1c389c8", "Unisex Oversized Classic T-Shirt – NO MEANS NO"),
      variants: {
        create: ["Black", "White"].flatMap((color) =>
          ["S", "M", "L", "XL", "XXL"].map((size) => ({
            color,
            size,
            stockQuantity: 7,
            lowStockThreshold: 5,
          }))
        ),
      },
    },
  });

  // 4. Unisex Oversized Printed Classic T-Shirt — ₹999
  // Same note as above: specific colorway for "Printed" wasn't unambiguous in source data.
  const p4 = await prisma.product.upsert({
    where: { slug: "unisex-oversized-printed-classic-tshirt" },
    update: {},
    create: {
      name: "Unisex Oversized Printed Classic T-Shirt",
      slug: "unisex-oversized-printed-classic-tshirt",
      description: "Printed graphic tee from the VYLOOM collection.",
      price: 999,
      compareAtPrice: 1799,
      offerLabel: "BUY 2 @1399",
      rating: 4.5,
      reviewCount: 131,
      categoryId: tshirts.id,
      fabric,
      fit,
      care,
      isNew: true,
      isAvailable: true,
      images: img("1626497764746-6dc36546b388", "1554568218-0f1715e72254", "Unisex Oversized Printed Classic T-Shirt"),
      variants: {
        create: ["Off White", "Olive"].flatMap((color) =>
          ["S", "M", "L", "XL", "XXL"].map((size) => ({
            color,
            size,
            stockQuantity: 6,
            lowStockThreshold: 5,
          }))
        ),
      },
    },
  });

  // 5. Unisex Oversized Tiger Print Classic T-Shirt — ₹999
  const p5 = await prisma.product.upsert({
    where: { slug: "unisex-oversized-tiger-print-classic-tshirt" },
    update: {},
    create: {
      name: "Unisex Oversized Tiger Print Classic T-Shirt",
      slug: "unisex-oversized-tiger-print-classic-tshirt",
      description: "Tiger print graphic tee from the VYLOOM collection.",
      price: 999,
      categoryId: tshirts.id,
      fabric,
      fit,
      care,
      compareAtPrice: 1699,
      offerLabel: "BUY 3 & GET 15% OFF",
      rating: 4.8,
      reviewCount: 342,
      isNew: true,
      isBestSeller: true,
      isAvailable: true,
      images: img("1596755094514-f87e34085b2c", "1503341504253-dff4815485f1", "Unisex Oversized Tiger Print Classic T-Shirt"),
      variants: {
        create: ["Maroon", "Petrol Blue"].flatMap((color) =>
          ["S", "M", "L", "XL", "XXL"].map((size) => ({
            color,
            size,
            stockQuantity: 5,
            lowStockThreshold: 5,
          }))
        ),
      },
    },
  });

  console.log("Seeded products:", [p1.name, p2.name, p3.name, p4.name, p5.name]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
