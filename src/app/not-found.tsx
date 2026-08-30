import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-32 text-center">
      <h1 className="font-display font-black uppercase text-5xl tracking-tightest text-charcoal mb-4">
        404
      </h1>
      <p className="text-charcoal/60 mb-8">This page doesn&apos;t exist — but your next favorite tee might.</p>
      <Link
        href="/shop"
        className="inline-block px-6 py-3 bg-orange text-white text-xs tracking-widest2 uppercase font-semibold hover:bg-charcoal hover:text-white transition-colors rounded-md"
      >
        Shop VYLOOM
      </Link>
    </div>
  );
}
