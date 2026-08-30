# VYLOOM — E-commerce Website

A full-stack Next.js 14 + TypeScript + Prisma streetwear storefront for VYLOOM: customer storefront,
cart, checkout (test mode), auth, wishlist, orders, and a full admin dashboard for
products/inventory/orders/coupons.

## 1. Requirements

- Node.js 18.18+ (20 LTS recommended)
- A PostgreSQL database for production (Neon, Supabase, Railway, RDS, etc. all work)

## 2. First-time setup

```bash
cd vyloom
npm install
```

### Local development (SQLite, zero setup)

The project ships configured for **SQLite** in `prisma/schema.prisma` so you can run it immediately
with no external database:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed        # loads your 5 real VYLOOM products + an admin user
npm run dev
```

Visit http://localhost:3000 for the storefront and http://localhost:3000/admin/login for the admin
dashboard.

**Default admin login (change this immediately):**
- Email: `admin@vyloom.in`
- Password: `ChangeMe123!`

### Moving to PostgreSQL for production

1. Open `prisma/schema.prisma` and change the datasource block to:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` in `.env` (or your host's environment variables) to your Postgres connection
   string.
3. Run:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npm run db:seed   # optional — only if the DB is empty
   ```

## 3. Environment variables

| Variable      | Description                                              |
|---------------|-----------------------------------------------------------|
| `DATABASE_URL`| Postgres (prod) or `file:./dev.db` (local SQLite)          |
| `JWT_SECRET`  | Long random string used to sign session cookies — **change this before going live** |

## 4. What's built

**Storefront:** editorial homepage, shop with filters/sort/pagination, category pages, search,
product detail pages with color/size variant selection and real-time stock states, persistent cart
(guest + logged-in), checkout, order confirmation, customer accounts (orders, wishlist, addresses),
newsletter signup.

**Admin dashboard** (`/admin`, protected, admin-role only):
- Overview: product/order counts, revenue, low-stock and out-of-stock alerts
- Products: create/edit/duplicate/delete, badges (New/Best Seller/Limited), enable/disable
- Inventory: per-color/size stock, low-stock threshold, auto out-of-stock when stock hits 0
- Images: multi-upload, set main image, delete
- Orders: search/filter, view details, update order + payment status
- Coupons: create percentage/fixed coupons with usage limits, min order value, max discount cap
- Newsletter: view subscriber list

**Checkout / payments:** checkout runs in **test/dev mode** — orders are created with
`paymentStatus: PENDING` and no charge is made. The `Order` model already has the fields a real
gateway integration needs; wiring in Razorpay/Stripe/etc. means adding a payment-intent step before
order creation in `src/app/api/checkout/route.ts` and flipping `paymentStatus` to `PAID` on a
verified webhook — the architecture doesn't need to change.

**Product data honesty note:** Only the 5 products and details actually provided in your source
files were seeded. Two of them ("NO MEANS NO" and "Printed Classic") were seeded as **disabled**
because their exact color/size/stock breakdown wasn't unambiguous in the source — nothing was
invented. Go to `/admin/products`, open each, add the real variants, and enable them.

## 5. Known limitations to review before launch

- **Payment gateway**: not connected yet (by design) — see above.
- **Image storage**: admin image uploads currently save to `/public/uploads/products` on the
  server's local disk. This works for a single-server deploy but **will not persist on serverless
  platforms** (Vercel, etc. wipe the filesystem between deploys/instances). For production on
  serverless, swap the upload handler in `src/app/api/admin/upload/route.ts` for a cloud storage
  provider (S3, Cloudflare R2, Vercel Blob, Cloudinary) — the rest of the app only cares about the
  resulting URL.
- **Email**: no transactional email (order confirmation, password reset) is wired up yet — "Forgot
  password" isn't implemented on the backend, only login/register.
- **Coupons at checkout**: the checkout API supports a `couponCode`, but there's no coupon input
  field in the checkout UI yet — add one if you want customers to redeem codes at checkout.
- **Verification note**: this project was built in a sandboxed environment whose network couldn't
  reach Prisma's binary-engine host, so `prisma generate` / `npm run build` could not be run
  end-to-end there. The code was type-checked and linted as far as possible without the generated
  client (all non-Prisma-related errors are fixed — 0 ESLint errors). Run `npx prisma generate`
  first, then `npm run build`, and fix anything that surfaces; standard Next.js/Prisma code like
  this should build cleanly, but please verify on your machine before deploying.

## 6. Project structure

```
src/
  app/            Next.js App Router pages + API routes
    admin/(protected)/   Admin dashboard pages (guarded)
    admin/login/         Admin login (unguarded)
    api/                 All backend logic — cart, checkout, auth, admin CRUD
  components/     Reusable UI, grouped by domain (shop, product, cart, admin, auth, layout)
  lib/            Prisma client, auth helpers, cart resolution, product queries, constants
prisma/
  schema.prisma   Full data model
  seed.ts         Your real product data
```

## 7. Build for production

```bash
npm run build
npm start
```
