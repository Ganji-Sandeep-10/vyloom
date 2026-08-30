import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { formatINR, discountPercent } from "@/lib/constants";
import type { Product, ProductImage, ProductVariant } from "@prisma/client";

type CardProduct = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
};

export default function ProductCard({ product }: { product: CardProduct }) {
  const totalStock = product.variants.reduce((s, v) => s + v.stockQuantity, 0);
  const outOfStock = totalStock === 0 || !product.isAvailable;
  const mainImage = product.images.find((i) => i.isMain) ?? product.images[0];
  const secondaryImage = product.images[1];

  const price = product.offerPrice ?? product.price;
  const compareAt = product.compareAtPrice ?? null;
  const off = discountPercent(price, compareAt);
  const rating = product.rating ?? null;

  return (
    <div className="group flex flex-col">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-mist overflow-hidden rounded-lg">
          {mainImage ? (
            <>
              <Image
                src={mainImage.url}
                alt={mainImage.alt ?? product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={`object-cover transition-opacity duration-500 ${
                  secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
                }`}
                style={{ transition: "transform 0.6s ease, opacity 0.4s ease" }}
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.alt ?? product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal/30 text-xs uppercase tracking-widest2">
              Image coming soon
            </div>
          )}

          {/* badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {product.isBestSeller && (
              <span className="bg-sand text-charcoal text-[10px] font-extrabold px-2 py-[3px] uppercase tracking-wide rounded-full">
                Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="bg-charcoal text-white text-[10px] font-extrabold px-2 py-[3px] uppercase tracking-wide rounded-full">
                New Arrival
              </span>
            )}
            {product.offerLabel && (
              <span className="bg-crimson text-white text-[10px] font-extrabold px-2 py-[3px] uppercase tracking-wide rounded-full">
                {product.offerLabel}
              </span>
            )}
            {outOfStock && (
              <span className="bg-white border border-charcoal/20 text-charcoal text-[10px] font-extrabold px-2 py-[3px] uppercase tracking-wide rounded-full">
                Sold Out
              </span>
            )}
          </div>

          {off !== null && (
            <span className="absolute top-2.5 right-2.5 bg-white/95 text-crimson text-[11px] font-extrabold px-2 py-[3px] rounded-full">
              {off}% OFF
            </span>
          )}
        </div>
      </Link>

      <div className="pt-2.5 flex flex-col gap-1.5 flex-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-[13px] leading-snug text-charcoal line-clamp-2 group-hover:text-orange transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-bold text-charcoal">{formatINR(price)}</span>
          {compareAt && (
            <span className="text-[12px] text-charcoal/40 line-through">{formatINR(compareAt)}</span>
          )}
          {off !== null && (
            <span className="text-[12px] font-bold text-crimson">{off}% off</span>
          )}
        </div>

        {rating !== null && (
          <div className="flex items-center gap-1 text-[12px] text-charcoal/70">
            <Star size={13} className="fill-gold text-gold" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-charcoal/40">({product.reviewCount})</span>
          </div>
        )}

        <Link
          href={`/product/${product.slug}`}
          className="mt-1.5 block text-center bg-charcoal text-white text-[11px] font-bold tracking-widest2 uppercase py-2.5 rounded-md hover:bg-orange transition-colors"
        >
          {outOfStock ? "View" : "Add to Cart"}
        </Link>
      </div>
    </div>
  );
}
