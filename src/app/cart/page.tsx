"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { formatINR, BRAND } from "@/lib/constants";

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeItem, loading } = useCart();

  if (lines.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 text-center">
        <h1 className="font-display font-black uppercase text-3xl tracking-tightest text-charcoal mb-4">
          Your Cart Is Empty
        </h1>
        <p className="text-charcoal/60 mb-8">Time to find something you&apos;ll wear on repeat.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-orange text-white text-xs tracking-widest2 uppercase font-semibold hover:bg-charcoal hover:text-white transition-colors rounded-md"
        >
          Shop New Drops
        </Link>
      </div>
    );
  }

  const shipping = 0; // free shipping on all prepaid orders
  const total = subtotal + shipping;

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <h1 className="font-display font-black uppercase text-3xl tracking-tightest text-charcoal mb-8">Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <div className="divide-y divide-stroke">
          {lines.map((line) => (
            <div key={line.id} className="flex gap-4 py-6">
              <div className="relative w-24 h-28 bg-mist flex-shrink-0">
                {line.image && (
                  <Image src={line.image} alt={line.name} fill className="object-cover" sizes="96px" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/product/${line.slug}`} className="text-sm text-charcoal hover:text-orange">
                    {line.name}
                  </Link>
                  <p className="text-xs text-charcoal/50 mt-1 uppercase tracking-wide">
                    {line.color} / {line.size}
                  </p>
                  <p className="text-sm text-charcoal mt-1">{formatINR(line.price)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-stroke">
                    <button
                      disabled={loading}
                      onClick={() => updateQuantity(line.id, Math.max(1, line.quantity - 1))}
                      className="w-8 h-8 text-charcoal/70 hover:text-orange"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <button
                      disabled={loading || line.quantity >= line.maxQuantity}
                      onClick={() => updateQuantity(line.id, line.quantity + 1)}
                      className="w-8 h-8 text-charcoal/70 hover:text-orange disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <button
                    disabled={loading}
                    onClick={() => removeItem(line.id)}
                    className="text-xs text-charcoal/50 hover:text-crimson uppercase tracking-wide"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-mist p-6 h-fit space-y-4">
          <div className="flex justify-between text-sm text-charcoal/70">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-charcoal/70">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-charcoal border-t border-stroke pt-4">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <p className="text-[11px] text-charcoal/40">{BRAND.freeShippingLine}</p>
          <Link
            href="/checkout"
            className="block text-center py-3 bg-orange text-white text-xs tracking-widest2 uppercase font-semibold hover:bg-charcoal hover:text-white transition-colors rounded-md"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
