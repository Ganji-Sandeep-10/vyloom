"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X, Zap } from "lucide-react";
import { BRAND, ANNOUNCEMENTS } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";

const NAV_LINKS = [
  { label: "NEW DROPS", href: "/shop?sort=newest" },
  { label: "T-SHIRTS", href: "/category/t-shirts" },
  { label: "OVERSIZED", href: "/category/oversized" },
  { label: "HOODIES", href: "/category/hoodies" },
  { label: "BEST SELLERS", href: "/shop?filter=best-sellers" },
  { label: "ALL PRODUCTS", href: "/shop" },
];

function AnnouncementBar() {
  // One continuous marquee: the message list is rendered twice back-to-back and
  // translated -50% so the loop is seamless. Pauses on hover.
  const track = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div className="group relative bg-charcoal text-white h-9 flex items-center overflow-hidden">
      <div className="flex shrink-0 min-w-full items-center whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
        {track.map((msg, idx) => (
          <span key={idx} className="flex items-center">
            <Zap size={11} className="mx-4 text-ember shrink-0" fill="currentColor" />
            <span className="text-[11px] font-semibold tracking-widest2 uppercase">{msg}</span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-charcoal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-charcoal to-transparent" />
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 28s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />

      <header
        className={`bg-white transition-shadow ${
          scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.08),0_6px_20px_-12px_rgba(0,0,0,0.25)]" : "border-b border-stroke"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 h-[62px] flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-charcoal p-2 -ml-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Open menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link
            href="/"
            className="font-display font-black text-2xl md:text-[26px] tracking-tightest uppercase text-charcoal shrink-0"
          >
            {BRAND.name}
          </Link>

          <nav className="hidden md:flex items-center gap-6 mx-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-semibold tracking-widest2 uppercase text-charcoal/80 hover:text-orange transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-5 ml-auto md:ml-0">
            <Link href="/search" aria-label="Search" className="text-charcoal/80 hover:text-orange transition-colors">
              <Search size={19} />
            </Link>
            <Link href="/account" aria-label="Account" className="hidden sm:block text-charcoal/80 hover:text-orange transition-colors">
              <User size={19} />
            </Link>
            <Link href="/account/wishlist" aria-label="Wishlist" className="hidden sm:block text-charcoal/80 hover:text-orange transition-colors">
              <Heart size={19} />
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative text-charcoal/80 hover:text-orange transition-colors">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden bg-white border-t border-stroke px-6 py-4 flex flex-col gap-4 rounded-lg">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold tracking-widest2 uppercase text-charcoal"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/account" onClick={() => setMenuOpen(false)} className="text-sm font-semibold tracking-widest2 uppercase text-charcoal/60 pt-2 border-t border-stroke">
              ACCOUNT
            </Link>
            <Link href="/account/wishlist" onClick={() => setMenuOpen(false)} className="text-sm font-semibold tracking-widest2 uppercase text-charcoal/60">
              WISHLIST
            </Link>
          </nav>
        )}
      </header>
    </div>
  );
}
