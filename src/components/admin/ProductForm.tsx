"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@prisma/client";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    compareAtPrice: product?.compareAtPrice?.toString() ?? "",
    categoryId: product?.categoryId ?? "",
    sku: product?.sku ?? "",
    fabric: product?.fabric ?? "",
    fit: product?.fit ?? "",
    care: product?.care ?? "",
    isAvailable: product?.isAvailable ?? true,
    isNew: product?.isNew ?? false,
    isBestSeller: product?.isBestSeller ?? false,
    isLimited: product?.isLimited ?? false,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEdit);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      categoryId: form.categoryId || null,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      if (isEdit) {
        router.refresh();
      } else {
        router.push(`/admin/products/${data.product.id}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    router.push("/admin/products");
  }

  async function onDuplicate() {
    if (!product) return;
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        name: `${form.name} (Copy)`,
        slug: `${form.slug}-copy-${Date.now()}`,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        categoryId: form.categoryId || null,
        isAvailable: false,
      }),
    });
    const data = await res.json();
    if (res.ok) router.push(`/admin/products/${data.product.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={(e) => {
              update("name", e.target.value);
              if (!slugTouched) update("slug", slugify(e.target.value));
            }}
            className="input"
          />
        </Field>
        <Field label="Slug">
          <input
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", e.target.value);
            }}
            className="input"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Price (₹)">
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Compare-at Price (₹)">
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.compareAtPrice}
            onChange={(e) => update("compareAtPrice", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="SKU">
          <input value={form.sku} onChange={(e) => update("sku", e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="Category">
        <select
          value={form.categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
          className="input"
        >
          <option value="">None</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Fabric">
          <input value={form.fabric} onChange={(e) => update("fabric", e.target.value)} className="input" />
        </Field>
        <Field label="Fit">
          <input value={form.fit} onChange={(e) => update("fit", e.target.value)} className="input" />
        </Field>
        <Field label="Care">
          <input value={form.care} onChange={(e) => update("care", e.target.value)} className="input" />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <Checkbox label="Enabled (live on storefront)" checked={form.isAvailable} onChange={(v) => update("isAvailable", v)} />
        <Checkbox label="New" checked={form.isNew} onChange={(v) => update("isNew", v)} />
        <Checkbox label="Best Seller" checked={form.isBestSeller} onChange={(v) => update("isBestSeller", v)} />
        <Checkbox label="Limited" checked={form.isLimited} onChange={(v) => update("isLimited", v)} />
      </div>

      {error && <p className="text-sm text-maroon">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-electric text-ink text-xs tracking-widest2 uppercase font-semibold hover:bg-cream transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
        {isEdit && (
          <>
            <button type="button" onClick={onDuplicate} className="text-xs tracking-widest2 uppercase text-cream/60 hover:text-electric">
              Duplicate
            </button>
            <button type="button" onClick={onDelete} className="text-xs tracking-widest2 uppercase text-cream/60 hover:text-maroon">
              Delete
            </button>
          </>
        )}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          background: #0f1530;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f2ecdd;
          font-size: 0.875rem;
          padding: 0.6rem 0.75rem;
          outline: none;
        }
        .input:focus {
          border-color: #3e5bff;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs tracking-widest2 uppercase text-cream/50 mb-2">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-cream/70">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
