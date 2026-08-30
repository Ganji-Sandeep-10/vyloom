import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/constants";

export const metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <h1 className="font-display font-black uppercase text-3xl tracking-tightest text-charcoal mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-charcoal/60 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="text-orange text-sm underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-stroke">
          {orders.map((order) => (
            <div key={order.id} className="py-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-charcoal">{order.orderNumber}</p>
                <p className="text-xs text-charcoal/50 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs uppercase tracking-wide text-orange">{order.orderStatus}</span>
                <span className="text-sm text-charcoal">{formatINR(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
