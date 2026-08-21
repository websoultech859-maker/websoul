import React, { useState, useEffect, useMemo } from 'react';
import { BlogPost } from '../../types/blog';
import { BlogStorageService } from '../../services/blogStorage';
import { BlogCard } from './BlogCard';

interface BlogListPageProps {
  onNavigate: (page: string, param?: string | number) => void;
}

const CATEGORIES = [
  'All',
  'Web Development',
  'Next.js & React',
  'SEO & Performance',
  'UI/UX Design',
  'E-commerce',
  'Engineering'
];

export const BlogListPage: React.FC<BlogListPageProps> = ({ onNavigate }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Initial async load from Firestore
    BlogStorageService.getPublishedBlogs().then((data) => {
      setBlogs(data);
      setIsLoading(false);
    });

    const handleUpdate = (e: Event) => {
      const updated = (e as CustomEvent<BlogPost[]>).detail || [];
      setBlogs(updated.filter((b) => b.isPublished));
    };
    window.addEventListener('websoul_blogs_updated', handleUpdate);
    return () => window.removeEventListener('websoul_blogs_updated', handleUpdate);
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === 'All' || blog.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.slug.toLowerCase().includes(q) ||
        blog.category.toLowerCase().includes(q) ||
        (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredBlog = useMemo(() => {
    if (selectedCategory !== 'All' || searchQuery) return null;
    return blogs.find((b) => b.isFeatured) || (blogs.length > 0 ? blogs[0] : null);
  }, [blogs, selectedCategory, searchQuery]);

  const gridBlogs = useMemo(() => {
    if (featuredBlog && selectedCategory === 'All' && !searchQuery) {
      return filteredBlogs.filter((b) => b.id !== featuredBlog.id);
    }
    return filteredBlogs;
  }, [filteredBlogs, featuredBlog, selectedCategory, searchQuery]);

  return (
    <div className="pt-24 sm:pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 bg-white dark:bg-[#0F172A] transition-colors duration-300">
      {/* Header Section */}
      <div className="max-w-3xl mb-10 sm:mb-14">
        <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
          Engineering & Design Insights
        </span>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B192C] dark:text-white mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Articles on Modern Web Architecture, SEO & UX.
        </h1>
        <p className="text-base sm:text-lg text-[#475569] dark:text-slate-400 leading-relaxed">
          Actionable guides, performance case studies, and engineering breakdowns for business founders and product leaders.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 sm:mb-12 pb-6 border-b border-slate-200 dark:border-slate-800">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-mono-tech whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0B192C] dark:bg-blue-600 text-white border border-[#0B192C] dark:border-blue-500 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0B192C] dark:hover:border-slate-500 hover:text-[#0B192C] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] sm:min-w-[300px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by topic, keyword..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/80 text-xs sm:text-sm text-[#0B192C] dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#0B192C] dark:focus:border-blue-500 transition-all"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-mono-tech cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Featured Spotlight Card (Shown when on All and not searching) */}
      {featuredBlog && (
        <div className="mb-12">
          <div
            onClick={() => onNavigate('blog-detail', featuredBlog.slug)}
            className="card-hover rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 group"
          >
            <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden relative">
              <img
                src={featuredBlog.featuredImage}
                alt={featuredBlog.imageAlt || featuredBlog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider bg-amber-500 text-white shadow-md">
                  ★ Spotlight Article
                </span>
              </div>
            </div>
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-mono-tech text-slate-500 dark:text-slate-400 mb-3">
                  <span className="text-[#0B192C] dark:text-blue-400 font-bold uppercase tracking-wider">
                    {featuredBlog.category}
                  </span>
                  <span>•</span>
                  <time dateTime={featuredBlog.publishDate}>
                    {new Date(featuredBlog.publishDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                  <span>•</span>
                  <span>{featuredBlog.readingTimeMinutes || 5} min read</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-[#0B192C] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 leading-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {featuredBlog.title}
                </h2>
                <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed mb-6">
                  {featuredBlog.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/favicon.png"
                    alt="WebSoul"
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 block dark:hidden"
                  />
                  <img
                    src="/websoul_logo/favicondark.png"
                    alt="WebSoul"
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 hidden dark:block"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#0B192C] dark:text-white font-mono-tech">
                      {featuredBlog.author}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-tech">
                      {featuredBlog.authorRole || 'Author'}
                    </div>
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-mono-tech font-bold text-[#0B192C] dark:text-blue-400 group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1.5">
                  Read Full Article →
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      {gridBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gridBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onReadMore={(slug) => onNavigate('blog-detail', slug)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 bg-[#F8FAFC] dark:bg-slate-900/40">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-3">
            🔍
          </div>
          <h3 className="text-lg font-bold text-[#0B192C] dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            No matching articles found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords or switching category filters to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono-tech font-semibold bg-[#0B192C] dark:bg-blue-600 text-white hover:bg-[#1E3A8A] transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Bottom Newsletter & Contact CTA */}
      <section className="mt-16 sm:mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B192C] to-[#1E3A8A] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.18)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-mono-tech uppercase tracking-widest text-sky-400 font-semibold block mb-3">
            Accelerate Your Web Presence
          </span>
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4 " style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'white' }}>
            Need a high-converting website engineered for speed?
          </h2>
          <p className="text-sm sm:text-base text-slate-200 mb-6 leading-relaxed">
            We build custom React & Next.js applications with sub-second load times and automated technical SEO.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-white text-[#0B192C] hover:bg-slate-100 font-bold text-xs sm:text-sm font-mono-tech transition-all shadow-md cursor-pointer"
            >
              Get a Fixed-Price Quote →
            </button>
            <button
              onClick={() => onNavigate('work')}
              className="px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white font-medium text-xs sm:text-sm font-mono-tech transition-all cursor-pointer"
            >
              View Client Case Studies
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
