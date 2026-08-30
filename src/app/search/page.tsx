"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import type { Product, ProductImage, ProductVariant } from "@prisma/client";

type ResultProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 text-charcoal/50 text-sm">Loading…</div>}>
      <SearchInner />
    </Suspense>
  );
}

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [results, setResults] = useState<ResultProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = params.get("q") ?? "";
    if (!q) return;
    setQuery(q);
    runSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.results ?? []);
    setLoading(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query)}`);
    runSearch(query);
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <form onSubmit={onSubmit} className="max-w-xl mb-12">
        <div className="flex items-center border border-stroke focus-within:border-orange transition-colors rounded-md">
          <Search size={16} className="ml-4 text-charcoal/40" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent px-3 py-3 text-sm text-charcoal outline-none"
          />
        </div>
      </form>

      {loading && <p className="text-charcoal/50 text-sm">Searching…</p>}

      {!loading && searched && results.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-charcoal/60 mb-2">No results for &ldquo;{params.get("q")}&rdquo;.</p>
          <p className="text-charcoal/40 text-sm">Try a different name, category, or tag.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
