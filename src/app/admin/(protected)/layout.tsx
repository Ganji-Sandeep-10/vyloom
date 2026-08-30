import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export const metadata = { title: "Admin | VYLOOM" };

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/newsletter", label: "Subscribers" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Login page itself renders without the guard/shell.
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ink flex">
      <aside className="w-56 border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="font-display font-black uppercase text-lg text-cream mb-8">
            VYLOOM <span className="text-electric">Admin</span>
          </div>
          <nav className="space-y-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block text-sm text-cream/70 hover:text-electric px-3 py-2 hover:bg-white/5 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-3">
          <Link href="/" className="block text-xs text-cream/40 hover:text-cream/70">
            ← Back to storefront
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
