import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCartWithLines, getOrCreateCart } from "@/lib/cart-server";
import { getSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(4),
  couponCode: z.string().optional(),
});

function generateOrderNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `VYL-${rand}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  }

  const { lines } = await getCartWithLines();
  if (lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Re-validate stock at time of checkout to prevent overselling.
  for (const line of lines) {
    const variant = await prisma.productVariant.findUnique({ where: { id: line.variantId } });
    if (!variant || variant.stockQuantity < line.quantity) {
      return NextResponse.json(
        { error: `"${line.name}" (${line.color}/${line.size}) no longer has enough stock.` },
        { status: 409 }
      );
    }
  }

  let discount = 0;
  let appliedCoupon: string | null = null;
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);

  if (parsed.data.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: parsed.data.couponCode.toUpperCase() } });
    const now = new Date();
    if (
      coupon &&
      coupon.isActive &&
      (!coupon.startDate || coupon.startDate <= now) &&
      (!coupon.endDate || coupon.endDate >= now) &&
      (!coupon.minimumOrderValue || subtotal >= coupon.minimumOrderValue) &&
      (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit)
    ) {
      discount =
        coupon.discountType === "PERCENTAGE"
          ? (subtotal * coupon.discountValue) / 100
          : coupon.discountValue;
      if (coupon.maximumDiscount) discount = Math.min(discount, coupon.maximumDiscount);
      appliedCoupon = coupon.code;
      await prisma.coupon.update({ where: { id: coupon.id }, data: { usageCount: { increment: 1 } } });
    } else {
      return NextResponse.json({ error: "This coupon isn't valid." }, { status: 400 });
    }
  }

  const shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const session = await getSession();
  const cart = await getOrCreateCart();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.userId,
        customerName: parsed.data.name,
        customerEmail: parsed.data.email,
        customerPhone: parsed.data.phone,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2,
        city: parsed.data.city,
        state: parsed.data.state,
        pincode: parsed.data.pincode,
        subtotal,
        shipping,
        discount,
        total,
        couponCode: appliedCoupon,
        // Dev/test mode: no payment gateway configured yet.
        // Order is created as PENDING with no charge made.
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            name: l.name,
            color: l.color,
            size: l.size,
            price: l.price,
            quantity: l.quantity,
          })),
        },
      },
    });

    const touchedProductIds = new Set<string>();
    for (const line of lines) {
      await tx.productVariant.update({
        where: { id: line.variantId },
        data: { stockQuantity: { decrement: line.quantity } },
      });
      touchedProductIds.add(line.productId);
    }

    // Auto-mark a product OUT OF STOCK once every variant hits 0.
    for (const productId of Array.from(touchedProductIds)) {
      const variants = await tx.productVariant.findMany({ where: { productId } });
      const totalStock = variants.reduce((s, v) => s + v.stockQuantity, 0);
      if (totalStock <= 0) {
        await tx.product.update({ where: { id: productId }, data: { isAvailable: false } });
      }
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return created;
  });

  return NextResponse.json({ ok: true, orderNumber: order.orderNumber, orderId: order.id });
}
