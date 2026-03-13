# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── rumaan-store/       # RUMAAN ONLINE STORE React frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
│   └── src/seed.ts         # Database seed script
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## RUMAAN ONLINE STORE

A Pakistani e-commerce shopping website with:

### Features
- **Home Page**: Hero banner, category cards, featured product grid
- **Categories**: Mobile Phones, Gaming Accessories, Mobile Accessories, Deals
- **Category Pages**: Search + price range filter, product grid
- **Product Detail**: Images, PKR pricing, WhatsApp ordering, bank payment form
- **Reviews**: Star ratings, comments, photo uploads per product
- **Admin Panel** at `/admin`: Products, Orders, Reviews, Categories management
- **Contact Us Page**: Store contact information

### Ordering Rules
- **Deals category**: Image only, no price, no buttons
- **Mobile Phones / Gaming Accessories / Mobile Accessories**: BUY button (bank payment) + WhatsApp button
- **All other products**: WhatsApp order only

### Admin Panel
- Dashboard stats
- CRUD for Products, Categories
- View/manage Orders from payment form
- View/delete Reviews

## Database Schema

- `categories` — product categories with allowOnlinePurchase and showPrices flags
- `products` — products linked to categories, with price (numeric), featured, inStock, whatsappNumber
- `orders` — customer orders from bank payment form
- `reviews` — product reviews with star ratings, comments, image URLs array

## API Endpoints

- `GET/POST /api/products` — list/create products
- `GET/PUT/DELETE /api/products/:id` — single product CRUD
- `GET/POST /api/categories` — list/create categories
- `PUT/DELETE /api/categories/:id` — category CRUD
- `GET/POST /api/orders` — list/submit orders
- `GET/PUT /api/orders/:id` — get/update order
- `GET/POST /api/reviews` — list/submit reviews (filter by productId)
- `DELETE /api/reviews/:id` — delete review
- `GET /api/admin/stats` — dashboard stats

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`
- `pnpm --filter @workspace/scripts run seed` — seed the database with sample data
