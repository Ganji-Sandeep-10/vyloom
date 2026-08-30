import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import SiteChrome from "@/components/layout/SiteChrome";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: "VYLOOM — premium streetwear. Graphic oversized tees and more. Wear your story.",
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: "Premium streetwear. Wear your story.",
    siteName: BRAND.name,
    type: "website",
  },
  metadataBase: new URL("https://vyloom.in"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-body bg-paper text-charcoal min-h-screen flex flex-col">
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
