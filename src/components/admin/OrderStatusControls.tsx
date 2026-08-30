"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";

export default function OrderStatusControls({
  orderId,
  orderStatus,
  paymentStatus,
}: {
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function update(field: "orderStatus" | "paymentStatus", value: string) {
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md">
      <div>
        <label className="block text-xs tracking-widest2 uppercase text-cream/50 mb-2">Order Status</label>
        <select
          defaultValue={orderStatus}
          disabled={saving}
          onChange={(e) => update("orderStatus", e.target.value)}
          className="w-full bg-navy border border-white/15 focus:border-electric text-cream text-sm px-3 py-2 outline-none"
        >
          {ORDER_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs tracking-widest2 uppercase text-cream/50 mb-2">Payment Status</label>
        <select
          defaultValue={paymentStatus}
          disabled={saving}
          onChange={(e) => update("paymentStatus", e.target.value)}
          className="w-full bg-navy border border-white/15 focus:border-electric text-cream text-sm px-3 py-2 outline-none"
        >
          {PAYMENT_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
