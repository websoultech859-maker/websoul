import React from 'react';
import { BlogPost } from '../../types/blog';

interface BlogCardProps {
  blog: BlogPost;
  onReadMore: (slug: string) => void;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onReadMore, featured = false }) => {
  const formattedDate = new Date(blog.publishDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article
      onClick={() => onReadMore(blog.slug)}
      className={`card-hover glimmer rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group h-full ${
        featured ? 'ring-2 ring-blue-500/20 dark:ring-blue-400/20' : ''
      }`}
    >
      {/* Featured Image Container */}
      <div className="aspect-[16/10] overflow-hidden relative bg-slate-100 dark:bg-slate-900">
        <img
          src={blog.featuredImage}
          alt={blog.imageAlt || blog.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-xs font-bold font-mono-tech text-white bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30">
            Read Article →
          </span>
        </div>

        {/* Category Pill on image */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono-tech font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 text-[#0B192C] dark:text-blue-300 shadow-sm border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xs">
            {blog.category}
          </span>
          {blog.isFeatured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
              ★ Featured
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
        <div>
          {/* Metadata Row: Date & Reading Time */}
          <div className="flex items-center gap-3 text-xs font-mono-tech text-slate-500 dark:text-slate-400 mb-2.5">
            <time dateTime={blog.publishDate}>{formattedDate}</time>
            <span>•</span>
            <span>{blog.readingTimeMinutes || 5} min read</span>
          </div>

          {/* Title */}
          <h3
            className="text-lg sm:text-xl font-bold text-[#0B192C] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 mb-2.5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
            {blog.excerpt}
          </p>
        </div>

        {/* Footer Area: Author & Tags */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/favicon.png"
                alt="WebSoul"
                className="w-7 h-7 rounded-full object-cover border border-slate-200 block dark:hidden"
              />
              <img
                src="/websoul_logo/favicondark.png"
                alt="WebSoul"
                className="w-7 h-7 rounded-full object-cover border border-slate-700/60 hidden dark:block"
              />
              <span className="text-xs font-medium text-[#334155] dark:text-slate-300 truncate font-mono-tech">
                {blog.author}
              </span>
            </div>

            <span className="text-xs font-mono-tech font-semibold text-[#0B192C] dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
              Read More →
            </span>
          </div>

          {/* Tags preview if present */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
