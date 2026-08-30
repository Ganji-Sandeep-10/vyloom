export const BRAND = {
  name: "VYLOOM",
  tagline: "WEAR YOUR STORY",
  statement: "Respectfully, your closet needs us.",
  instagram: "https://www.instagram.com/vyloom.in/",
  freeShippingLine: "FREE SHIPPING ON ALL PREPAID ORDERS",
} as const;

// Rotating announcement-bar messages (Veirdo-style promo strip).
export const ANNOUNCEMENTS = [
  "PREMIUM PUFF PRINT T-SHIRTS — BUY 2 @ ₹1399",
  "NEW: OVERSIZED DROPS — BUY 3 & GET 15% OFF",
  "FREE SHIPPING ON ALL PREPAID ORDERS",
  "PREPAID ORDERS SHIP ON PRIORITY",
] as const;

export function discountPercent(price: number, compareAt?: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export const ORDER_STATUS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export const PAYMENT_STATUS = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const DISCOUNT_TYPE = ["PERCENTAGE", "FIXED"] as const;
export type DiscountType = (typeof DISCOUNT_TYPE)[number];

export const USER_ROLE = ["CUSTOMER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLE)[number];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2XL"] as const;

export const LOW_STOCK_DEFAULT_THRESHOLD = 5;

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function stockLabel(quantity: number, lowStockThreshold: number, hide = false) {
  if (quantity <= 0) return { label: "OUT OF STOCK", tone: "out" as const };
  if (!hide && quantity <= lowStockThreshold) {
    return { label: `ONLY ${quantity} LEFT`, tone: "low" as const };
  }
  return { label: "IN STOCK", tone: "in" as const };
}
