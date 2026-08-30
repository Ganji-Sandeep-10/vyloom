import Link from "next/link";

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 text-center">
      <h1 className="font-display font-black uppercase text-3xl md:text-4xl tracking-tightest text-charcoal mb-4">
        Order Placed
      </h1>
      {order && <p className="text-charcoal/70 mb-2">Order number: <span className="text-orange">{order}</span></p>}
      <p className="text-charcoal/50 text-sm mb-8 max-w-md mx-auto">
        This order was placed in test mode — no payment has been charged. You&apos;ll be notified once
        payment is confirmed.
      </p>
      <Link
        href="/shop"
        className="inline-block px-6 py-3 bg-orange text-white text-xs tracking-widest2 uppercase font-semibold hover:bg-charcoal hover:text-white transition-colors rounded-md"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
