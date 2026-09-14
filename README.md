# Phones Shop

Production-oriented smartphone e-commerce platform for an Iraqi retailer.

## Implemented now

- Next.js App Router + TypeScript
- Premium green/lime responsive storefront
- Search, filtering and sorting catalog
- Product detail pages with variants and technical specifications
- Persistent browser cart and up-to-four-phone comparison
- PostgreSQL + Prisma commerce schema
- Customer registration and login with hashed passwords and HTTP-only signed session cookies
- Customer account with recent database-backed orders
- Iraqi checkout flow with governorate, city, address, landmark and notes
- Cash on Delivery and Store Pickup modes
- Server-validated product pricing and stock during checkout
- Transactional inventory decrement when an order succeeds
- Order status history
- Protected admin dashboard
- Admin order status management
- Admin product creation and inventory overview
- Optional seeded admin account via environment variables
- GitHub Actions CI for Prisma generation, TypeScript checking and production builds

> All company identity, prices, stock values, product descriptions, warranty text and commercial policies are demonstration data and must be replaced before production launch.

## Local setup

1. Install Node.js 20+ and PostgreSQL.
2. Clone this repository.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Set `DATABASE_URL` to your PostgreSQL database.
6. Set a long random `AUTH_SECRET`.
7. Optionally set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` if you want the seed command to create an administrator.
8. Run `npm run db:generate`.
9. Run `npm run db:push`.
10. Run `npm run db:seed`.
11. Run `npm run dev`.
12. Open `http://localhost:3000`.

## Demo catalog

The temporary visual catalog is in `lib/demo-data.ts`. Matching database seed products are in `prisma/seed.ts`. This allows the UI to remain usable before final company data, photography and hosted infrastructure are supplied.

## Authentication

Passwords are never stored in plain text. The current implementation hashes passwords using Node's `scrypt`, then stores a signed HTTP-only session cookie. Admin pages and admin APIs verify the session role on the server.

The seed script does **not** hard-code an administrator password. Set these values locally before seeding if an admin account is required:

```env
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="use-a-strong-password"
```

## Checkout and order integrity

The browser sends product identity, requested variant information and quantity. The server resolves the matching product and variant from PostgreSQL and recalculates the price from the database instead of trusting browser-submitted totals. Inventory is decremented inside a Prisma transaction, and the order is rejected if stock changed before completion.

## Admin routes

- `/admin` — operational metrics and recent orders
- `/admin/products` — catalog and inventory overview
- `/admin/products/new` — create a product and first variant
- `/admin/orders` — manage order statuses

Admin routes require a signed-in user whose database role is `ADMIN`.

## Main customer routes

- `/` — homepage
- `/shop` — catalog/search/filtering
- `/phones/[slug]` — product details
- `/compare` — phone comparison
- `/cart` — cart
- `/checkout` — Iraqi checkout
- `/auth` — registration/sign-in
- `/account` — profile and recent orders

## Database

The Prisma schema models users, addresses, brands, categories, products, images, variants, specifications, cart entities, wishlists, reviews, orders, order items, status history, coupons, branches and editable homepage content.

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and pull requests. It installs dependencies, generates the Prisma client, runs TypeScript type checking and performs a production Next.js build.

## Remaining roadmap

1. Database-backed storefront catalog instead of the transitional demo-data file
2. Logged-in cart synchronization
3. Wishlist and recently viewed persistence
4. Product edit/delete workflows and richer variant management
5. Promotions/coupons and review moderation
6. Homepage CMS controls
7. Arabic translation and full RTL UI
8. Automated unit/E2E tests and accessibility QA
9. Production object storage for product media
10. Production deployment configuration and monitoring

## Security

Never commit `.env`, database credentials, authentication secrets, customer data or third-party API keys. Use `.env.example` only as a variable reference. Replace all demonstration values before launching the store for real customers.
