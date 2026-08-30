import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    paidOrders,
    lowStockVariants,
    outOfStockProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: "PENDING" } }),
    prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { total: true } }),
    prisma.productVariant.findMany({
      where: { stockQuantity: { gt: 0 } },
    }),
    prisma.product.count({ where: { isAvailable: false } }),
  ]);

  const revenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const lowStockCount = lowStockVariants.filter((v) => v.stockQuantity <= v.lowStockThreshold).length;

  const cards = [
    { label: "Total Products", value: totalProducts },
    { label: "Total Orders", value: totalOrders },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Revenue (Paid)", value: formatINR(revenue) },
    { label: "Low Stock Variants", value: lowStockCount },
    { label: "Out-of-Stock Products", value: outOfStockProducts },
  ];

  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-cream mb-8">
        Overview
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="border border-white/10 p-5">
            <p className="text-xs tracking-widest2 uppercase text-cream/50 mb-2">{c.label}</p>
            <p className="text-2xl font-semibold text-cream">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-electric text-ink text-xs tracking-widest2 uppercase font-semibold hover:bg-cream transition-colors"
        >
          + Add Product
        </Link>
        <Link
          href="/admin/orders"
          className="px-5 py-2.5 border border-white/15 text-cream text-xs tracking-widest2 uppercase hover:border-electric transition-colors"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
