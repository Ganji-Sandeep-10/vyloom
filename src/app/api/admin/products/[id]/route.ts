import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, variants: true, category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ product });
}

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  fabric: z.string().nullable().optional(),
  fit: z.string().nullable().optional(),
  care: z.string().nullable().optional(),
  isAvailable: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isLimited: z.boolean().optional(),
  hideStockCount: z.boolean().optional(),
  offerPrice: z.number().positive().nullable().optional(),
  offerStart: z.string().nullable().optional(),
  offerEnd: z.string().nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (data.offerStart) data.offerStart = new Date(data.offerStart as string);
  if (data.offerEnd) data.offerEnd = new Date(data.offerEnd as string);

  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ ok: true, product });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
