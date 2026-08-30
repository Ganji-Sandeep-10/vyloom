"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-32 text-center">
      <h1 className="font-display font-black uppercase text-3xl tracking-tightest text-charcoal mb-4">
        Something Went Wrong
      </h1>
      <p className="text-charcoal/60 mb-8">Please try again — if it keeps happening, come back later.</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-orange text-white text-xs tracking-widest2 uppercase font-semibold hover:bg-charcoal hover:text-white transition-colors rounded-md"
      >
        Try Again
      </button>
    </div>
  );
}
