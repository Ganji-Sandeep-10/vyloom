import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/constants";

export const metadata = { title: "Orders" };

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { q, status } = await searchParams;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { orderNumber: { contains: q } },
      { customerName: { contains: q } },
      { customerEmail: { contains: q } },
    ];
  }
  if (status) where.orderStatus = status;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-cream mb-8">
        Orders
      </h1>

      <form className="flex flex-wrap gap-3 mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search order #, name, or email"
          className="bg-navy border border-white/15 focus:border-electric text-cream text-sm px-3 py-2 outline-none w-64"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="bg-navy border border-white/15 text-cream text-sm px-3 py-2 outline-none"
        >
          <option value="">All Statuses</option>
          {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 border border-white/15 text-cream text-xs uppercase hover:border-electric">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs tracking-widest2 uppercase text-cream/50 border-b border-white/10">
              <th className="py-3 pr-4">Order</th>
              <th className="py-3 pr-4">Customer</th>
              <th className="py-3 pr-4">Items</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Payment</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5">
                <td className="py-3 pr-4 text-cream">{o.orderNumber}</td>
                <td className="py-3 pr-4 text-cream/70">{o.customerName}</td>
                <td className="py-3 pr-4 text-cream/60">{o.items.length}</td>
                <td className="py-3 pr-4 text-cream/80">{formatINR(o.total)}</td>
                <td className="py-3 pr-4 text-cream/60">{o.paymentStatus}</td>
                <td className="py-3 pr-4 text-electric">{o.orderStatus}</td>
                <td className="py-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="text-electric text-xs hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-cream/50 text-sm py-8">No orders found.</p>}
      </div>
    </div>
  );
}
