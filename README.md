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
2. Add the following variables in Vercel project settings for Production, Preview,
   and Development:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=printngift
BETTER_AUTH_SECRET=YOUR_RANDOM_SECRET
BETTER_AUTH_URL=https://www.printngift.store
NEXT_PUBLIC_SITE_URL=https://www.printngift.store
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
ADMIN_EMAIL=owner@printngift.store
```

Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`. The WhatsApp number must
include the country code and contain digits only, without `+`, spaces, or dashes.
`ADMIN_EMAIL` is the only email address allowed to register. The admin password is chosen
when creating the account and is not stored as an environment variable.

3. Add both domains in Vercel and keep `www.printngift.store` as Production. Configure
   `printngift.store` to redirect to `www.printngift.store`.
4. Run the seed command locally against the production Atlas database once.
5. Create the owner account against the production URL once:

```bash
curl -X POST https://www.printngift.store/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"PrintnGift Owner","email":"owner@printngift.store","password":"YOUR_STRONG_PASSWORD"}'
```

Keep `ADMIN_EMAIL` set in production; it prevents other email addresses from creating
merchant accounts.

## Product images

The CMS accepts hosted image URLs to avoid adding a second deployment dependency. Add
additional image hostnames to `next.config.ts` when needed. Cloudinary or UploadThing can
be added later for direct CMS uploads.
