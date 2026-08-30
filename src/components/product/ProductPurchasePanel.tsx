"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR, stockLabel } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";
import type { ProductVariant } from "@prisma/client";

export default function ProductPurchasePanel({
  price,
  compareAtPrice,
  variants,
  hideStockCount,
}: {
  price: number;
  compareAtPrice: number | null;
  variants: ProductVariant[];
  hideStockCount: boolean;
}) {
  const colors = useMemo(() => Array.from(new Set(variants.map((v) => v.color))), [variants]);
  const [color, setColor] = useState(colors[0] ?? "");
  const sizesForColor = useMemo(
    () => variants.filter((v) => v.color === color),
    [variants, color]
  );
  const [size, setSize] = useState(sizesForColor[0]?.size ?? "");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [adding, setAdding] = useState(false);

  const router = useRouter();
  const { addItem } = useCart();

  const selectedVariant = variants.find((v) => v.color === color && v.size === size);
  const stock = selectedVariant?.stockQuantity ?? 0;
  const status = stockLabel(stock, selectedVariant?.lowStockThreshold ?? 5, hideStockCount);
  const disabled = !selectedVariant || stock === 0;

  async function handleAdd(buyNow = false) {
    if (!selectedVariant) return;
    setAdding(true);
    setMessage(null);
    const res = await addItem(selectedVariant.id, quantity);
    setAdding(false);
    if (!res.ok) {
      setMessage({ text: res.message ?? "Couldn't add to cart.", error: true });
      return;
    }
    if (buyNow) {
      router.push("/checkout");
    } else {
      setMessage({ text: "Added to cart." });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold text-charcoal">{formatINR(price)}</span>
        {compareAtPrice && (
          <span className="text-base text-charcoal/40 line-through">{formatINR(compareAtPrice)}</span>
        )}
      </div>

      {colors.length > 0 && (
        <div>
          <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-2">Color: {color}</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  const first = variants.find((v) => v.color === c);
                  setSize(first?.size ?? "");
                  setQuantity(1);
                }}
                className={`px-3 py-2 text-xs border uppercase tracking-wide ${
                  color === c ? "border-orange text-orange" : "border-stroke text-charcoal/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizesForColor.length > 0 && (
        <div>
          <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizesForColor.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSize(v.size);
                  setQuantity(1);
                }}
                disabled={v.stockQuantity === 0}
                className={`w-11 h-11 text-xs border uppercase ${
                  size === v.size
                    ? "border-orange text-orange"
                    : v.stockQuantity === 0
                    ? "border-stroke text-charcoal/25 line-through cursor-not-allowed"
                    : "border-stroke text-charcoal/70"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${
            status.tone === "out" ? "text-crimson" : status.tone === "low" ? "text-orange" : "text-charcoal/50"
          }`}
        >
          {status.label}
        </p>
      </div>

      {!disabled && (
        <div className="flex items-center gap-3">
          <span className="text-xs tracking-widest2 uppercase text-charcoal/50">Qty</span>
          <div className="flex items-center border border-stroke">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 text-charcoal/70 hover:text-orange"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              className="w-9 h-9 text-charcoal/70 hover:text-orange"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleAdd(false)}
          disabled={disabled || adding}
          className="flex-1 py-3 text-xs tracking-widest2 uppercase font-semibold border border-orange text-orange hover:bg-orange hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-md"
        >
          {disabled ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
        </button>
        <button
          onClick={() => handleAdd(true)}
          disabled={disabled || adding}
          className="flex-1 py-3 text-xs tracking-widest2 uppercase font-semibold bg-orange text-white hover:bg-charcoal hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-md"
        >
          Buy Now
        </button>
      </div>

      {message && (
        <p className={`text-xs ${message.error ? "text-crimson" : "text-charcoal/60"}`}>{message.text}</p>
      )}
    </div>
  );
}
