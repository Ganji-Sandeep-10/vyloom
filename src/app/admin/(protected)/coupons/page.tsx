"use client";

import { useEffect, useState } from "react";
import type { Coupon } from "@prisma/client";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumOrderValue: "",
    maximumDiscount: "",
    usageLimit: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minimumOrderValue: form.minimumOrderValue ? Number(form.minimumOrderValue) : null,
        maximumDiscount: form.maximumDiscount ? Number(form.maximumDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        isActive: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    setForm({ code: "", discountType: "PERCENTAGE", discountValue: "", minimumOrderValue: "", maximumDiscount: "", usageLimit: "" });
    load();
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-cream mb-8">
        Coupons
      </h1>

      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3 mb-10 max-w-3xl">
        <TextField label="Code" value={form.code} onChange={(v) => setForm((f) => ({ ...f, code: v.toUpperCase() }))} />
        <div>
          <label className="block text-xs tracking-widest2 uppercase text-cream/50 mb-1">Type</label>
          <select
            value={form.discountType}
            onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}
            className="bg-navy border border-white/15 text-cream text-sm px-2 py-2 outline-none"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed</option>
          </select>
        </div>
        <TextField label="Value" value={form.discountValue} onChange={(v) => setForm((f) => ({ ...f, discountValue: v }))} type="number" />
        <TextField label="Min Order (₹)" value={form.minimumOrderValue} onChange={(v) => setForm((f) => ({ ...f, minimumOrderValue: v }))} type="number" />
        <TextField label="Max Discount (₹)" value={form.maximumDiscount} onChange={(v) => setForm((f) => ({ ...f, maximumDiscount: v }))} type="number" />
        <TextField label="Usage Limit" value={form.usageLimit} onChange={(v) => setForm((f) => ({ ...f, usageLimit: v }))} type="number" />
        <button type="submit" className="px-4 py-2 bg-electric text-ink text-xs tracking-widest2 uppercase font-semibold hover:bg-cream transition-colors">
          + Add Coupon
        </button>
      </form>
      {error && <p className="text-sm text-maroon mb-4">{error}</p>}

      {loading ? (
        <p className="text-cream/50 text-sm">Loading…</p>
      ) : coupons.length === 0 ? (
        <p className="text-cream/50 text-sm">No coupons yet.</p>
      ) : (
        <table className="w-full text-sm max-w-3xl">
          <thead>
            <tr className="text-left text-xs tracking-widest2 uppercase text-cream/50 border-b border-white/10">
              <th className="py-2 pr-4">Code</th>
              <th className="py-2 pr-4">Discount</th>
              <th className="py-2 pr-4">Used</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-white/5">
                <td className="py-2 pr-4 text-cream">{c.code}</td>
                <td className="py-2 pr-4 text-cream/70">
                  {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                </td>
                <td className="py-2 pr-4 text-cream/60">
                  {c.usageCount}
                  {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                </td>
                <td className="py-2 pr-4">
                  <span className={c.isActive ? "text-electric" : "text-cream/40"}>
                    {c.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <button onClick={() => toggle(c.id, c.isActive)} className="text-xs text-electric hover:underline">
                    {c.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs tracking-widest2 uppercase text-cream/50 mb-1">{label}</label>
      <input
        type={type}
        required={label === "Code" || label === "Value"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 bg-navy border border-white/15 focus:border-electric text-cream text-sm px-2 py-2 outline-none"
      />
    </div>
  );
}
