import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { variants: true, category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-cream">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-electric text-ink text-xs tracking-widest2 uppercase font-semibold hover:bg-cream transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs tracking-widest2 uppercase text-cream/50 border-b border-white/10">
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Price</th>
              <th className="py-3 pr-4">Stock</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Badges</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stockQuantity, 0);
              return (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-cream">{p.name}</td>
                  <td className="py-3 pr-4 text-cream/60">{p.category?.name ?? "—"}</td>
                  <td className="py-3 pr-4 text-cream/80">{formatINR(p.price)}</td>
                  <td className="py-3 pr-4 text-cream/80">{stock}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs uppercase tracking-wide ${
                        p.isAvailable ? "text-electric" : "text-maroon"
                      }`}
                    >
                      {p.isAvailable ? "Live" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-cream/50 text-xs">
                    {[p.isNew && "New", p.isBestSeller && "Best Seller", p.isLimited && "Limited"]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>
                  <td className="py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-electric text-xs hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
