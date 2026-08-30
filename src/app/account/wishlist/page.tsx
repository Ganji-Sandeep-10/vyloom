import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";

export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const wishlist = await prisma.wishlist.findUnique({ where: { userId: session.userId } });
  const items = wishlist
    ? await prisma.wishlistItem.findMany({
        where: { wishlistId: wishlist.id },
        include: { product: { include: { images: true, variants: true } } },
      })
    : [];

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <h1 className="font-display font-black uppercase text-3xl tracking-tightest text-charcoal mb-8">
        Wishlist
      </h1>

      {items.length === 0 ? (
        <p className="text-charcoal/60">Nothing saved yet — tap the heart on any product to add it here.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
