import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/lib/cart-server";

async function assertOwnsLine(cartItemId: string) {
  const cart = await getOrCreateCart();
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { variant: true },
  });
  if (!item || item.cartId !== cart.id) return null;
  return item;
}

const patchSchema = z.object({ quantity: z.number().int().min(1) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await assertOwnsLine(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });

  const quantity = Math.min(parsed.data.quantity, item.variant.stockQuantity || 1);

  await prisma.cartItem.update({ where: { id }, data: { quantity } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await assertOwnsLine(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.cartItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
