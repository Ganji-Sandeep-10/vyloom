import { prisma } from "./prisma";

export const productInclude = {
  images: { orderBy: { position: "asc" as const } },
  variants: true,
  category: true,
};

export function totalStock(variants: { stockQuantity: number }[]): number {
  return variants.reduce((sum, v) => sum + v.stockQuantity, 0);
}

export function lowestLowStockThreshold(variants: { lowStockThreshold: number }[]): number {
  if (variants.length === 0) return 5;
  return Math.min(...variants.map((v) => v.lowStockThreshold));
}

export async function getNewDrops(limit = 8) {
  return prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: productInclude,
  });
}

export async function getBestSellers(limit = 8) {
  return prisma.product.findMany({
    where: { isAvailable: true, isBestSeller: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: productInclude,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string, limit = 4) {
  if (!categoryId) return [];
  return prisma.product.findMany({
    where: { categoryId, isAvailable: true, id: { not: excludeId } },
    take: limit,
    include: productInclude,
  });
}

export interface ShopFilters {
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: "in-stock" | "all";
  sort?: "featured" | "newest" | "price-asc" | "price-desc";
  page?: number;
  perPage?: number;
}

export async function getShopProducts(filters: ShopFilters) {
  const perPage = filters.perPage ?? 12;
  const page = filters.page ?? 1;

  const where: Record<string, unknown> = {};

  if (filters.category) {
    where.category = { slug: filters.category };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.availability === "in-stock") {
    where.isAvailable = true;
  }
  if (filters.size || filters.color) {
    where.variants = {
      some: {
        ...(filters.size ? { size: filters.size } : {}),
        ...(filters.color ? { color: filters.color } : {}),
      },
    };
  }

  const orderBy =
    filters.sort === "newest"
      ? { createdAt: "desc" as const }
      : filters.sort === "price-asc"
      ? { price: "asc" as const }
      : filters.sort === "price-desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const }; // "featured" default

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function searchProducts(query: string, limit = 20) {
  if (!query.trim()) return [];
  return prisma.product.findMany({
    where: {
      isAvailable: true,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
    },
    take: limit,
    include: productInclude,
  });
}
