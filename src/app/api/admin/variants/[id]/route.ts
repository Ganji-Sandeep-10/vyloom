import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  color: z.string().min(1).optional(),
  size: z.string().min(1).optional(),
  sku: z.string().nullable().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the fields." }, { status: 400 });

  const variant = await prisma.productVariant.update({ where: { id }, data: parsed.data });

  // If stock reaches 0 across all variants, auto-mark the product OUT OF STOCK.
  const siblingVariants = await prisma.productVariant.findMany({ where: { productId: variant.productId } });
  const totalStock = siblingVariants.reduce((s, v) => s + v.stockQuantity, 0);
  await prisma.product.update({
    where: { id: variant.productId },
    data: { isAvailable: totalStock > 0 },
  });

  return NextResponse.json({ ok: true, variant });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  await prisma.productVariant.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
