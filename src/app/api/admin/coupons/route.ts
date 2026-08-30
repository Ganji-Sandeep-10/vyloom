import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { DISCOUNT_TYPE } from "@/lib/constants";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

const schema = z.object({
  code: z.string().min(1),
  discountType: z.enum(DISCOUNT_TYPE),
  discountValue: z.number().positive(),
  minimumOrderValue: z.number().min(0).optional().nullable(),
  maximumDiscount: z.number().min(0).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the fields." }, { status: 400 });

  const code = parsed.data.code.toUpperCase().trim();
  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });

  const coupon = await prisma.coupon.create({
    data: {
      ...parsed.data,
      code,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    },
  });

  return NextResponse.json({ ok: true, coupon });
}
