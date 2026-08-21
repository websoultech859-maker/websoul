import React, { useState, useEffect } from 'react';
import { BlogPost } from '../../types/blog';
import { BlogStorageService } from '../../services/blogStorage';
import { BlogCard } from './BlogCard';

interface LatestBlogsSectionProps {
  onNavigate: (page: string, param?: string | number) => void;
}

export const LatestBlogsSection: React.FC<LatestBlogsSectionProps> = ({ onNavigate }) => {
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    BlogStorageService.getLatestPublishedBlogs(3).then(setLatestBlogs);

    const handleUpdate = (e: Event) => {
      const updated = (e as CustomEvent<BlogPost[]>).detail || [];
      const published = updated.filter((b) => b.isPublished);
      const featured = published.filter((b) => b.isFeatured);
      const nonFeatured = published.filter((b) => !b.isFeatured);
      setLatestBlogs([...featured, ...nonFeatured].slice(0, 3));
    };
    window.addEventListener('websoul_blogs_updated', handleUpdate);
    return () => window.removeEventListener('websoul_blogs_updated', handleUpdate);
  }, []);

  if (latestBlogs.length === 0) {
    return null; // Graceful empty state
  }

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <span className="text-xs font-mono-tech uppercase tracking-widest text-[#0B192C] dark:text-blue-400 font-semibold block mb-2">
            Engineering Insights & Guides
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B192C] dark:text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Latest from our blog.
          </h2>
        </div>
        <button
          onClick={() => onNavigate('blog')}
          className="hidden sm:inline-flex items-center gap-2 text-sm text-[#0B192C] dark:text-blue-400 hover:underline font-mono-tech font-semibold link-underline cursor-pointer shrink-0"
        >
          View all articles →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {latestBlogs.map((blog) => (
          <div key={blog.id} className="h-full">
            <BlogCard
              blog={blog}
              onReadMore={(slug) => onNavigate('blog-detail', slug)}
            />
          </div>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-8 text-center sm:hidden">
        <button
          onClick={() => onNavigate('blog')}
          className="w-full py-3.5 px-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B192C] dark:text-white font-mono-tech font-semibold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          View All Blogs →
        </button>
      </div>
    </section>
  );
};
