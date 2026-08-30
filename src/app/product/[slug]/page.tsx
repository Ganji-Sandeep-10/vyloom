import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import ProductPurchasePanel from "@/components/product/ProductPurchasePanel";
import ProductCard from "@/components/shop/ProductCard";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description ?? `${product.name} — ${BRAND.name}`,
    openGraph: {
      title: `${product.name} | ${BRAND.name}`,
      description: product.description ?? "",
      images: product.images[0] ? [product.images[0].url] : [],
    },
    alternates: { canonical: `/product/${product.slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.offerPrice ?? product.price,
      availability:
        product.variants.reduce((s, v) => s + v.stockQuantity, 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="grid grid-cols-2 gap-2">
          {product.images.length === 0 ? (
            <div className="col-span-2 aspect-square bg-mist flex items-center justify-center text-charcoal/30 text-xs uppercase tracking-widest2">
              Images coming soon
            </div>
          ) : (
            product.images.map((img, i) => (
              <div key={img.id} className={`relative aspect-square bg-mist ${i === 0 ? "col-span-2" : ""}`}>
                <Image
                  src={img.url}
                  alt={img.alt ?? product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))
          )}
        </div>

        <div>
          <h1 className="font-display font-black uppercase text-2xl md:text-3xl tracking-tightest text-charcoal mb-4">
            {product.name}
          </h1>

          <ProductPurchasePanel
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            variants={product.variants}
            hideStockCount={product.hideStockCount}
          />

          <div className="mt-10 space-y-6 border-t border-stroke pt-8">
            {product.description && (
              <div>
                <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-2">Description</h3>
                <p className="text-sm text-charcoal/70">{product.description}</p>
              </div>
            )}
            {product.fabric && (
              <div>
                <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-2">Fabric</h3>
                <p className="text-sm text-charcoal/70">{product.fabric}</p>
              </div>
            )}
            {product.fit && (
              <div>
                <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-2">Fit</h3>
                <p className="text-sm text-charcoal/70">{product.fit}</p>
              </div>
            )}
            {product.care && (
              <div>
                <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-2">Care</h3>
                <p className="text-sm text-charcoal/70">{product.care}</p>
              </div>
            )}
            <div>
              <h3 className="text-xs tracking-widest2 uppercase text-charcoal/50 mb-2">Shipping</h3>
              <p className="text-sm text-charcoal/70">{BRAND.freeShippingLine.toLowerCase()}.</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-display font-black uppercase text-2xl md:text-3xl tracking-tightest text-charcoal mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
