# MercDeal E-commerce Setup

## Implementováno

### Backend (Supabase)
- [x] Databázové schéma s 11 tabulkami
- [x] Full-text search na produktech
- [x] RLS policies pro bezpečnost
- [x] Storage buckety pro obrázky
- [x] Trigger pro automatické vytvoření profilu

### Autentizace
- [x] Login/Register stránky s Zod validací
- [x] AuthProvider context
- [x] Middleware pro ochranu /admin a /ucet
- [x] Auth callback pro email verifikaci

### Produkty
- [x] ProductGrid s filtry (kategorie, cena, model)
- [x] ProductDetail s galerií
- [x] Debounced search (400ms)
- [x] Full-text search v PostgreSQL

### Košík & Objednávky
- [x] Zustand store s persistencí
- [x] Checkout flow s Zod validací
- [x] Podpora dobírka/bankovní převod

### Admin Panel
- [x] Dashboard se statistikami
- [x] CRUD produkty s image uploadem
- [x] Správa objednávek
- [x] Status management

### SEO & Tracking
- [x] Metadata API
- [x] Dynamický sitemap.ts
- [x] Meta Pixel integrace
- [x] JSON-LD structured data

---

## Setup Instructions

### 1. Supabase Configuration

1. Jdi do Supabase Dashboard: https://supabase.com/dashboard/project/pggdimzpauivnfugsuxn/settings/api

2. Zkopíruj `anon` public key

3. Vytvoř `.env.local` soubor:
```bash
cp .env.local.example .env.local
```

4. Vyplň klíče v `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://pggdimzpauivnfugsuxn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Migrations

Spusť SQL migrace v Supabase SQL Editor (https://supabase.com/dashboard/project/pggdimzpauivnfugsuxn/sql):

1. `supabase/migrations/001_initial_schema.sql` - Vytvoří tabulky
2. `supabase/migrations/002_rls_policies.sql` - Nastaví RLS
3. `supabase/migrations/003_seed_data.sql` - Přidá demo data
4. `supabase/migrations/004_storage.sql` - Vytvoří storage buckety

### 3. Admin Role

Po registraci prvního uživatele nastav admin roli v SQL:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'tvuj@email.cz';
```

### 4. Meta Pixel (Volitelné)

Přidej do `.env.local`:
```
NEXT_PUBLIC_META_PIXEL_ID=your-pixel-id
```

---

## Struktura Projektu

```
app/
├── (auth)/
│   ├── prihlaseni/page.tsx
│   └── registrace/page.tsx
├── (shop)/
│   ├── produkty/page.tsx
│   ├── produkty/[slug]/page.tsx
│   ├── kosik/page.tsx
│   ├── pokladna/page.tsx
│   └── ucet/page.tsx
├── admin/
│   ├── page.tsx (dashboard)
│   ├── produkty/page.tsx
│   └── objednavky/page.tsx
├── api/auth/callback/route.ts
└── sitemap.ts

lib/
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
└── hooks/
    ├── useDebounce.ts
    └── useCart.ts

components/
├── providers/AuthProvider.tsx
├── products/
│   ├── SearchInput.tsx
│   ├── ProductGrid.tsx
│   ├── ProductFilters.tsx
│   ├── ProductGallery.tsx
│   └── AddToCartButton.tsx
└── seo/MetaPixel.tsx
```

---

## Spuštění

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

---

## Poznámky

- Middleware zobrazuje warning o deprecated `middleware` - toto je jen upozornění pro Next.js 17+
- Při build bez env vars se použije mock client
- Pro produkci je nutné nastavit `.env.local` s reálnými klíči
