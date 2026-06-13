# PrintnGift

Modern gift commerce storefront and merchant CMS for
[printngift.store](https://printngift.store).

## What is included

- Neo-brutalist responsive landing page, shop, product pages, cart, and checkout
- Server-validated order totals and WhatsApp checkout handoff
- MongoDB Atlas persistence for catalog, settings, auth, and orders
- Better Auth protected merchant CMS
- CMS overview, product creation, order status queue, and store settings
- SEO metadata, sitemap, robots, support pages, and demo data fallback

See [PLAN.md](./PLAN.md) for the architecture and full product scope.

## Local setup

1. Create a free MongoDB Atlas cluster and copy the connection string.
2. Copy `.env.example` to `.env.local` and fill every value.
3. Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.
4. Install and seed:

```bash
npm install
set -a && source .env.local && set +a
npm run seed
npm run dev
```

5. Create the merchant account once. Registration is restricted to `ADMIN_EMAIL`:

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"PrintnGift Owner","email":"owner@printngift.store","password":"YOUR_STRONG_PASSWORD"}'
```

Then sign in at `http://localhost:3000/admin`.

Without `MONGODB_URI`, public pages use demo catalog data for design preview. The CMS
requires Atlas. Demo checkout opens WhatsApp but does not persist the order.

## Vercel deployment

1. Push the repository to GitHub and import it into Vercel.
2. Add all `.env.example` variables in Vercel project settings.
3. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to `https://printngift.store`.
4. Add both `printngift.store` and `www.printngift.store` in Vercel Domains.
5. Run the seed command locally against the production Atlas database once.
6. Create the owner account against the production URL once:

```bash
curl -X POST https://printngift.store/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"PrintnGift Owner","email":"owner@printngift.store","password":"YOUR_STRONG_PASSWORD"}'
```

Keep `ADMIN_EMAIL` set in production; it prevents other email addresses from creating
merchant accounts.

## Product images

The CMS accepts hosted image URLs to avoid adding a second deployment dependency. Add
additional image hostnames to `next.config.ts` when needed. Cloudinary or UploadThing can
be added later for direct CMS uploads.
