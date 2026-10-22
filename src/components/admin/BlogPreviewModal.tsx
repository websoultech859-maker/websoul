import React, { useState } from 'react';
import { BlogFormData } from '../../types/blog';

interface BlogPreviewModalProps {
  formData: BlogFormData;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string, param?: string | number) => void;
}

export const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({ formData, isOpen, onClose }) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const formattedDate = formData.publishDate
    ? new Date(formData.publishDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Draft Preview';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-logo-intro">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-[#0B192C] dark:text-white font-mono-tech">
                Article Live Preview
              </h3>
              <span className="text-[11px] text-slate-500 font-mono-tech">
                /blog/{formData.slug || 'untitled-slug'}
              </span>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-xl flex items-center gap-1 text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-white dark:bg-slate-800 text-[#0B192C] dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                🖥️ Desktop
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-white dark:bg-slate-800 text-[#0B192C] dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                📱 Mobile
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer font-mono-tech font-bold"
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div
            className={`bg-white dark:bg-[#0F172A] p-6 sm:p-10 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 transition-all duration-300 w-full ${
              deviceMode === 'mobile' ? 'max-w-sm' : 'max-w-3xl'
            }`}
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-tech font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {formData.category || 'General'}
              </span>
              {formData.isFeatured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-amber-500 text-white">
                  ★ Featured
                </span>
              )}
            </div>

            <h1
              className="text-2xl sm:text-4xl font-bold text-[#0B192C] dark:text-white leading-tight mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {formData.title || 'Untitled Article'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 italic">
              {formData.excerpt || 'Article excerpt preview will display here...'}
            </p>

            <div className="flex items-center gap-3 py-3 border-y border-slate-200 dark:border-slate-800 text-xs font-mono-tech text-slate-500 mb-6">
              <span className="font-bold text-[#0B192C] dark:text-white">{formData.author || 'Author Name'}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>

            {formData.featuredImage && (
              <div className="aspect-video rounded-xl overflow-hidden mb-6 border border-slate-200 dark:border-slate-700 bg-slate-100">
                <img
                  src={formData.featuredImage}
                  alt={formData.imageAlt || 'Featured Image Preview'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content preview */}
            <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {formData.content || 'Start typing your blog article content to see the live formatted preview...'}
            </div>

            {/* Internal Links Preview */}
            {formData.internalLinks && formData.internalLinks.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold font-mono-tech uppercase text-slate-500 mb-3">
                  Related Internal Links:
                </h4>
                <div className="space-y-1.5">
                  {formData.internalLinks.map((l, i) => (
                    <div key={i} className="text-xs text-blue-600 dark:text-blue-400 font-mono-tech">
                      🔗 {l.label} ({l.url})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B192C] dark:bg-blue-600 text-white text-xs font-mono-tech font-bold cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
