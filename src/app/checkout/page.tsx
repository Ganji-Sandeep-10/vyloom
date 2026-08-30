"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { formatINR } from "@/lib/constants";

export default function CheckoutPage() {
  const { lines, subtotal, refresh } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 text-center">
        <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-charcoal mb-4">
          Nothing To Check Out
        </h1>
        <p className="text-charcoal/60">Add something to your cart first.</p>
      </div>
    );
  }

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      await refresh();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const total = subtotal;

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <h1 className="font-display font-black uppercase text-3xl tracking-tightest text-charcoal mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
          </div>
          <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} required />
          <Field label="Address Line 1" value={form.addressLine1} onChange={(v) => update("addressLine1", v)} required />
          <Field label="Address Line 2 (optional)" value={form.addressLine2} onChange={(v) => update("addressLine2", v)} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
            <Field label="State" value={form.state} onChange={(v) => update("state", v)} required />
            <Field label="Pincode" value={form.pincode} onChange={(v) => update("pincode", v)} required />
          </div>

          {error && <p className="text-sm text-crimson">{error}</p>}

          <div className="bg-mist border border-stroke p-4 text-xs text-charcoal/60 rounded-lg">
            Payment gateway isn&apos;t connected yet — this order is placed in test mode and no charge is
            made. Order status will show as Pending until payment integration goes live.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-orange text-white text-xs tracking-widest2 uppercase font-semibold hover:bg-charcoal hover:text-white transition-colors disabled:opacity-60 rounded-md"
          >
            {submitting ? "Placing Order…" : "Place Order (Test Mode)"}
          </button>
        </form>

        <div className="bg-mist p-6 h-fit space-y-4">
          <h2 className="text-xs tracking-widest2 uppercase text-charcoal/50">Order Summary</h2>
          <div className="divide-y divide-stroke">
            {lines.map((l) => (
              <div key={l.id} className="flex justify-between py-3 text-sm text-charcoal/80">
                <span>
                  {l.name} × {l.quantity}
                  <span className="block text-xs text-charcoal/40 uppercase">{l.color} / {l.size}</span>
                </span>
                <span>{formatINR(l.price * l.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-base font-semibold text-charcoal border-t border-stroke pt-4">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs tracking-widest2 uppercase text-charcoal/50 mb-2">{label}</span>
      <input
        type={type}
        required={required}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-mist border border-stroke focus:border-orange text-charcoal text-sm px-3 py-2.5 outline-none transition-colors rounded-md"
      />
    </label>
  );
}
