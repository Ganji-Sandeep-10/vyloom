import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();
  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-cream mb-8">
        Add Product
      </h1>
      <ProductForm categories={categories} />
      <p className="text-xs text-cream/40 mt-4 max-w-2xl">
        Save the product first, then add colors/sizes/stock and images from its edit page.
      </p>
    </div>
  );
}
