import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "./prisma";
import { getSession } from "./auth";

const GUEST_COOKIE = "vyloom_guest";

export async function getOrCreateCart() {
  const session = await getSession();

  if (session) {
    let cart = await prisma.cart.findUnique({ where: { userId: session.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: session.userId } });
    }
    return cart;
  }

  const cookieStore = await cookies();
  let guestId = cookieStore.get(GUEST_COOKIE)?.value;

  if (!guestId) {
    guestId = randomUUID();
    cookieStore.set(GUEST_COOKIE, guestId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60,
    });
  }

  let cart = await prisma.cart.findUnique({ where: { guestId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { guestId } });
  }
  return cart;
}

export async function getCartWithLines() {
  const cart = await getOrCreateCart();
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: {
      product: { include: { images: { orderBy: { position: "asc" } } } },
      variant: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const lines = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    name: item.product.name,
    slug: item.product.slug,
    color: item.variant.color,
    size: item.variant.size,
    price: item.product.offerPrice ?? item.product.price,
    quantity: item.quantity,
    image: item.product.images[0]?.url,
    maxQuantity: item.variant.stockQuantity,
  }));

  return { cart, lines };
}
