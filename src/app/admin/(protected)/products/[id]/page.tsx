import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import VariantManager from "@/components/admin/VariantManager";
import ImageManager from "@/components/admin/ImageManager";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } }, variants: true },
    }),
    prisma.category.findMany(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-cream mb-8">
          Edit Product
        </h1>
        <ProductForm categories={categories} product={product} />
      </div>

      <div>
        <h2 className="text-sm tracking-widest2 uppercase text-cream/50 mb-4">
          Colors, Sizes &amp; Inventory
        </h2>
        <VariantManager productId={product.id} variants={product.variants} />
      </div>

      <div>
        <h2 className="text-sm tracking-widest2 uppercase text-cream/50 mb-4">Images</h2>
        <ImageManager productId={product.id} images={product.images} />
      </div>
    </div>
  );
}
