# PrintnGift implementation plan

## Product goal

PrintnGift is a mobile-first gift commerce storefront for `printngift.store`. Customers
browse curated and personalized gifts, build a cart, submit delivery details, and finish
the conversation in WhatsApp. The merchant manages the catalog and incoming orders from
a protected CMS.

## Architecture

- Next.js 16 App Router and TypeScript, deployed as one Vercel project
- Tailwind CSS and generated shadcn/ui components with a consistent neo-brutalist theme
- Zustand persisted cart for a fast, account-free shopping flow
- MongoDB Atlas for products, categories, orders, site content, settings, and auth records
- Better Auth email/password sessions for the merchant CMS
- Native Next.js route handlers and server components; no separate backend deployment
- WhatsApp deep link generated only after the order has been validated and recorded

SQLite is intentionally not used because Vercel functions do not provide a persistent
writable filesystem.

## Included journeys

1. Landing page: hero, occasions, featured products, process, trust points, CTA
2. Shop: search, category filtering, sorting, responsive product grid
3. Product detail: gallery, personalization notes, quantity, add to cart
4. Cart and checkout: customer/address/message fields, totals, order creation, WhatsApp handoff
5. Supporting pages: about, contact, FAQ, shipping and policies
6. CMS: overview, product management, order queue/status management, content/settings guidance
7. SEO: metadata, sitemap, robots, semantic structure, readable product URLs

## Operational decisions

- Product image fields accept hosted image URLs. This avoids requiring a second upload service.
- Payment is coordinated in WhatsApp for v1. Online payments can be added later without
  changing the order model.
- Shipping is a configurable flat fee with a free-shipping threshold.
- Public pages use demo catalog data when Atlas is not configured, so local previews work.
- Production writes require `MONGODB_URI`; checkout returns a clear configuration error otherwise.

## Recommended follow-on features

- Cloudinary or UploadThing image uploads from CMS
- Razorpay payment links or full online payments
- Coupon codes, inventory reservations, delivery zones, and shipment tracking
- Customer accounts and order lookup
- Analytics events for product views, add-to-cart, checkout, and WhatsApp conversion
