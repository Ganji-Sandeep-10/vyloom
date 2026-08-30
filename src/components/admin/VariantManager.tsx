"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductVariant } from "@prisma/client";

export default function VariantManager({
  productId,
  variants,
}: {
  productId: string;
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({ color: "", size: "", stockQuantity: "0", lowStockThreshold: "5" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function addVariant(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`/api/admin/products/${productId}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        color: form.color,
        size: form.size,
        stockQuantity: Number(form.stockQuantity),
        lowStockThreshold: Number(form.lowStockThreshold),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Couldn't add variant.");
      return;
    }
    setForm({ color: "", size: "", stockQuantity: "0", lowStockThreshold: "5" });
    router.refresh();
  }

  async function updateStock(id: string, stockQuantity: number) {
    setBusy(id);
    await fetch(`/api/admin/variants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQuantity }),
    });
    router.refresh();
    setBusy(null);
  }

  async function removeVariant(id: string) {
    if (!confirm("Remove this color/size combination?")) return;
    setBusy(id);
    await fetch(`/api/admin/variants/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(null);
  }

  return (
    <div>
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="text-left text-xs tracking-widest2 uppercase text-cream/50 border-b border-white/10">
            <th className="py-2 pr-4">Color</th>
            <th className="py-2 pr-4">Size</th>
            <th className="py-2 pr-4">Stock</th>
            <th className="py-2 pr-4">Low Stock At</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v.id} className="border-b border-white/5">
              <td className="py-2 pr-4 text-cream">{v.color}</td>
              <td className="py-2 pr-4 text-cream">{v.size}</td>
              <td className="py-2 pr-4">
                <input
                  type="number"
                  min={0}
                  defaultValue={v.stockQuantity}
                  disabled={busy === v.id}
                  onBlur={(e) => updateStock(v.id, Number(e.target.value))}
                  className="w-20 bg-navy border border-white/15 focus:border-electric text-cream text-sm px-2 py-1 outline-none"
                />
              </td>
              <td className="py-2 pr-4 text-cream/60">{v.lowStockThreshold}</td>
              <td className="py-2 text-right">
                <button onClick={() => removeVariant(v.id)} className="text-xs text-cream/50 hover:text-maroon">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={addVariant} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs tracking-widest2 uppercase text-cream/50 mb-1">Color</label>
          <input
            required
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className="w-28 bg-navy border border-white/15 focus:border-electric text-cream text-sm px-2 py-2 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest2 uppercase text-cream/50 mb-1">Size</label>
          <input
            required
            value={form.size}
            onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
            className="w-20 bg-navy border border-white/15 focus:border-electric text-cream text-sm px-2 py-2 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest2 uppercase text-cream/50 mb-1">Stock</label>
          <input
            type="number"
            min={0}
            value={form.stockQuantity}
            onChange={(e) => setForm((f) => ({ ...f, stockQuantity: e.target.value }))}
            className="w-20 bg-navy border border-white/15 focus:border-electric text-cream text-sm px-2 py-2 outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 border border-electric text-electric text-xs tracking-widest2 uppercase hover:bg-electric hover:text-ink transition-colors"
        >
          + Add Variant
        </button>
      </form>
      {error && <p className="text-sm text-maroon mt-2">{error}</p>}
    </div>
  );
}
