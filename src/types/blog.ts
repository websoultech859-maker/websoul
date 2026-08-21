export interface InternalLink {
  label: string;
  url: string;
}

export type BlogCategory =
  | 'Web Development'
  | 'Next.js & React'
  | 'SEO & Performance'
  | 'UI/UX Design'
  | 'E-commerce'
  | 'Case Studies'
  | 'Engineering';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  imageAlt: string;
  category: BlogCategory | string;
  author: string;
  authorRole?: string;
  authorImage?: string;
  publishDate: string; // YYYY-MM-DD or formatted date string
  excerpt: string;
  content: string; // Markdown or formatted HTML/rich text
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  internalLinks: InternalLink[];
  readingTimeMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  featuredImage: string;
  imageAlt: string;
  category: string;
  author: string;
  publishDate: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  internalLinks: InternalLink[];
}

export interface BlogStats {
  total: number;
  published: number;
  drafts: number;
  featured: number;
}

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export interface AuthSession {
  token: string;
  expiresAt: number;
  user: AdminUser;
}
