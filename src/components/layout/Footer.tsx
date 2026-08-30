import Link from "next/link";
import { AtSign, Send, Share2, ArrowUpRight } from "lucide-react";
import { BRAND } from "@/lib/constants";
import NewsletterForm from "@/components/home/NewsletterForm";

const PAYMENTS = ["VISA", "Mastercard", "UPI", "RuPay", "Paytm", "Amex"];

const COLS: { title: string; links: { label: string; href?: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "T-Shirts", href: "/category/t-shirts" },
      { label: "Oversized", href: "/category/oversized" },
      { label: "Hoodies", href: "/category/hoodies" },
      { label: "New Drops", href: "/shop?sort=newest" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Track Order", href: "/account/orders" },
      { label: "My Account", href: "/account" },
      { label: "Wishlist", href: "/account/wishlist" },
      { label: "Returns & Exchange" },
      { label: "Shipping Policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us" },
      { label: "Contact" },
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/80 mt-20">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-10 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          <div>
            <h3 className="font-display font-black uppercase text-2xl md:text-3xl tracking-tightest text-white leading-none">
              Get <span className="text-ember">₹200 off</span> your first order
            </h3>
            <p className="text-white/55 text-sm mt-2">
              Join the list for early access to drops, restock alerts and members-only offers.
            </p>
          </div>
          <div className="md:max-w-md md:ml-auto w-full">
            <NewsletterForm compact />
          </div>
        </div>
      </div>

      {/* Link grid */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-14 grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <div className="font-display font-black text-2xl uppercase text-white mb-3 tracking-tightest">
            {BRAND.name}
          </div>
          <p className="text-white/55 text-sm max-w-xs mb-5">{BRAND.statement}</p>
          <div className="flex items-center gap-2.5">
            {[
              { Icon: AtSign, label: "Instagram", href: BRAND.instagram },
              { Icon: Share2, label: "Share", href: "#" },
              { Icon: Send, label: "Contact", href: "#" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="grid place-items-center w-9 h-9 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-[11px] tracking-widest2 uppercase text-white/50 mb-4">{col.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <Link href={l.href} className="group inline-flex items-center gap-1 hover:text-orange transition-colors">
                      {l.label}
                      <ArrowUpRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ) : (
                    <span className="text-white/40">{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Payments */}
      <div className="border-t border-white/10">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest2 text-white/40 mr-2">We accept</span>
          {PAYMENTS.map((p) => (
            <span
              key={p}
              className="text-[10px] font-bold tracking-wide text-white/75 bg-white/5 border border-white/10 rounded-md px-2.5 py-1"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/10 py-5 px-6 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-white/40 tracking-wide">
        <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
        <span className="tracking-widest2 uppercase">{BRAND.tagline}</span>
      </div>
    </footer>
  );
}
