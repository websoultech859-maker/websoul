// src/services/blogStorage.ts
// Blog storage backed by Firebase Firestore.
// Images are uploaded to Cloudinary separately (see src/lib/cloudinary.ts).
// The Cloudinary CDN URL is stored as the `featuredImage` field in Firestore.

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BlogPost, BlogFormData, BlogStats } from '../types/blog';

const BLOGS_COLLECTION = 'blogs';

// ─── Initial Seed Data ────────────────────────────────────────────────────────
// These blogs are written to Firestore only if the collection is empty (first run).
export const INITIAL_BLOGS: Omit<BlogPost, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'blog-1',
    title: '10 Signs Your Business Needs a New Website in 2026',
    slug: '10-signs-your-business-needs-a-new-website',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop&auto=format',
    imageAlt: 'Modern web analytics and responsive business website dashboard on laptop',
    category: 'Web Development',
    author: 'Saad (WebSoul Lead)',
    authorRole: 'Founder & Senior Full-Stack Engineer',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format',
    publishDate: '2026-08-15',
    excerpt: 'Is your website quietly repelling potential clients? Discover the 10 critical warning signs that prove your digital presence is costing you revenue and why a modern rebuild delivers an instant ROI.',
    content: `## The Modern Web Has Changed — Has Your Website Kept Up?\n\nYour website is the single most important digital salesperson for your company. It works 24 hours a day, 7 days a week, introducing your brand, presenting your value proposition, and converting casual visitors into paying customers.\n\nYet, hundreds of growing businesses are still running on outdated templates, clunky page builders, and sluggish legacy systems built years ago.\n\nIn 2026, user patience is at an all-time low. If your site takes longer than **2 seconds** to load, or looks awkward on a mobile screen, potential clients won't complain — they simply click the back button and buy from your competitor.\n\nHere are the **10 unmistakable signs** that your business urgently needs a professional website rebuild.\n\n---\n\n### 1. Slow Load Times (Failing Core Web Vitals)\nGoogle's data reveals that as page load time goes from 1s to 3s, the probability of a bounce increases by **32%**. If your site takes 5+ seconds, over **90%** of mobile traffic bounces before reading a single headline. \n\nModern web platforms engineered with React and Next.js achieve sub-second page transitions and 100/100 Core Web Vitals scores.\n\n### 2. High Bounce Rates on Mobile Devices\nMore than 65% of global web traffic originates from mobile devices. If your website requires pinch-to-zoom, has misaligned text, or displays overlapping buttons on mobile screens, you are losing more than half your potential revenue.\n\n### 3. Your Conversion Rate Has Stagnated\nYou might be driving traffic through SEO or paid ads, but visitors aren't filling out your contact form or scheduling calls. Outdated design communicates a lack of credibility, making prospective buyers hesitant to trust you with their business.\n\n### 4. Difficult or Impossible Content Updates\nIf changing a simple headline or adding a new team member requires submitting a support ticket to an unresponsive developer or wrestling with broken WordPress plugins, your CMS is holding your business back.\n\n### 5. Inconsistent Visual Branding\nAs businesses grow, their service offerings and target audience evolve. If your current website still features old logos, expired pricing, or an amateur visual aesthetic that doesn't match the premium quality of your work, a brand-aligned redesign is overdue.\n\n### 6. Lack of Clear Call-to-Actions (CTAs)\nWhen a visitor lands on your homepage, they should immediately know:\n* What you do\n* Who you do it for\n* What action they should take next\n\nIf your site lacks clear, strategically positioned CTAs, you are leaving leads on the table.\n\n### 7. Security Vulnerabilities & Broken Plugins\nLegacy sites with dozens of unmaintained plugins are constant targets for malicious bots and malware. Modern static and server-rendered web architectures provide rock-solid security with zero plugin vulnerabilities.\n\n### 8. Poor Search Engine Visibility (SEO)\nModern search engines reward fast, semantic, accessible websites equipped with structured JSON-LD schema data. If your competitors rank above you for your primary keywords, technical SEO debt in your website's codebase is likely to blame.\n\n### 9. Broken Integrations & Outdated Tech Stacks\nIf your site cannot seamlessly integrate with your modern CRM, automated booking tools, Stripe payment processing, or live chat software, your internal team is wasting hours on manual data entry.\n\n### 10. Your Competitors Just Relaunched Their Websites\nTake an honest look at your top 3 competitors. If their websites look slick, fast, and authoritative while yours feels like a relic from 2018, clients will perceive them as the industry leader.\n\n---\n\n## What Does a High-Performance Website Look Like?\n\nA modern website built by WebSoul provides:\n1. **Sub-1-Second Page Loads**: Instant page transitions powered by React & Next.js.\n2. **Mobile-First Responsive Layouts**: Pixel-perfect typography and controls across all devices.\n3. **High-Converting UX Architecture**: Strategic lead capture funnels and friction-free contact forms.\n4. **Automated Technical SEO**: Structured schema, canonical tags, and dynamic metadata pre-configured.\n\nReady to see what a modern web engineering overhaul can do for your business? [Explore our custom web development services](/services) or [get a fixed-price project quote](/contact) today.`,
    seoTitle: '10 Signs Your Business Needs a New Website in 2026 | WebSoul',
    seoDescription: 'Discover the top 10 warning signs that your website is losing revenue. Learn how modern React & Next.js web development accelerates conversions and Core Web Vitals.',
    focusKeyword: 'business website redesign',
    isPublished: true,
    isFeatured: true,
    tags: ['Web Development', 'Business Growth', 'UI/UX Design', 'Conversion Optimization'],
    internalLinks: [
      { label: 'WebSoul Web Development Services', url: '/services' },
      { label: 'Client Case Studies & Portfolio', url: '/work' },
      { label: 'Transparent Pricing Packages', url: '/pricing' },
      { label: 'Request a Free Project Consultation', url: '/contact' }
    ],
    readingTimeMinutes: 5,
  },
  {
    id: 'blog-2',
    title: 'Next.js vs React: Choosing the Right Framework for Your Next Web App',
    slug: 'nextjs-vs-react-web-development-guide',
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop&auto=format',
    imageAlt: 'Code editor screen displaying React and Next.js frontend web application code',
    category: 'Next.js & React',
    author: 'Saad (WebSoul Lead)',
    authorRole: 'Founder & Senior Full-Stack Engineer',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
    publishDate: '2026-08-12',
    excerpt: 'Confused between building a pure client-side React SPA or a full-stack Next.js application? We break down performance, SEO indexing, SSR, and hosting costs so you can choose the right architecture.',
    content: `## The Modern Frontend Dilemma: React or Next.js?\n\nWhen starting a new web project in 2026, one of the most critical architectural decisions is deciding between a **client-side React Single Page Application (SPA)** and a **full-stack React framework like Next.js**.\n\nBoth technologies are industry leaders, both use React components, and both offer lightning-fast user experiences. However, their rendering models, SEO capabilities, and server requirements are distinctly different.\n\n---\n\n### Understanding the Fundamental Difference\n\n* **React** is an open-source JavaScript UI library for building interactive user interfaces. By default, React applications run in the user's browser (Client-Side Rendering or CSR).\n* **Next.js** is a production-grade full-stack framework built on top of React. It provides built-in routing, server-side rendering (SSR), static site generation (SSG), API route handlers, and automatic image optimization.\n\n---\n\n### 1. Search Engine Optimization (SEO) & Web Crawling\n\n* **React (Client-Side Rendering)**: Search engine bots have gotten better at executing JavaScript, but client-side rendering can still delay indexing.\n* **Next.js (Server-Side Rendering & Static Generation)**: Next.js pre-renders complete HTML on the server or at build time.\n\n> **Winner for Public SEO Sites**: **Next.js**\n\n---\n\n### 2. Performance & Initial Page Load (Core Web Vitals)\n\n* **React SPA**: The user's device must download, parse, and execute the entire JavaScript bundle before displaying the First Contentful Paint (FCP).\n* **Next.js**: Pre-rendered HTML is streamed immediately, delivering sub-second FCP and LCP scores.\n\n> **Winner for Ultra-Fast Initial Load**: **Next.js**\n\n---\n\n### 3. Internal Dashboards, SaaS Portals & Authenticated Apps\n\nIn authenticated web applications, SEO is irrelevant. A client-side React SPA paired with a fast backend API provides simpler deployment and zero server hosting overhead.\n\n> **Winner for Authenticated SaaS Portals**: **React SPA (Vite)**\n\n---\n\n## Our Engineering Recommendation\n\nAt WebSoul, we tailor our architecture to your specific business model:\n* For public marketing websites, e-commerce storefronts, and content-rich authority platforms where Google ranking is vital, we build with **Next.js**.\n* For real-time SaaS tools, interactive calculators, and authenticated enterprise dashboards, a streamlined **React + TypeScript** architecture provides maximum developer velocity.\n\nInterested in discussing the best technical architecture for your next project? [Schedule a free discovery session with WebSoul engineers](/contact) or [check out our recent web engineering case studies](/work).`,
    seoTitle: 'Next.js vs React: Complete Framework Guide for 2026 | WebSoul',
    seoDescription: 'Next.js vs React: Compare rendering models, SEO indexing, performance, and hosting costs. Discover which framework is best suited for your web application.',
    focusKeyword: 'Next.js vs React',
    isPublished: true,
    isFeatured: false,
    tags: ['Next.js', 'React', 'Full-Stack', 'Frontend Architecture', 'Web Engineering'],
    internalLinks: [
      { label: 'Custom React & Next.js Development', url: '/services' },
      { label: 'Explore WebSoul Engineering Portfolio', url: '/work' },
      { label: 'Discuss Your Project Architecture', url: '/contact' }
    ],
    readingTimeMinutes: 6,
  },
  {
    id: 'blog-3',
    title: 'How Core Web Vitals and Sub-Second Load Times Directly Drive Conversions',
    slug: 'how-core-web-vitals-impact-conversions',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop&auto=format',
    imageAlt: 'Speed performance metrics dashboard showing sub-second load times and high conversion rate graphs',
    category: 'SEO & Performance',
    author: 'Saad (WebSoul Lead)',
    authorRole: 'Founder & Senior Full-Stack Engineer',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format',
    publishDate: '2026-08-08',
    excerpt: 'Website speed is not just an engineering vanity metric — it directly dictates your bottom-line revenue. Learn how shaving 500ms off your page speed doubles conversion rates and slashes bounce rates.',
    content: `## Why Website Speed Is Your Biggest Revenue Lever\n\nFor years, website speed was treated as a secondary technical concern. Today, speed is recognized as a primary driver of customer psychology and financial conversion.\n\nCase studies across top brands consistently validate this reality:\n* **Walmart** discovered that every 100ms improvement in load time increased conversion rates by up to **1%**.\n* **Mobify** found that shaving just 100ms off their checkout page resulted in a **1.11% boost in session revenue**.\n\n---\n\n### What Are Google's Core Web Vitals?\n\nGoogle's Core Web Vitals are three standardized metrics designed to measure real-world user experience:\n\n1. **Largest Contentful Paint (LCP)**: Measures perceived loading speed.\n   * *Target*: Under **2.5 seconds** (WebSoul aims for **< 1.0s**).\n2. **Interaction to Next Paint (INP)**: Measures responsiveness.\n   * *Target*: Under **200 milliseconds** (WebSoul builds for **< 50ms**).\n3. **Cumulative Layout Shift (CLS)**: Measures visual stability.\n   * *Target*: Under **0.1** (WebSoul aims for **0.00**).\n\n---\n\n### The 4 Biggest Culprits of Sluggish Websites\n\n#### 1. Bloated Third-Party Scripts & Trackers\nInstalling 15 separate marketing pixels blocks the browser's main JavaScript thread.\n\n#### 2. Uncompressed & Non-Modern Image Formats\nServing multi-megabyte PNG or JPEG files is the #1 cause of poor LCP scores.\n\n#### 3. Render-Blocking CSS & Unused JavaScript\nGeneric WordPress themes often ship with megabytes of unused styles.\n\n#### 4. Slow Server Response Times (TTFB)\nHosting on cheap shared servers results in 800ms+ Time to First Byte.\n\n---\n\n## How WebSoul Engineers Websites for Sub-Second Speeds\n\nEvery website built by WebSoul undergoes rigorous performance profiling:\n* **Static Edge Generation**: Pre-computing pages on global CDN nodes.\n* **Modern Media Pipelines**: Responsive image rendering with zero layout shift.\n* **Zero Bloat Code Architecture**: Clean, hand-crafted TypeScript and React components.\n\nWant to audit your existing website's performance? [Contact WebSoul for a comprehensive technical performance audit](/contact) or [learn about our maintenance & performance packages](/services).`,
    seoTitle: 'How Core Web Vitals & Page Speed Drive Revenue | WebSoul',
    seoDescription: 'Learn why website speed is your highest ROI growth channel. Discover how optimizing LCP, INP, and CLS increases customer retention and conversion rates.',
    focusKeyword: 'Core Web Vitals website speed',
    isPublished: true,
    isFeatured: false,
    tags: ['Core Web Vitals', 'Page Speed', 'Technical SEO', 'Conversion Rate Optimization'],
    internalLinks: [
      { label: 'WebSoul Performance Optimization Services', url: '/services' },
      { label: 'View Proven Client Case Studies', url: '/work' },
      { label: 'Request a Free Website Speed Audit', url: '/contact' }
    ],
    readingTimeMinutes: 5,
  }
];

// ─── Utilities ─────────────────────────────────────────────────────────────────

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Convert a Firestore document snapshot to a BlogPost, normalizing timestamps. */
function docToBlogPost(id: string, data: Record<string, unknown>): BlogPost {
  const toISO = (val: unknown): string => {
    if (!val) return new Date().toISOString();
    if (val instanceof Timestamp) return val.toDate().toISOString();
    if (typeof val === 'string') return val;
    return new Date().toISOString();
  };
  return {
    id,
    title: (data.title as string) || '',
    slug: (data.slug as string) || '',
    featuredImage: (data.featuredImage as string) || '',
    imageAlt: (data.imageAlt as string) || '',
    category: (data.category as string) || '',
    author: (data.author as string) || '',
    authorRole: (data.authorRole as string) || undefined,
    authorImage: (data.authorImage as string) || undefined,
    publishDate: (data.publishDate as string) || '',
    excerpt: (data.excerpt as string) || '',
    content: (data.content as string) || '',
    seoTitle: (data.seoTitle as string) || '',
    seoDescription: (data.seoDescription as string) || '',
    focusKeyword: (data.focusKeyword as string) || '',
    isPublished: (data.isPublished as boolean) ?? false,
    isFeatured: (data.isFeatured as boolean) ?? false,
    tags: (data.tags as string[]) || [],
    internalLinks: (data.internalLinks as BlogPost['internalLinks']) || [],
    readingTimeMinutes: (data.readingTimeMinutes as number) || 5,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

// ─── In-memory cache + event system ───────────────────────────────────────────
// We keep a local cache so components can read synchronously after the first load.
let _cache: BlogPost[] | null = null;

function dispatchUpdate(blogs: BlogPost[]) {
  _cache = blogs;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('websoul_blogs_updated', { detail: blogs }));
  }
}

// ─── BlogStorageService ────────────────────────────────────────────────────────

export class BlogStorageService {
  /**
   * Fetch all blogs from Firestore, ordered by publishDate descending.
   * Seeds initial blogs if the collection is empty.
   */
  public static async getAllBlogs(): Promise<BlogPost[]> {
    try {
      const col = collection(db, BLOGS_COLLECTION);
      const q = query(col, orderBy('publishDate', 'desc'));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // First run: seed the initial blogs
        await BlogStorageService._seedInitialBlogs();
        return BlogStorageService.getAllBlogs();
      }

      const blogs: BlogPost[] = snapshot.docs.map((d) =>
        docToBlogPost(d.id, d.data() as Record<string, unknown>)
      );
      _cache = blogs;
      return blogs;
    } catch (e) {
      console.error('Firestore getAllBlogs error:', e);
      // Fallback to cache if Firestore is not yet configured
      return _cache ?? [];
    }
  }

  /** Seed initial blog posts into Firestore (one-time operation). */
  private static async _seedInitialBlogs(): Promise<void> {
    const now = new Date().toISOString();
    for (const blog of INITIAL_BLOGS) {
      const docRef = doc(db, BLOGS_COLLECTION, blog.id);
      await setDoc(docRef, {
        ...blog,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  /** Get cached blogs synchronously (for initial renders before the async load). */
  public static getCachedBlogs(): BlogPost[] {
    return _cache ?? [];
  }

  public static async getPublishedBlogs(): Promise<BlogPost[]> {
    const all = await BlogStorageService.getAllBlogs();
    return all.filter((b) => b.isPublished);
  }

  public static async getLatestPublishedBlogs(limit = 3): Promise<BlogPost[]> {
    const published = await BlogStorageService.getPublishedBlogs();
    const featured = published.filter((b) => b.isFeatured);
    const nonFeatured = published.filter((b) => !b.isFeatured);
    return [...featured, ...nonFeatured].slice(0, limit);
  }

  public static async getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
    const normalized = slug.trim().toLowerCase();
    const all = await BlogStorageService.getAllBlogs();
    return all.find((b) => b.slug.toLowerCase() === normalized);
  }

  public static async getBlogById(id: string): Promise<BlogPost | undefined> {
    try {
      const docRef = doc(db, BLOGS_COLLECTION, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return undefined;
      return docToBlogPost(snap.id, snap.data() as Record<string, unknown>);
    } catch (e) {
      console.error('Firestore getBlogById error:', e);
      return _cache?.find((b) => b.id === id);
    }
  }

  public static async isSlugUnique(slug: string, currentBlogId?: string): Promise<boolean> {
    const normalized = slug.trim().toLowerCase();
    const all = await BlogStorageService.getAllBlogs();
    const existing = all.find(
      (b) => b.slug.toLowerCase() === normalized && b.id !== currentBlogId
    );
    return !existing;
  }

  public static async saveBlog(
    data: BlogFormData,
    id?: string
  ): Promise<{ success: boolean; blog?: BlogPost; error?: string }> {
    const normalizedSlug = generateSlug(data.slug || data.title);
    if (!normalizedSlug) {
      return { success: false, error: 'URL Slug cannot be empty and must be valid.' };
    }

    const slugUnique = await BlogStorageService.isSlugUnique(normalizedSlug, id);
    if (!slugUnique) {
      return {
        success: false,
        error: `The URL Slug "${normalizedSlug}" is already in use by another blog article. Please enter a unique slug.`
      };
    }

    const readingTime = calculateReadingTime(data.content);
    const now = new Date().toISOString();

    try {
      if (id) {
        // Update existing document
        const docRef = doc(db, BLOGS_COLLECTION, id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          return { success: false, error: 'Blog not found to update.' };
        }
        const updatePayload = {
          ...data,
          slug: normalizedSlug,
          readingTimeMinutes: readingTime,
          updatedAt: serverTimestamp(),
        };
        await updateDoc(docRef, updatePayload);
        const updatedBlog: BlogPost = {
          ...(snap.data() as BlogPost),
          ...data,
          id,
          slug: normalizedSlug,
          readingTimeMinutes: readingTime,
          updatedAt: now,
          createdAt: (snap.data().createdAt as string) || now,
        };
        // Refresh cache
        const all = await BlogStorageService.getAllBlogs();
        dispatchUpdate(all);
        return { success: true, blog: updatedBlog };
      } else {
        // Create new document with a generated ID
        const newBlogData = {
          ...data,
          slug: normalizedSlug,
          readingTimeMinutes: readingTime,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, BLOGS_COLLECTION), newBlogData);
        const newBlog: BlogPost = {
          ...data,
          id: docRef.id,
          slug: normalizedSlug,
          readingTimeMinutes: readingTime,
          createdAt: now,
          updatedAt: now,
        };
        // Refresh cache
        const all = await BlogStorageService.getAllBlogs();
        dispatchUpdate(all);
        return { success: true, blog: newBlog };
      }
    } catch (e) {
      console.error('Firestore saveBlog error:', e);
      return { success: false, error: 'Failed to save blog post to Firestore. Check your Firebase config.' };
    }
  }

  public static async deleteBlog(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, BLOGS_COLLECTION, id));
      const all = await BlogStorageService.getAllBlogs();
      dispatchUpdate(all);
      return true;
    } catch (e) {
      console.error('Firestore deleteBlog error:', e);
      return false;
    }
  }

  public static async togglePublish(id: string): Promise<BlogPost | undefined> {
    try {
      const docRef = doc(db, BLOGS_COLLECTION, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return undefined;
      const current = snap.data() as BlogPost;
      await updateDoc(docRef, {
        isPublished: !current.isPublished,
        updatedAt: serverTimestamp(),
      });
      const all = await BlogStorageService.getAllBlogs();
      dispatchUpdate(all);
      return all.find((b) => b.id === id);
    } catch (e) {
      console.error('Firestore togglePublish error:', e);
      return undefined;
    }
  }

  public static async toggleFeatured(id: string): Promise<BlogPost | undefined> {
    try {
      const docRef = doc(db, BLOGS_COLLECTION, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return undefined;
      const current = snap.data() as BlogPost;
      await updateDoc(docRef, {
        isFeatured: !current.isFeatured,
        updatedAt: serverTimestamp(),
      });
      const all = await BlogStorageService.getAllBlogs();
      dispatchUpdate(all);
      return all.find((b) => b.id === id);
    } catch (e) {
      console.error('Firestore toggleFeatured error:', e);
      return undefined;
    }
  }

  public static async getStats(): Promise<BlogStats> {
    const blogs = await BlogStorageService.getAllBlogs();
    return {
      total: blogs.length,
      published: blogs.filter((b) => b.isPublished).length,
      drafts: blogs.filter((b) => !b.isPublished).length,
      featured: blogs.filter((b) => b.isFeatured).length,
    };
  }
}
