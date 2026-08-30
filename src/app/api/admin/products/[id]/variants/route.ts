import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  color: z.string().min(1),
  size: z.string().min(1),
  sku: z.string().optional(),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the fields." }, { status: 400 });

  const existing = await prisma.productVariant.findUnique({
    where: { productId_color_size: { productId: id, color: parsed.data.color, size: parsed.data.size } },
  });
  if (existing) {
    return NextResponse.json({ error: "This color/size combination already exists." }, { status: 409 });
  }

  const variant = await prisma.productVariant.create({ data: { productId: id, ...parsed.data } });

  // Re-enable product automatically if it now has stock again.
  await prisma.product.update({ where: { id }, data: { isAvailable: true } });

  return NextResponse.json({ ok: true, variant });
}
