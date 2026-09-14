# Phones Shop

Production-oriented smartphone e-commerce platform for an Iraqi retailer.

## Current foundation

- Next.js + TypeScript
- Premium green/lime responsive storefront
- PostgreSQL + Prisma commerce schema
- Replaceable demo products and pricing
- Product variants, stock, orders, reviews, coupons and homepage CMS entities
- IQD formatting foundation
- Environment variable template

> All current company identity, prices, stock values, product descriptions and commercial policies are demonstration data and must be replaced before production launch.

## Local setup

1. Install Node.js 20+ and PostgreSQL.
2. Clone the repository.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Set `DATABASE_URL` to your PostgreSQL database.
6. Run `npm run db:generate`.
7. Run `npm run db:push`.
8. Run `npm run db:seed`.
9. Run `npm run dev`.
10. Open `http://localhost:3000`.

## Demo catalog

The temporary homepage catalog is located in `lib/demo-data.ts` so visual development can continue before a hosted database is connected. Database seed data is in `prisma/seed.ts`.

## Database

The Prisma schema currently models users, addresses, brands, categories, products, images, variants, specifications, stock fields, carts, wishlists, reviews, orders, order history, coupons, branches and editable homepage content.

## Planned implementation phases

1. Storefront foundation and design system
2. Product catalog and product details
3. Search, filtering and comparison
4. Functional cart and wishlist
5. Authentication and profiles
6. Checkout and persistent orders
7. Secure admin dashboard
8. Inventory, promotions and review moderation
9. Arabic/RTL and premium commerce features
10. Automated testing, responsive QA and deployment hardening

## Security

Never commit `.env`, database passwords, authentication secrets or third-party API keys. Use `.env.example` only as a variable reference.
