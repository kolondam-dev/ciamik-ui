# @ciamik/ui

> Design System Library untuk ciamik.id — React + TypeScript, token-driven, production-ready.

---

## ✨ Fitur

- **3-Layer Token Architecture** — Primitive → Semantic → Brand. Override tema cukup di Layer 3 (Brand).
- **32+ Components** — Primitives, Patterns, dan Block components siap pakai.
- **5 Custom Hooks** — `useSheet`, `useToast`, `useMediaQuery`, `useReducedMotion`, `useDraggable`.
- **CSS Modules + CSS Custom Properties** — Scoped styles, tanpa class name collision.
- **Framer Motion** — Animasi smooth untuk Sheet, Modal, dan DetailPane.
- **Phosphor Icons** — Icon utama. Tabler sebagai strict fallback.
- **Dark Mode** — Toggle via `<CiamikProvider darkMode>`.
- **Brand Override** — Multi-tenant theming via `<CiamikProvider brand={...}>`.
- **Tree-shakeable** — ESM build, hanya bundle komponen yang dipakai.
- **TypeScript Strict** — Semua props strongly typed.
- **Storybook 8** — Interactive playground + showcase demo pages.

---

## 📦 Installation

```bash
npm install @ciamik/ui
```

### Peer Dependencies

```bash
npm install react react-dom framer-motion @phosphor-icons/react
```

---

## 🚀 Quick Start

```tsx
// 1. Import CSS tokens (satu kali di root app)
import '@ciamik/ui/dist/ui.css';

// 2. Wrap app dengan CiamikProvider
import { CiamikProvider, Button, useToast } from '@ciamik/ui';

function App() {
  return (
    <CiamikProvider>
      <MyPage />
    </CiamikProvider>
  );
}

function MyPage() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast('Berhasil!', 'success')}>
      Klik Saya
    </Button>
  );
}
```

---

## 🎨 Token Override (Multi-tenant Branding)

```tsx
<CiamikProvider
  brand={{
    primary: '#E91E63',
    accent: '#FF9800',
    highlight: '#FFC107',
  }}
>
  {/* Semua komponen di dalam akan menggunakan warna brand baru */}
  <App />
</CiamikProvider>
```

---

## 🌙 Dark Mode

```tsx
<CiamikProvider darkMode>
  <App />
</CiamikProvider>
```

Atau toggle secara dinamis:

```tsx
const [isDark, setIsDark] = useState(false);

<CiamikProvider darkMode={isDark}>
  <button onClick={() => setIsDark(!isDark)}>Toggle Theme</button>
  <App />
</CiamikProvider>
```

---

## 📋 Component API Overview

### Tier 1 — Primitives (Atomic)

| Component | Key Props |
|-----------|-----------|
| `Button` | `variant`, `size`, `loading`, `disabled`, `icon` |
| `Input` | `label`, `error`, `helper`, `disabled`, `prefix` |
| `Select` | `options`, `searchable`, `placeholder` |
| `Textarea` | `label`, `error`, `rows` |
| `Card` | `interactive`, `children` (header/body/footer slots) |
| `Badge` | `variant` (success/warning/danger/info/neutral/highlight), `size` |
| `Modal` | `isOpen`, `onClose`, `title`, `destructive` |
| `Sheet` | `isOpen`, `onClose`, `title`, `isDismissible` |
| `Toast` | via `useToast()` hook — `toast(message, type)` |
| `Banner` | `type`, `message`, `dismissible`, `autoDismiss` |
| `Skeleton` | `shape` (text/circle/rect/card) |
| `EmptyState` | `variant`, `icon`, `message`, `ctaText` |
| `Spinner` | `size`, inherits color |

### Tier 2 — Patterns (Composite)

| Component | Key Props |
|-----------|-----------|
| `Topbar` | `children`, sticky, blur backdrop |
| `BottomNav` | `items` (icon, label, badge, isActive) |
| `Sidebar` | `items`, `header`, collapsible |
| `DetailPane` | `isOpen`, `title`, `tabs`, push/overlay mode |
| `DataTable` | `columns`, `data`, `selectable`, sortable headers |
| `SearchFilterBar` | `placeholder`, `filters`, debounced search |
| `MetricCard` | `title`, `value`, `delta`, `trend`, `icon` |
| `StatusBadge` | `status` (maps to 15 order lifecycle statuses) |
| `Pagination` | `currentPage`, `totalPages`, `onPageChange` |
| `ViewSwitcher` | `views`, `activeView`, `onViewChange` |
| `DateRangePicker` | `value`, `presets`, `onChange` |
| `KanbanBoard` | `columns`, `onCardMove`, `validateMove`, `renderCard` |
| `SystemAlert` | `isOpen`, `type`, `message`, auto-dismiss |

### Tier 3 — Blocks (Presentational)

| Component | Key Props |
|-----------|-----------|
| `ProductCard` | Full anatomy: image, badges, wishlist, price, stepper CTA |
| `ProductGrid` | `title`, `seeAllHref`, responsive 2/3/4 col grid |
| `TrustBadges` | `variant` (compact/expanded), custom `items` |
| `HeroBanner` | `slides`, `autoPlay`, `interval`, carousel with dots |
| `CartItem` | `image`, `name`, `variant`, `price`, `quantity`, stepper |
| `OTPFlow` | 3-step UI: phone → digit boxes → success animation |

### Hooks

| Hook | Purpose |
|------|---------|
| `useToast` | Queue toast notifications, auto-dismiss |
| `useSheet` | Open/close/toggle state management |
| `useMediaQuery` | Subscribe to CSS media query changes |
| `useReducedMotion` | Detect `prefers-reduced-motion` preference |
| `useDraggable` | Pointer-event drag gesture handler |

### Utils & Constants

| Export | Purpose |
|--------|---------|
| `formatCurrency(n)` | `Rp 450.000` — Indonesian locale |
| `formatCurrencyCompact(n)` | `Rp 1.5jt`, `Rp 450rb` |
| `formatSoldCount(n)` | `1.5rb`, `340` |
| `cn(...classes)` | Class name merge utility |
| `BREAKPOINTS` | `{ base, xs, sm, md, lg, xl, '2xl' }` |
| `CHART_COLORS` | Categorical, sequential, semantic palettes |
| `STATUS_MAP` | 15 order statuses → intent + icon mapping |

---

## 🏗️ Development

```bash
# Install dependencies
npm install

# Run Storybook (development)
npm run storybook

# Run unit tests
npm run test

# Build library
npm run build

# Type check
npx tsc --noEmit
```

---

## 📁 Architecture

```
src/
├── tokens/          # Layer 1-2 CSS Custom Properties
├── provider/        # CiamikProvider (Brand Layer 3 override)
├── primitives/      # Tier 1 — Atomic components (13)
├── patterns/        # Tier 2 — Composite components (13)
├── blocks/          # Tier 3 — Presentational blocks (6)
├── hooks/           # Custom React hooks (5)
├── utils/           # Utility functions
├── constants/       # Design system constants
└── index.ts         # Barrel exports
```

### Token Architecture

```
Layer 1 (Primitive)  →  --ciamik-teal-400, --ciamik-coral-400, ...
Layer 2 (Semantic)   →  --ciamik-primary, --ciamik-accent, --ciamik-danger, ...
Layer 3 (Brand)      →  Runtime override via CiamikProvider props
```

> **Rule:** Komponen HANYA boleh mengonsumsi Layer 2 (Semantic) atau Layer 3 (Brand). Layer 1 Primitives hanya sebagai referensi internal.

---

## 📄 License

MIT © ciamik.id
