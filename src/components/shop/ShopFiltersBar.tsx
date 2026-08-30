"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import type { Category } from "@prisma/client";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ShopFiltersBar({
  categories,
  current,
}: {
  categories: Category[];
  current: { [key: string]: string | undefined };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [local, setLocal] = useState(current);

  function apply(next: Record<string, string | undefined>) {
    const merged = { ...local, ...next };
    setLocal(merged);
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="space-y-8">
      <div>
        <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-3">Sort</h3>
        <select
          value={local.sort ?? "featured"}
          onChange={(e) => apply({ sort: e.target.value })}
          className="w-full bg-mist border border-stroke text-charcoal text-sm px-3 py-2 rounded-lg"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => apply({ category: undefined })}
            className={`block text-sm ${!local.category ? "text-orange" : "text-charcoal/70"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => apply({ category: c.slug })}
              className={`block text-sm ${local.category === c.slug ? "text-orange" : "text-charcoal/70"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => apply({ size: local.size === s ? undefined : s })}
              className={`w-9 h-9 text-xs border ${
                local.size === s ? "border-orange text-orange" : "border-stroke text-charcoal/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-3">Availability</h3>
        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input
            type="checkbox"
            checked={local.availability === "in-stock"}
            onChange={(e) => apply({ availability: e.target.checked ? "in-stock" : undefined })}
          />
          In stock only
        </label>
      </div>
    </aside>
  );
}
