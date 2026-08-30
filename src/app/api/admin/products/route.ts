import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true, variants: true, category: true },
  });
  return NextResponse.json({ products });
}

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  sku: z.string().optional(),
  fabric: z.string().optional(),
  fit: z.string().optional(),
  care: z.string().optional(),
  isAvailable: z.boolean().default(true),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isLimited: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields.", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json({ ok: true, product });
}
