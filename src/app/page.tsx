import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { getNewDrops, getBestSellers } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { BRAND } from "@/lib/constants";
import ProductCard from "@/components/shop/ProductCard";
import Reveal from "@/components/home/Reveal";
import NewsletterForm from "@/components/home/NewsletterForm";

const VALUES = [
  { icon: Truck, title: "FREE SHIPPING", body: "On all prepaid orders across India." },
  { icon: RefreshCw, title: "EASY RETURNS", body: "7-day easy returns & exchange." },
  { icon: ShieldCheck, title: "SECURE CHECKOUT", body: "100% safe & encrypted payments." },
  { icon: Sparkles, title: "PREMIUM COTTON", body: "240 GSM heavyweight, built to last." },
];

function SectionHeading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between mb-6 md:mb-8">
      <h2 className="font-display font-black uppercase text-2xl md:text-4xl tracking-tightest text-charcoal">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-[11px] font-bold tracking-widest2 uppercase text-charcoal/60 hover:text-orange whitespace-nowrap"
        >
          View All →
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [newDrops, bestSellers, categories] = await Promise.all([
    getNewDrops(8),
    getBestSellers(8),
    prisma.category.findMany(),
  ]);

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-charcoal text-white overflow-hidden min-h-[72vh] md:min-h-[80vh] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Left-anchored scrim: opaque behind the text, fading out to clear on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal from-15% via-charcoal/70 via-45% to-transparent to-75%" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal/70 to-transparent" />
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <p className="text-xs font-bold tracking-widest2 uppercase text-ember mb-5">
            {BRAND.tagline}
          </p>
          <h1 className="font-display font-black uppercase leading-[0.86] text-[16vw] sm:text-[13vw] md:text-[7.5vw] tracking-tightest drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]">
            Find Your
            <br />
            <span className="text-ember">Flip Side.</span>
          </h1>
          <p className="mt-6 text-white/85 text-base md:text-lg max-w-md leading-relaxed">
            Graphic oversized tees, printed shirts and heavyweight streetwear — made to stand apart.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange text-white text-[11px] tracking-widest2 uppercase font-bold hover:bg-ember transition-colors rounded-md"
            >
              Shop New Drops <ArrowRight size={14} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white text-[11px] tracking-widest2 uppercase font-bold hover:border-white hover:bg-white/10 transition-colors rounded-md"
            >
              All Products
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="border-b border-stroke bg-mist">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-stroke">
          {VALUES.map((v) => (
            <div key={v.title} className="flex items-center gap-3 py-5 px-3 md:px-6">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-white shrink-0">
                <v.icon size={18} className="text-orange" />
              </span>
              <div>
                <p className="text-[11px] font-bold tracking-widest2 uppercase text-charcoal">{v.title}</p>
                <p className="text-[11px] text-charcoal/55 mt-0.5">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR BESTSELLERS */}
      {bestSellers.length > 0 && (
        <Reveal>
          <section className="max-w-[1500px] mx-auto px-6 md:px-10 py-14">
            <SectionHeading title="Our Bestsellers" href="/shop?filter=best-sellers" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-9">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* CENTRE STAGE BANNER */}
      <Reveal>
        <section className="max-w-[1500px] mx-auto px-6 md:px-10 pb-14">
          <div className="group grid md:grid-cols-2 bg-charcoal text-white overflow-hidden rounded-2xl">
            {/* Image side */}
            <div className="relative min-h-[280px] md:min-h-[440px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80"
                alt="Centre Stage collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-charcoal via-charcoal/20 to-transparent" />
              <span className="absolute top-4 left-4 bg-crimson text-white text-[10px] font-extrabold tracking-widest2 uppercase px-3 py-1 rounded-full">
                New Season
              </span>
            </div>

            {/* Content side */}
            <div className="relative flex flex-col justify-center px-8 md:px-14 py-12 md:py-16">
              {/* oversized watermark numeral */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-6 right-4 md:right-8 font-display font-black text-[7rem] md:text-[11rem] leading-none text-white/[0.04] select-none"
              >
                01
              </span>

              <p className="relative text-[11px] font-bold tracking-widest2 uppercase text-ember mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-ember" />
                Centre Stage Collection
              </p>
              <h3 className="relative font-display font-black uppercase text-4xl md:text-6xl tracking-tightest leading-[0.9]">
                Prints that
                <br />
                <span className="text-ember">do the talking</span>
              </h3>
              <p className="relative mt-5 text-white/70 text-sm md:text-base max-w-sm leading-relaxed">
                Bold graphics, heavyweight cotton, and colourways you won&apos;t find anywhere else. The
                pieces people ask you about.
              </p>

              <div className="relative mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop?filter=best-sellers"
                  className="inline-flex items-center gap-2 bg-white text-charcoal px-7 py-3.5 text-[11px] font-bold tracking-widest2 uppercase hover:bg-ember hover:text-white transition-colors rounded-md"
                >
                  Explore the drop <ArrowRight size={14} />
                </Link>
                <span className="text-[12px] text-white/50 tracking-wide">
                  Starting <span className="text-white font-bold">₹799</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* TOP CATEGORIES */}
      {categories.length > 0 && (
        <Reveal>
          <section className="max-w-[1500px] mx-auto px-6 md:px-10 pb-14">
            <SectionHeading title="Top Categories" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="group relative aspect-[3/4] md:aspect-[4/5] bg-mist overflow-hidden flex items-end p-5 rounded-lg"
                >
                  {c.imageUrl && (
                    <Image
                      src={c.imageUrl}
                      alt={c.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent" />
                  <span className="relative z-10 font-display font-black uppercase text-xl md:text-2xl text-white tracking-tightest">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* NEW ARRIVALS */}
      <Reveal>
        <section className="bg-mist py-14">
          <div className="max-w-[1500px] mx-auto px-6 md:px-10">
            <SectionHeading title="New Arrivals" href="/shop?sort=newest" />
            {newDrops.length === 0 ? (
              <p className="text-charcoal/50 text-sm">New products are on the way — check back soon.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-9">
                {newDrops.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* ABOUT US */}
      <Reveal>
        <section className="max-w-[1500px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
            <div className="relative aspect-[5/4] rounded-2xl overflow-hidden bg-mist order-1 md:order-none">
              <Image
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80"
                alt={`${BRAND.name} apparel`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest2 uppercase text-orange mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-orange" />
                Our story
              </p>
              <h2 className="font-display font-black uppercase text-3xl md:text-5xl tracking-tightest text-charcoal leading-[0.92] mb-5">
                Built for the
                <br />
                <span className="text-orange">flip side of you</span>
              </h2>
              <p className="text-charcoal/70 text-sm md:text-base leading-relaxed mb-4">
                {BRAND.name} is a streetwear label built on graphic oversized tees, editorial prints and
                heavyweight 240 GSM cotton. Every piece is designed to feel like you — loud when you
                want it, clean when you don&apos;t.
              </p>
              <p className="text-charcoal/60 text-sm leading-relaxed mb-8">{BRAND.statement}</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-charcoal text-white text-[11px] tracking-widest2 uppercase font-bold hover:bg-orange transition-colors rounded-md"
              >
                Shop the full range <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* NEWSLETTER */}
      <Reveal>
        <section className="relative bg-charcoal text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1920&q=80"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/80 to-charcoal" />
          <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <p className="text-[11px] font-bold tracking-widest2 uppercase text-ember mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-ember" />
                Members get more
              </p>
              <h2 className="font-display font-black uppercase text-4xl md:text-5xl tracking-tightest leading-[0.9] mb-5">
                Join the
                <br />
                <span className="text-ember">VYLOOM club</span>
              </h2>
              <ul className="space-y-2.5 text-sm text-white/75">
                {[
                  "Early access to every new drop",
                  "Members-only offers & restock alerts",
                  "₹200 off your first order",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-ember shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:pl-6">
              <NewsletterForm />
              <p className="mt-3 text-[11px] text-white/40">
                No spam. Unsubscribe anytime. By subscribing you agree to receive marketing emails.
              </p>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
