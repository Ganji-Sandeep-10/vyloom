import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/auth/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <h1 className="font-display font-black uppercase text-3xl tracking-tightest text-charcoal mb-2">
        My Account
      </h1>
      <p className="text-charcoal/60 mb-10">Welcome back, {user.name}.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mb-10">
        <Link href="/account/orders" className="border border-stroke p-6 hover:border-orange transition-colors">
          <h3 className="text-sm text-charcoal mb-1">Orders</h3>
          <p className="text-xs text-charcoal/50">Track and view past orders</p>
        </Link>
        <Link href="/account/wishlist" className="border border-stroke p-6 hover:border-orange transition-colors">
          <h3 className="text-sm text-charcoal mb-1">Wishlist</h3>
          <p className="text-xs text-charcoal/50">Items you&apos;ve saved</p>
        </Link>
        <Link href="/account/addresses" className="border border-stroke p-6 hover:border-orange transition-colors">
          <h3 className="text-sm text-charcoal mb-1">Addresses</h3>
          <p className="text-xs text-charcoal/50">Manage shipping addresses</p>
        </Link>
      </div>

      <LogoutButton />
    </div>
  );
}
