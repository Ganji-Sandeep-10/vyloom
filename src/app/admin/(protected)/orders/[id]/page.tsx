import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/constants";
import OrderStatusControls from "@/components/admin/OrderStatusControls";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-cream mb-2">
        {order.orderNumber}
      </h1>
      <p className="text-cream/50 text-sm mb-8">
        Placed {new Date(order.createdAt).toLocaleString("en-IN")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xs tracking-widest2 uppercase text-cream/50 mb-3">Customer</h2>
          <p className="text-sm text-cream">{order.customerName}</p>
          <p className="text-sm text-cream/70">{order.customerEmail}</p>
          <p className="text-sm text-cream/70">{order.customerPhone}</p>
        </div>
        <div>
          <h2 className="text-xs tracking-widest2 uppercase text-cream/50 mb-3">Shipping Address</h2>
          <p className="text-sm text-cream/80">
            {order.addressLine1}
            {order.addressLine2 ? `, ${order.addressLine2}` : ""}
            <br />
            {order.city}, {order.state} — {order.pincode}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xs tracking-widest2 uppercase text-cream/50 mb-3">Items</h2>
        <div className="divide-y divide-white/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-3 text-sm">
              <span className="text-cream">
                {item.name}
                <span className="block text-xs text-cream/50 uppercase">
                  {item.color} / {item.size} × {item.quantity}
                </span>
              </span>
              <span className="text-cream/80">{formatINR(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-4 mt-4 space-y-1 text-sm">
          <div className="flex justify-between text-cream/60"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-cream/60"><span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span><span>-{formatINR(order.discount)}</span></div>
          )}
          <div className="flex justify-between text-cream/60"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span></div>
          <div className="flex justify-between text-cream font-semibold text-base pt-2"><span>Total</span><span>{formatINR(order.total)}</span></div>
        </div>
      </div>

      <OrderStatusControls
        orderId={order.id}
        orderStatus={order.orderStatus}
        paymentStatus={order.paymentStatus}
      />
    </div>
  );
}
