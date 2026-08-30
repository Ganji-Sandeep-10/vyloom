import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function getOrCreateWishlist(userId: string) {
  let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) wishlist = await prisma.wishlist.create({ data: { userId } });
  return wishlist;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ items: [] });

  const wishlist = await getOrCreateWishlist(session.userId);
  const items = await prisma.wishlistItem.findMany({
    where: { wishlistId: wishlist.id },
    include: { product: { include: { images: true, variants: true } } },
  });
  return NextResponse.json({ items });
}

const schema = z.object({ productId: z.string().min(1), variantId: z.string().optional() });

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Log in to save items." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const wishlist = await getOrCreateWishlist(session.userId);

  const existing = await prisma.wishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      productId: parsed.data.productId,
      variantId: parsed.data.variantId ?? null,
    },
  });

  if (!existing) {
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: parsed.data.productId,
        variantId: parsed.data.variantId,
      },
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Log in required." }, { status: 401 });

  const { itemId } = await req.json().catch(() => ({ itemId: null }));
  if (!itemId) return NextResponse.json({ error: "Missing item." }, { status: 400 });

  const wishlist = await getOrCreateWishlist(session.userId);
  await prisma.wishlistItem.deleteMany({ where: { id: itemId, wishlistId: wishlist.id } });

  return NextResponse.json({ ok: true });
}
