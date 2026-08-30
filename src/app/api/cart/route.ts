import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart, getCartWithLines } from "@/lib/cart-server";

export async function GET() {
  const { lines } = await getCartWithLines();
  return NextResponse.json({ lines });
}

const addSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { variantId, quantity } = parsed.data;

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant || !variant.product.isAvailable) {
    return NextResponse.json({ error: "This product is not available." }, { status: 404 });
  }

  const cart = await getOrCreateCart();

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  const requestedTotal = (existing?.quantity ?? 0) + quantity;

  if (requestedTotal > variant.stockQuantity) {
    return NextResponse.json(
      {
        error:
          variant.stockQuantity === 0
            ? "This size/color is out of stock."
            : `Only ${variant.stockQuantity} left in stock.`,
      },
      { status: 409 }
    );
  }

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: requestedTotal },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: variant.productId, variantId, quantity },
    });
  }

  return NextResponse.json({ ok: true });
}
