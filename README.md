# Websoul.tech — Custom Web Development & Engineering Agency

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

**Websoul.tech** is a web development and digital engineering agency platform engineered with React 19, TypeScript, Vite, and Tailwind CSS v4. It showcases client case studies, custom service offerings, and interactive client conversion funnels, backed by an integrated, Firestore-powered **Blog CMS & Protected Admin Panel**.

---

## Key Features

- **Dynamic Agency Showcase**:
  - Interactive project case studies featuring before/after performance benchmarks (Fulfillment Ink, Family Dashboard, Leo's Steam Wash, Orbit Analytics, etc.).
  - Detailed service breakdowns with technical deliverables and pricing packages.
  - Testimonial spotlights and client FAQ accordion.

- **Integrated Blog CMS (Content Management System)**:
  - Backed by **Google Cloud Firestore** for persistent real-time storage.
  - Direct browser image uploads via **Cloudinary unsigned presets** with live progress indicators.
  - Rich Markdown editing toolbar, live preview modal, auto-slug generation, reading time calculation, and tag management.
  - Automatic collection seeding (`INITIAL_BLOGS`) on first run.

- **Protected Admin Panel (`/admin`)**:
  - Secure authentication via HMAC-SHA256 JWT tokens with Vite dev-server mock middleware and serverless API handlers.
  - Real-time dashboard statistics: total articles, published counts, draft counts, and featured highlights.
  - Full CRUD operations with instant search, category filtering, and one-click publish/featured toggling.

- **Design System & Aesthetics**:
  - Built on **Tailwind CSS v4** with a dark/light mode toggle saved in `localStorage`.
  - Curated typography utilizing **Space Grotesk** (headings), **Inter** (body), and **JetBrains Mono** (technical accents).
  - Custom scrollbars, glassmorphic headers, subtle hover micro-interactions, and an animated intro splash screen.

- **Technical SEO & Analytics**:
  - SPA head manager dynamically updating `<title>`, `<meta name="description">`, OpenGraph, Twitter Cards, robots tags, and canonical links on client route transitions.
  - Injected JSON-LD Schema markup for `Organization`, `ProfessionalService`, `BreadcrumbList`, and `BlogPosting`.
  - Google Analytics 4 (`G-F64N2LC4LV`) client-side pageview tracking.

---

## Architecture & Codebase Map

```
websoul/
├── api/                                # Vercel Serverless Functions
│   └── auth/
│       ├── login.ts                    # Serverless admin authentication (HMAC-SHA256 JWT)
│       └── verify.ts                   # Token validation endpoint
├── public/                             # Public Static Assets
│   ├── projects/                       # Case study screenshots and media
│   ├── favicon.png                     # Browser tab icon (Websoul Tech)
│   ├── websoul_logo/                   # Websoul brand logo set for light/dark themes
│   ├── robots.txt                      # Search crawler configuration
│   ├── sitemap.xml                     # XML sitemap for SEO indexing
│   └── _redirects                      # Netlify/SPA routing rewrites
├── src/                                # Application Source Code
│   ├── components/
│   │   ├── admin/                      # Admin Panel & Blog CMS Suite
│   │   │   ├── AdminBlogForm.tsx       # Blog post editor, Markdown toolbar, Cloudinary uploader
│   │   │   ├── AdminBlogList.tsx       # Filterable table of all articles with quick actions
│   │   │   ├── AdminDashboardOverview.tsx # Metric summary cards, quick action buttons
│   │   │   ├── AdminLayout.tsx         # Admin shell layout with sidebar and auth guard
│   │   │   ├── AdminLoginPage.tsx      # Protected login view
│   │   │   └── BlogPreviewModal.tsx    # Live preview modal for drafted articles
│   │   └── blog/                       # Public Blog Suite
│   │       ├── BlogCard.tsx            # Article summary card component
│   │       ├── BlogDetailPage.tsx      # Full article page with TOC, SEO schema, and bio
│   │       ├── BlogListPage.tsx        # Searchable and categorizable articles index
│   │       └── LatestBlogsSection.tsx  # Homepage featured blog spotlight
│   ├── lib/                            # Integrations & Utilities
│   │   ├── analytics.ts                # GA4 pageview & custom event tracker
│   │   ├── cloudinary.ts               # Unsigned upload pipeline with XMLHttpRequest progress
│   │   └── firebase.ts                 # Firestore connection and initialization
│   ├── services/                       # Data & State Services
│   │   ├── authService.ts              # Session storage manager & authentication provider
│   │   └── blogStorage.ts              # Firestore CRUD operations, in-memory cache & event dispatcher
│   ├── types/
│   │   └── blog.ts                     # TypeScript definitions for blogs, stats, and auth
│   ├── App.tsx                         # Core router, page orchestrator, public views & SEO manager
│   ├── index.css                       # Tailwind v4 theme, fonts, custom scrollbars, keyframes
│   ├── main.tsx                        # React application DOM entry point
│   └── vite-env.d.ts                   # Vite environment variable type declarations
├── firestore.rules                     # Cloud Firestore security policy rules
├── index.html                          # Root HTML with SEO tags & Organization schema
├── package.json                        # Scripts and project dependencies
├── tsconfig.json                       # TypeScript compiler options
├── vercel.json                         # Vercel deployment routes and SPA rewrites
└── vite.config.ts                      # Vite configuration + local auth dev server middleware
```

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework & UI** | React 19, TypeScript 5.7 | Functional components, custom hooks, typed interfaces |
| **Tooling & Bundler** | Vite 6 | Rapid HMR and optimized production bundling |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | CSS-first config with custom theme variants and keyframes |
| **Database** | Google Cloud Firestore (`firebase` 12.18) | Document database for blog storage and retrieval |
| **Media CDN** | Cloudinary | Fast, unsigned image uploads for article covers |
| **Authentication** | Serverless / Client fallback | HMAC-SHA256 token verification with local/session storage |
| **Contact Form** | EmailJS (`@emailjs/browser`) | Client-side email dispatch with service templates |
| **Analytics & SEO** | GA4 + Schema.org JSON-LD | Track user journeys and maximize search visibility |
| **Hosting** | Vercel | Production hosting with apex redirects and SPA rewrite rules |

---

## Route Overview

### Public Routes
- `/` or `/home` — Agency homepage (Hero, tech stacks, portfolio highlights, process, testimonials, FAQ).
- `/work` or `/projects` — Case studies portfolio filterable by project category.
- `/project/:id` — In-depth project breakdown with challenge, solution, and before/after metrics.
- `/services` — Detailed breakdown of engineering offerings and deliverables.
- `/about` — Team background, development philosophy, and core principles.
- `/pricing` — Transparent project tiers (Starter, Growth, Custom).
- `/contact` — Contact form with budget selector and direct email copy.
- `/blog` — Public blog index with live search and category pills.
- `/blog/:slug` — Individual technical article with table of contents, author bio, and related posts.

### Protected Admin Routes
- `/admin/login` — Administrator login screen.
- `/admin` — High-level metric dashboard overview.
- `/admin/blogs` — Article management table (search, publish toggle, feature toggle, delete).
- `/admin/blogs/new` — Full-featured technical article creation form.
- `/admin/blogs/edit/:id` — Article editor with pre-populated data.

---

## Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Ahsan0009/Websoul.tech.git
cd websoul
npm install
```

### 2. Environment Configuration (Optional)
Create a `.env` or `.env.local` file in the root directory if customizing third-party services:

```env
# Cloudinary (Optional - for custom image presets)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=websoul_blogs

# EmailJS (Optional - defaults provided in code)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Google Analytics 4 (Optional - defaults to G-F64N2LC4LV)
VITE_GA_MEASUREMENT_ID=G-F64N2LC4LV
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> [!TIP]
> The Vite dev server includes a custom middleware plugin (`authDevPlugin`) in [vite.config.ts](file:///home/hamza/Projects/websoul/vite.config.ts) that intercepts `/api/auth/login` locally, allowing full admin login testing without deploying serverless functions.

### 4. Build for Production
```bash
npm run build
```
Generates the optimized static build in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## Deployment

This project is pre-configured for deployment on **Vercel**:
- [vercel.json](file:///home/hamza/Projects/websoul/vercel.json) redirects apex traffic (`websoul.tech` and legacy `websoul.tech`) to `www.websoul.tech` and maps all SPA routes to `/index.html`.
- Serverless endpoints in `api/auth/*.ts` are automatically detected and deployed as Vercel serverless functions.

---

## License

Private repository. All rights reserved by **Websoul.tech**.
