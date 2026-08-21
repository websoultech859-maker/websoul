import React, { useState, useEffect } from 'react';
import { BlogPost, BlogStats } from '../../types/blog';
import { BlogStorageService } from '../../services/blogStorage';

interface AdminDashboardOverviewProps {
  onNavigate: (page: string, param?: string | number) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<BlogStats>({ total: 0, published: 0, drafts: 0, featured: 0 });
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Initial async load
    BlogStorageService.getStats().then(setStats);
    BlogStorageService.getAllBlogs().then(setBlogs);

    // Listen for updates from Firestore cache
    const handleUpdate = (e: Event) => {
      const updated = (e as CustomEvent<BlogPost[]>).detail || [];
      setBlogs(updated);
      const s: BlogStats = {
        total: updated.length,
        published: updated.filter((b) => b.isPublished).length,
        drafts: updated.filter((b) => !b.isPublished).length,
        featured: updated.filter((b) => b.isFeatured).length,
      };
      setStats(s);
    };
    window.addEventListener('websoul_blogs_updated', handleUpdate);
    return () => window.removeEventListener('websoul_blogs_updated', handleUpdate);
  }, []);

  const statCards = [
    {
      title: 'Total Blogs',
      value: stats.total,
      icon: '📚',
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40'
    },
    {
      title: 'Published Blogs',
      value: stats.published,
      icon: '✅',
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      title: 'Draft Blogs',
      value: stats.drafts,
      icon: '📝',
      color: 'from-amber-600 to-orange-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40'
    },
    {
      title: 'Featured Blogs',
      value: stats.featured,
      icon: '⭐',
      color: 'from-purple-600 to-pink-600',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B192C] via-[#1E3A8A] to-[#0B192C] text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10">
          <span className="text-xs font-mono-tech text-sky-400 uppercase tracking-widest block mb-2 font-semibold">
            WebSoul Content Control Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'white' }}>
            Welcome back, Saad! 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
            Manage public blog articles, SEO metadata, featured showcases, and rich media without modifying code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('admin-blog-new')}
            className="px-5 py-3 rounded-xl bg-white text-[#0B192C] hover:bg-slate-100 font-mono-tech font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <span>✨ Create New Blog</span>
          </button>
          <button
            onClick={() => onNavigate('blog')}
            className="px-5 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white font-mono-tech font-semibold text-xs transition-all cursor-pointer"
          >
            <span>🌐 View Public Blog ↗</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 block mb-1">
                {card.title}
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {card.value}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${card.bgColor} ${card.textColor} flex items-center justify-center text-xl shadow-xs shrink-0`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Bar */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to publish new engineering insights?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
            Publishing new content immediately updates /blog, homepage latest 3 blogs, and sitemap.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('admin-blogs')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-mono-tech font-semibold cursor-pointer"
          >
            Manage All ({blogs.length})
          </button>
          <button
            onClick={() => onNavigate('admin-blog-new')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0B192C] dark:bg-blue-600 hover:bg-[#1E3A8A] text-white text-xs font-mono-tech font-bold cursor-pointer"
          >
            + New Post
          </button>
        </div>
      </div>

      {/* Recent Blog Posts Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Recent Articles Activity
            </h3>
            <span className="text-xs text-slate-400 font-mono-tech">
              Latest created or updated articles
            </span>
          </div>
          <button
            onClick={() => onNavigate('admin-blogs')}
            className="text-xs font-mono-tech font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-tech">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4 pl-6">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Publish Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {blogs.slice(0, 5).map((blog) => (
                <tr key={blog.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-[#0B192C] dark:text-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={blog.featuredImage}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="truncate max-w-xs sm:max-w-md font-bold">
                          {blog.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          /blog/{blog.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700/60 text-[11px]">
                      {blog.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    {new Date(blog.publishDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-4">
                    {blog.isPublished ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {blog.isFeatured ? (
                      <span className="text-amber-500 font-bold">★ Yes</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={() => onNavigate('admin-blog-edit', blog.id)}
                      className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0B192C] dark:text-white font-semibold transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    {blog.isPublished && (
                      <button
                        onClick={() => onNavigate('blog-detail', blog.slug)}
                        className="px-2.5 py-1 rounded-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        title="View Public URL"
                      >
                        ↗
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
