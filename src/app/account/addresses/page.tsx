import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const addresses = await prisma.address.findMany({ where: { userId: session.userId } });

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <h1 className="font-display font-black uppercase text-3xl tracking-tightest text-charcoal mb-8">
        Addresses
      </h1>

      {addresses.length === 0 ? (
        <p className="text-charcoal/60">No saved addresses yet. You can add one at checkout.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="border border-stroke p-5">
              <p className="text-sm text-charcoal mb-1">{a.fullName}</p>
              <p className="text-xs text-charcoal/60">
                {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} — {a.pincode}
              </p>
              <p className="text-xs text-charcoal/50 mt-2">{a.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
