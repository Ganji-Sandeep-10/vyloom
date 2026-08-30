import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const reorderSchema = z.object({
  imageId: z.string().min(1),
  action: z.enum(["setMain", "delete"]),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  if (parsed.data.action === "setMain") {
    await prisma.productImage.updateMany({ where: { productId: id }, data: { isMain: false } });
    await prisma.productImage.update({ where: { id: parsed.data.imageId }, data: { isMain: true } });
  } else {
    await prisma.productImage.delete({ where: { id: parsed.data.imageId } });
  }

  return NextResponse.json({ ok: true });
}
