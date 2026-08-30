import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = { title: "Subscribers" };

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-cream mb-2">
        Newsletter Subscribers
      </h1>
      <p className="text-cream/50 text-sm mb-8">{subscribers.length} total</p>

      <div className="max-w-xl divide-y divide-white/5">
        {subscribers.map((s) => (
          <div key={s.id} className="py-2 flex justify-between text-sm">
            <span className="text-cream/80">{s.email}</span>
            <span className="text-cream/40 text-xs">
              {new Date(s.createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>
        ))}
        {subscribers.length === 0 && <p className="text-cream/50 text-sm py-4">No subscribers yet.</p>}
      </div>
    </div>
  );
}
