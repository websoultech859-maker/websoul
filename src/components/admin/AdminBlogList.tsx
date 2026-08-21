import React, { useState, useEffect, useMemo } from 'react';
import { BlogPost, BlogFormData } from '../../types/blog';
import { BlogStorageService } from '../../services/blogStorage';
import { BlogPreviewModal } from './BlogPreviewModal';

interface AdminBlogListProps {
  onNavigate: (page: string, param?: string | number) => void;
}

export const AdminBlogList: React.FC<AdminBlogListProps> = ({ onNavigate }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [featuredFilter, setFeaturedFilter] = useState<'All' | 'Featured'>('All');

  // Preview & Delete Modals State
  const [previewBlogData, setPreviewBlogData] = useState<BlogFormData | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Initial async load
    BlogStorageService.getAllBlogs().then((data) => {
      setBlogs(data);
      setIsLoading(false);
    });

    // Listen for Firestore-triggered cache updates
    const handleUpdate = (e: Event) => {
      const updated = (e as CustomEvent<BlogPost[]>).detail;
      setBlogs(updated || []);
    };
    window.addEventListener('websoul_blogs_updated', handleUpdate);
    return () => window.removeEventListener('websoul_blogs_updated', handleUpdate);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => set.add(b.category));
    return ['All', ...Array.from(set)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Category filter
      if (categoryFilter !== 'All' && blog.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
      // Status filter
      if (statusFilter === 'Published' && !blog.isPublished) return false;
      if (statusFilter === 'Draft' && blog.isPublished) return false;

      // Featured filter
      if (featuredFilter === 'Featured' && !blog.isFeatured) return false;

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        blog.title.toLowerCase().includes(q) ||
        blog.slug.toLowerCase().includes(q) ||
        blog.category.toLowerCase().includes(q) ||
        blog.author.toLowerCase().includes(q) ||
        (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [blogs, categoryFilter, statusFilter, featuredFilter, searchQuery]);

  const handleTogglePublish = async (id: string) => {
    setActionLoadingId(id);
    await BlogStorageService.togglePublish(id);
    setActionLoadingId(null);
  };

  const handleToggleFeatured = async (id: string) => {
    setActionLoadingId(id);
    await BlogStorageService.toggleFeatured(id);
    setActionLoadingId(null);
  };

  const confirmDelete = async () => {
    if (blogToDelete) {
      setActionLoadingId(blogToDelete.id);
      await BlogStorageService.deleteBlog(blogToDelete.id);
      setBlogToDelete(null);
      setActionLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 font-mono-tech text-sm">
        <span className="animate-spin mr-3 text-xl">⏳</span> Loading blogs from Firestore...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            All Blog Articles ({blogs.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech mt-0.5">
            Search, filter, edit, publish/draft toggle, and manage live articles.
          </p>
        </div>

        <button
          onClick={() => onNavigate('admin-blog-new')}
          className="px-5 py-3 rounded-xl bg-[#0B192C] dark:bg-blue-600 hover:bg-[#1E3A8A] dark:hover:bg-blue-500 text-white font-mono-tech font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>✨ Create New Blog</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, slug, tag, author..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-[#0B192C] dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#0B192C] font-mono-tech"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-mono-tech"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono-tech text-xs">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>

          {/* Featured */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All">Featured: All</option>
            <option value="Featured">★ Featured Only</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 overflow-hidden shadow-xs">
        {filteredBlogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-tech">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4 pl-6">Article & Slug</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Article & Image */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={blog.featuredImage}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs sm:max-w-sm md:max-w-md">
                          <div className="font-bold text-[#0B192C] dark:text-white truncate text-sm">
                            {blog.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            /blog/{blog.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700/60 text-[11px] font-medium">
                        {blog.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {blog.author}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(blog.publishDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Publish/Draft Toggle Button */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(blog.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          blog.isPublished
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-200'
                            : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-200'
                        }`}
                        title="Click to toggle Published / Draft"
                      >
                        {blog.isPublished ? '● Published' : '○ Draft'}
                      </button>
                    </td>

                    {/* Featured Toggle Button */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(blog.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          blog.isFeatured
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                        }`}
                        title={blog.isFeatured ? 'Featured on Homepage (Click to disable)' : 'Mark as Featured on Homepage'}
                      >
                        {blog.isFeatured ? '★ Featured' : '☆ Off'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setPreviewBlogData(blog as any)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                        title="Live Preview"
                      >
                        Preview
                      </button>

                      <button
                        onClick={() => onNavigate('admin-blog-edit', blog.id)}
                        className="px-3 py-1 rounded-lg bg-[#0B192C] dark:bg-blue-600 hover:bg-[#1E3A8A] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setBlogToDelete(blog)}
                        className="px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center p-6">
            <span className="text-3xl block mb-2">📄</span>
            <h3 className="text-base font-bold text-[#0B192C] dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              No blogs found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Try adjusting your search criteria or create your first blog article.
            </p>
            <button
              onClick={() => onNavigate('admin-blog-new')}
              className="px-4 py-2 rounded-xl bg-[#0B192C] dark:bg-blue-600 text-white text-xs font-mono-tech font-bold cursor-pointer"
            >
              + Create New Blog
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-logo-intro">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl mx-auto mb-4">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-center text-[#0B192C] dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Delete Blog Article?
            </h3>
            <p className="text-xs sm:text-sm text-center text-slate-600 dark:text-slate-400 mb-6 font-mono-tech leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#0B192C] dark:text-white">"{blogToDelete.title}"</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBlogToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono-tech text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono-tech text-xs font-bold shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewBlogData && (
        <BlogPreviewModal
          formData={previewBlogData}
          isOpen={!!previewBlogData}
          onClose={() => setPreviewBlogData(null)}
        />
      )}
    </div>
  );
};
