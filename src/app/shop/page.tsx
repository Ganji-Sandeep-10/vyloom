import { getShopProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import ShopFiltersBar from "@/components/shop/ShopFiltersBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shop" };

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams;

  const filters = {
    category: sp.category,
    size: sp.size,
    color: sp.color,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    availability: sp.availability === "in-stock" ? ("in-stock" as const) : undefined,
    sort: (sp.sort as "featured" | "newest" | "price-asc" | "price-desc") ?? "featured",
    page: sp.page ? Number(sp.page) : 1,
  };

  const [{ items, total, page, totalPages }, categories] = await Promise.all([
    getShopProducts(filters),
    prisma.category.findMany(),
  ]);

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <div className="mb-8">
        <h1 className="font-display font-black uppercase text-3xl md:text-4xl tracking-tightest text-charcoal">
          Shop
        </h1>
        <p className="text-charcoal/50 text-sm mt-2">{total} products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        <ShopFiltersBar categories={categories} current={sp} />

        <div>
          {items.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-charcoal/60 mb-2">No products match these filters.</p>
              <Link href="/shop" className="text-orange text-sm underline">
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const params = new URLSearchParams(sp as Record<string, string>);
                    params.set("page", String(p));
                    return (
                      <Link
                        key={p}
                        href={`/shop?${params.toString()}`}
                        className={`w-9 h-9 flex items-center justify-center text-sm border ${
                          p === page
                            ? "border-orange text-orange"
                            : "border-stroke text-charcoal/60 hover:border-charcoal/40"
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
