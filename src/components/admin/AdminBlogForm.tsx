import React, { useState, useEffect } from 'react';
import { BlogFormData, InternalLink } from '../../types/blog';
import { BlogStorageService, generateSlug } from '../../services/blogStorage';
import { BlogPreviewModal } from './BlogPreviewModal';
import { uploadImageToCloudinary } from '../../lib/cloudinary';

interface AdminBlogFormProps {
  blogId?: string; // If present, editing existing blog; else creating new
  onNavigate: (page: string, param?: string | number) => void;
}

const DEFAULT_CATEGORIES = [
  'Web Development',
  'Next.js & React',
  'SEO & Performance',
  'UI/UX Design',
  'E-commerce',
  'Case Studies',
  'Engineering'
];

const PRESET_INTERNAL_LINKS: InternalLink[] = [
  { label: 'Web Development Services', url: '/services' },
  { label: 'Client Case Studies & Work', url: '/work' },
  { label: 'Transparent Pricing Packages', url: '/pricing' },
  { label: 'About WebSoul Agency', url: '/about' },
  { label: 'Request a Free Quote / Contact', url: '/contact' }
];

export const AdminBlogForm: React.FC<AdminBlogFormProps> = ({ blogId, onNavigate }) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    featuredImage: '',
    imageAlt: '',
    category: 'Web Development',
    author: 'Saad (WebSoul Lead)',
    publishDate: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    isPublished: false,
    isFeatured: false,
    tags: ['Web Development'],
    internalLinks: [PRESET_INTERNAL_LINKS[0], PRESET_INTERNAL_LINKS[4]]
  });

  const [tagInput, setTagInput] = useState('');
  const [customLinkTitle, setCustomLinkTitle] = useState('');
  const [customLinkUrl, setCustomLinkUrl] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Image upload state
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load existing blog if editing
  useEffect(() => {
    if (blogId) {
      BlogStorageService.getBlogById(blogId).then((existing) => {
        if (existing) {
          setFormData({
            title: existing.title,
            slug: existing.slug,
            featuredImage: existing.featuredImage,
            imageAlt: existing.imageAlt || '',
            category: existing.category,
            author: existing.author,
            publishDate: existing.publishDate || new Date().toISOString().split('T')[0],
            excerpt: existing.excerpt,
            content: existing.content,
            seoTitle: existing.seoTitle || '',
            seoDescription: existing.seoDescription || '',
            focusKeyword: existing.focusKeyword || '',
            isPublished: existing.isPublished,
            isFeatured: existing.isFeatured,
            tags: existing.tags || [],
            internalLinks: existing.internalLinks || []
          });
          setIsAutoSlug(false);
          // If existing image is already a URL, default to URL tab
          if (existing.featuredImage) setImageTab('url');
        }
      });
    }
  }, [blogId]);

  // Auto-generate slug and default SEO title when title changes
  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: isAutoSlug ? generateSlug(newTitle) : prev.slug,
      seoTitle: prev.seoTitle || (newTitle ? `${newTitle} | WebSoul` : '')
    }));
  };

  // Content formatting toolbar helpers
  const insertFormatting = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = document.getElementById('blog-content-editor') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = formData.content;
    const selected = current.substring(start, end) || defaultText;

    const replacement = `${prefix}${selected}${suffix}`;
    const updated = current.substring(0, start) + replacement + current.substring(end);

    setFormData((prev) => ({ ...prev, content: updated }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  // Image file upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP, etc.).');
      return;
    }
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be smaller than 10MB.');
      return;
    }

    setUploadError(null);
    setUploadProgress(0);

    try {
      const url = await uploadImageToCloudinary(file, (percent) => {
        setUploadProgress(percent);
      });
      setFormData((prev) => ({ ...prev, featuredImage: url }));
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 1500);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      setUploadProgress(null);
    }

    // Reset file input
    e.target.value = '';
  };

  // Tag Handlers
  const addTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove)
    }));
  };

  // Internal Link Handlers
  const addInternalLink = () => {
    if (customLinkTitle.trim() && customLinkUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        internalLinks: [...prev.internalLinks, { label: customLinkTitle.trim(), url: customLinkUrl.trim() }]
      }));
      setCustomLinkTitle('');
      setCustomLinkUrl('');
    }
  };

  const addPresetLink = (preset: InternalLink) => {
    if (!formData.internalLinks.some((l) => l.url === preset.url)) {
      setFormData((prev) => ({
        ...prev,
        internalLinks: [...prev.internalLinks, preset]
      }));
    }
  };

  const removeInternalLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      internalLinks: prev.internalLinks.filter((_, i) => i !== index)
    }));
  };

  // Validation function
  const validateForm = async (isPublishing: boolean): Promise<boolean> => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push('Blog Title is required.');
    }

    const cleanSlug = generateSlug(formData.slug || formData.title);
    if (!cleanSlug) {
      errors.push('A valid URL Slug is required.');
    } else {
      const isUnique = await BlogStorageService.isSlugUnique(cleanSlug, blogId);
      if (!isUnique) {
        errors.push(`URL Slug "${cleanSlug}" is already taken by another blog. Please enter a unique slug.`);
      }
    }

    if (isPublishing) {
      if (!formData.seoTitle.trim()) errors.push('SEO Meta Title is required before publishing.');
      if (!formData.seoDescription.trim()) errors.push('SEO Meta Description is required before publishing.');
      if (!formData.imageAlt.trim()) errors.push('Image Alt Text is required for SEO accessibility before publishing.');
      if (!formData.featuredImage.trim()) errors.push('Featured Image is required before publishing.');
      if (!formData.excerpt.trim()) errors.push('Short Excerpt is required before publishing.');
      if (!formData.content.trim() || formData.content.length < 50) {
        errors.push('Complete Blog Content must contain at least 50 characters before publishing.');
      }
      if (!formData.category.trim()) errors.push('Category selection is required.');
      if (!formData.author.trim()) errors.push('Author name is required.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async (publishState: boolean) => {
    setSuccessMessage(null);
    setIsSaving(true);

    const updatedData: BlogFormData = {
      ...formData,
      isPublished: publishState,
      slug: generateSlug(formData.slug || formData.title)
    };

    const isValid = await validateForm(publishState);
    if (!isValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSaving(false);
      return;
    }

    const result = await BlogStorageService.saveBlog(updatedData, blogId);
    setIsSaving(false);

    if (result.success) {
      setSuccessMessage(
        publishState
          ? '🎉 Blog article successfully published! It is now live at /blog and on Google sitemap.'
          : '💾 Draft successfully saved! You can continue editing anytime.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        onNavigate('admin-blogs');
      }, 1200);
    } else {
      setValidationErrors([result.error || 'Failed to save blog post.']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('admin-blogs')}
            className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-slate-500 hover:text-[#0B192C] dark:hover:text-white mb-2 cursor-pointer"
          >
            ← Back to All Blogs
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {blogId ? 'Edit Blog Article' : 'Create New Blog Article'}
          </h2>
          <span className="text-xs text-slate-400 font-mono-tech">
            {formData.isPublished ? '● Status: Published' : '○ Status: Draft'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-mono-tech font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>👁️</span>
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-mono-tech font-bold hover:bg-amber-100 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? '⏳ Saving...' : '💾 Save Draft'}
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#0B192C] dark:bg-blue-600 hover:bg-[#1E3A8A] dark:hover:bg-blue-500 text-white text-xs font-mono-tech font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>🚀</span>
            <span>{isSaving ? 'Publishing...' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono-tech flex items-center gap-3 animate-logo-intro">
          <span className="text-xl">✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Validation Errors Banner */}
      {validationErrors.length > 0 && (
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-mono-tech space-y-1.5 animate-logo-intro">
          <div className="font-bold flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
            <span>⚠️</span>
            <span>Please complete all required fields before publishing:</span>
          </div>
          <ul className="list-disc pl-6 space-y-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Main Article Fields) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Title & Slug */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B192C] dark:text-white font-mono-tech pb-2 border-b border-slate-100 dark:border-slate-700">
              1. Title & URL Slug
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. 10 Signs Your Business Needs a New Website in 2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-[#0B192C] dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#0B192C]"
              />
            </div>

            {/* URL Slug */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  URL Slug <span className="text-red-500">*</span> (SEO-friendly & Unique)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoSlug(true);
                    setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
                  }}
                  className="text-[11px] font-mono-tech text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  ⚡ Re-generate from Title
                </button>
              </div>
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden text-xs font-mono-tech">
                <span className="px-3.5 py-3 text-slate-400 border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 select-none">
                  /blog/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setIsAutoSlug(false);
                    setFormData({ ...formData, slug: generateSlug(e.target.value) });
                  }}
                  placeholder="10-signs-your-business-needs-a-new-website"
                  className="w-full px-3.5 py-3 text-[#0B192C] dark:text-white focus:outline-none bg-transparent"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono-tech mt-1">
                Final URL: https://www.websoul.tech/blog/{formData.slug || 'your-slug-here'}
              </p>
            </div>
          </div>

          {/* Section 2: Excerpt & Rich Content Editor */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B192C] dark:text-white font-mono-tech pb-2 border-b border-slate-100 dark:border-slate-700">
              2. Excerpt & Complete Blog Content
            </h3>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Short Excerpt <span className="text-red-500">*</span> (Displayed on card & meta preview)
              </label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A compelling 2-sentence summary of the article..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-[#0B192C] dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#0B192C]"
              />
            </div>

            {/* Complete Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Complete Blog Content <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono-tech">
                  {formData.content.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              {/* Formatting Toolbar */}
              <div className="p-2 rounded-t-xl border border-b-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex flex-wrap gap-1 text-xs font-mono-tech">
                <button
                  type="button"
                  onClick={() => insertFormatting('## ', '\n', 'Heading 2')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-bold"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('### ', '\n', 'Heading 3')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-bold"
                  title="Heading 3"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**', 'bold text')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-bold"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*', 'italic text')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 italic"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('* ', '\n', 'List item')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('1. ', '\n', 'Numbered item')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  title="Numbered List"
                >
                  1. List
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ', '\n', 'Important quote or highlight')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  title="Quote"
                >
                  " Quote
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('```\n', '\n```', '// Code snippet')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  title="Code Block"
                >
                  &lt;/&gt; Code
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('[', '](/services)', 'Link text')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-blue-600 dark:text-blue-400 font-bold"
                  title="Insert Link"
                >
                  🔗 Link
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n---\n')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  title="Divider"
                >
                  — Divider
                </button>
              </div>

              {/* Textarea */}
              <textarea
                id="blog-content-editor"
                rows={16}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your article using headings (##), bullet points (*), blockquotes (>), links [text](url), etc..."
                className="w-full p-4 rounded-b-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-mono-tech text-[#0B192C] dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#0B192C] leading-relaxed"
              />
            </div>
          </div>

          {/* Section 3: SEO Meta Fields (Mandatory) */}
          <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-blue-800/40">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B192C] dark:text-blue-300 font-mono-tech flex items-center gap-2">
                <span>🎯 3. SEO Metadata (Required for Publishing)</span>
              </h3>
              <span className="text-[10px] font-mono-tech font-bold uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                Mandatory
              </span>
            </div>

            {/* Focus Keyword */}
            <div>
              <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Focus Keyword / Primary Keyword
              </label>
              <input
                type="text"
                value={formData.focusKeyword}
                onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                placeholder="e.g. business website redesign"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-[#0B192C] dark:text-white focus:outline-none focus:border-blue-500 font-mono-tech"
              />
            </div>

            {/* SEO Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  SEO Meta Title <span className="text-red-500">*</span>
                </label>
                <span className={`text-[11px] font-mono-tech ${formData.seoTitle.length > 60 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {formData.seoTitle.length} / 60 chars (recommended)
                </span>
              </div>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="e.g. 10 Signs Your Business Needs a New Website in 2026 | WebSoul"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-[#0B192C] dark:text-white focus:outline-none focus:border-blue-500 font-mono-tech"
              />
            </div>

            {/* SEO Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  SEO Meta Description <span className="text-red-500">*</span>
                </label>
                <span className={`text-[11px] font-mono-tech ${formData.seoDescription.length > 160 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {formData.seoDescription.length} / 160 chars (recommended)
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="e.g. Discover the top 10 warning signs that your website is losing revenue. Learn how modern React & Next.js web development accelerates conversions."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-[#0B192C] dark:text-white focus:outline-none focus:border-blue-500 font-mono-tech"
              />
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <span className="text-[10px] font-mono-tech uppercase font-bold text-slate-400 block mb-2">
                Google Search Result Snippet Preview
              </span>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-mono-tech truncate">
                https://www.websoul.tech › blog › {formData.slug || 'slug'}
              </div>
              <div className="text-base text-blue-700 dark:text-blue-400 font-medium hover:underline cursor-pointer truncate mt-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>
                {formData.seoTitle || formData.title || 'Your Article SEO Title'}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
                {formData.seoDescription || formData.excerpt || 'Your meta description snippet will show up on Google search engine results.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Settings: Image, Category, Author, Tags, Internal Links) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publish / Featured Settings Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B192C] dark:text-white font-mono-tech pb-2 border-b border-slate-100 dark:border-slate-700">
              Publishing Settings
            </h3>

            {/* Status Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs font-bold text-[#0B192C] dark:text-white font-mono-tech block">
                  Status
                </span>
                <span className="text-[11px] text-slate-400 font-mono-tech">
                  {formData.isPublished ? 'Live on website' : 'Saved as private draft'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }))}
                className={`px-3 py-1.5 rounded-full text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer ${
                  formData.isPublished
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {formData.isPublished ? 'Published' : 'Draft'}
              </button>
            </div>

            {/* Featured Blog Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs font-bold text-[#0B192C] dark:text-white font-mono-tech block">
                  Featured Blog
                </span>
                <span className="text-[11px] text-slate-400 font-mono-tech">
                  Spotlight on Homepage
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                className={`px-3 py-1.5 rounded-full text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                  formData.isFeatured
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {formData.isFeatured ? '★ Featured' : '☆ Off'}
              </button>
            </div>

            {/* Publication Date */}
            <div>
              <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Publication Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono-tech text-[#0B192C] dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* ─── Featured Image Card (Cloudinary Upload) ─── */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B192C] dark:text-white font-mono-tech pb-2 border-b border-slate-100 dark:border-slate-700">
              Featured Image & SEO Alt Text
            </h3>

            {/* Tab Switcher */}
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex-1 py-2 font-bold transition-all cursor-pointer ${
                  imageTab === 'upload'
                    ? 'bg-[#0B192C] dark:bg-blue-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                ☁️ Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex-1 py-2 font-bold transition-all cursor-pointer ${
                  imageTab === 'url'
                    ? 'bg-[#0B192C] dark:bg-blue-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🔗 Paste URL
              </button>
            </div>

            {/* Upload Tab */}
            {imageTab === 'upload' && (
              <div className="space-y-3">
                <label
                  htmlFor="blog-image-upload"
                  className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    uploadProgress !== null
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30'
                      : 'border-slate-300 dark:border-slate-700 hover:border-[#0B192C] dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  {uploadProgress !== null ? (
                    <>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono-tech text-blue-600 dark:text-blue-400 font-bold">
                        {uploadProgress === 100 ? '✅ Upload complete!' : `Uploading to Cloudinary... ${uploadProgress}%`}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🖼️</span>
                      <div className="text-center">
                        <span className="text-xs font-mono-tech font-bold text-[#0B192C] dark:text-white block">
                          Click to select image
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono-tech">
                          JPG, PNG, WebP — Max 10MB
                        </span>
                      </div>
                    </>
                  )}
                  <input
                    id="blog-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                    disabled={uploadProgress !== null}
                  />
                </label>

                {/* Upload Error */}
                {uploadError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-mono-tech text-red-600 dark:text-red-400">
                    ⚠️ {uploadError}
                  </div>
                )}

                {/* Uploaded URL display */}
                {formData.featuredImage && (
                  <div className="text-[11px] font-mono-tech text-emerald-600 dark:text-emerald-400 break-all bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    ✅ Cloudinary URL set
                  </div>
                )}
              </div>
            )}

            {/* URL Tab */}
            {imageTab === 'url' && (
              <div>
                <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Featured Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono-tech text-[#0B192C] dark:text-white focus:outline-none"
                />
              </div>
            )}

            {/* Image Alt Text (Required) */}
            <div>
              <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Image Alt Text <span className="text-red-500">*</span> (Required for SEO)
              </label>
              <input
                type="text"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                placeholder="Descriptive alt text for Google image crawlers..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono-tech text-[#0B192C] dark:text-white focus:outline-none"
              />
            </div>

            {/* Image Preview */}
            {formData.featuredImage ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 relative">
                <img
                  src={formData.featuredImage}
                  alt={formData.imageAlt || 'Featured Image'}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, featuredImage: '' }))}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer font-bold shadow"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs font-mono-tech text-slate-400">
                No image preview available yet
              </div>
            )}
          </div>

          {/* Category & Author Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B192C] dark:text-white font-mono-tech pb-2 border-b border-slate-100 dark:border-slate-700">
              Category & Author
            </h3>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono-tech text-[#0B192C] dark:text-white focus:outline-none cursor-pointer"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono-tech text-[#0B192C] dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Tags Manager Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B192C] dark:text-white font-mono-tech pb-2 border-b border-slate-100 dark:border-slate-700">
              Tags (Optional)
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag (e.g. Next.js)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono-tech text-[#0B192C] dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3.5 py-2 rounded-xl bg-[#0B192C] dark:bg-blue-600 text-white text-xs font-mono-tech font-bold"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono-tech bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Related / Internal Links Builder Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B192C] dark:text-white font-mono-tech pb-2 border-b border-slate-100 dark:border-slate-700">
              Related / Internal Links
            </h3>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-mono-tech text-slate-400 block mb-2">
                Quick WebSoul Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_INTERNAL_LINKS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => addPresetLink(preset)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono-tech hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Link Inputs */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={customLinkTitle}
                onChange={(e) => setCustomLinkTitle(e.target.value)}
                placeholder="Link Label (e.g. View Our Pricing)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono-tech"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLinkUrl}
                  onChange={(e) => setCustomLinkUrl(e.target.value)}
                  placeholder="URL (e.g. /pricing)"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono-tech"
                />
                <button
                  type="button"
                  onClick={addInternalLink}
                  className="px-3.5 py-2 rounded-xl bg-[#0B192C] dark:bg-blue-600 text-white text-xs font-mono-tech font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Configured Links */}
            <div className="space-y-1.5">
              {formData.internalLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono-tech"
                >
                  <div className="truncate">
                    <span className="font-bold text-[#0B192C] dark:text-white">{link.label}</span>
                    <span className="text-slate-400 ml-1">({link.url})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInternalLink(idx)}
                    className="text-red-500 hover:text-red-700 font-bold ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <BlogPreviewModal
        formData={formData}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
};
