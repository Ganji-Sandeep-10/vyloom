import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getShopProducts } from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return { title: category.name };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const { items } = await getShopProducts({ category: slug, perPage: 24 });

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <h1 className="font-display font-black uppercase text-3xl md:text-4xl tracking-tightest text-charcoal mb-2">
        {category.name}
      </h1>
      <p className="text-charcoal/50 text-sm mb-10">{items.length} products</p>

      {items.length === 0 ? (
        <p className="text-charcoal/60">No products in this category yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
