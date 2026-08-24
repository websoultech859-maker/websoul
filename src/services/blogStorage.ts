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
