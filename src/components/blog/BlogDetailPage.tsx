import React, { useEffect, useState } from 'react';
import { BlogPost } from '../../types/blog';
import { BlogStorageService } from '../../services/blogStorage';

interface BlogDetailPageProps {
  slug: string;
  onNavigate: (page: string, param?: string | number) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug, onNavigate }) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const normalized = slug.trim().toLowerCase();

    BlogStorageService.getAllBlogs().then((allBlogs) => {
      const allPublished = allBlogs.filter((b) => b.isPublished);
      const found = allBlogs.find((b) => b.slug.toLowerCase() === normalized) || null;
      setBlog(found);

      if (found) {
        const currentIndex = allPublished.findIndex((b) => b.id === found.id);
        setPrevPost(currentIndex > 0 ? allPublished[currentIndex - 1] : null);
        setNextPost(
          currentIndex >= 0 && currentIndex < allPublished.length - 1
            ? allPublished[currentIndex + 1]
            : null
        );
        setRelatedPosts(
          allPublished
            .filter((b) => b.id !== found.id && (b.category === found.category || b.isFeatured))
            .slice(0, 2)
        );
      }
      setIsLoading(false);
    });
  }, [slug]);

  // Dynamic SEO Injection for Blog Article
  useEffect(() => {
    if (!blog) return;

    const pageTitle = blog.seoTitle || `${blog.title} | WebSoul Blog`;
    const pageDesc = blog.seoDescription || blog.excerpt;
    const canonicalUrl = `https://www.websoul.tech/blog/${blog.slug}`;
    const imageUrl = blog.featuredImage.startsWith('http') ? blog.featuredImage : `https://www.websoul.tech${blog.featuredImage}`;

    document.title = pageTitle;

    // Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    // Canonical
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', canonicalUrl);

    // Robots
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      if (blog.isPublished) {
        metaRobots.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      } else {
        metaRobots.setAttribute('content', 'noindex, nofollow');
      }
    }

    // OpenGraph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', imageUrl);

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute('content', 'article');

    // Twitter
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', pageTitle);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', pageDesc);

    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', canonicalUrl);

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', imageUrl);

    // JSON-LD Article Schema
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      headline: blog.title,
      description: pageDesc,
      image: [imageUrl],
      datePublished: blog.publishDate,
      dateModified: blog.updatedAt || blog.publishDate,
      author: {
        '@type': 'Person',
        name: blog.author,
        url: 'https://www.websoul.tech/about'
      },
      publisher: {
        '@type': 'Organization',
        name: 'WebSoul',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.websoul.tech/websoul_logo/header_logo-removebg-preview.png'
        }
      },
      keywords: [blog.focusKeyword, blog.category, ...(blog.tags || [])].filter(Boolean).join(', ')
    };

    let scriptTag = document.getElementById('blog-article-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'blog-article-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(articleSchema);

    // JSON-LD Breadcrumb Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.websoul.tech/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://www.websoul.tech/blog'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: blog.title,
          item: canonicalUrl
        }
      ]
    };

    let breadcrumbTag = document.getElementById('blog-breadcrumb-jsonld') as HTMLScriptElement | null;
    if (!breadcrumbTag) {
      breadcrumbTag = document.createElement('script');
      breadcrumbTag.id = 'blog-breadcrumb-jsonld';
      breadcrumbTag.type = 'application/ld+json';
      document.head.appendChild(breadcrumbTag);
    }
    breadcrumbTag.textContent = JSON.stringify(breadcrumbSchema);

    return () => {
      const aTag = document.getElementById('blog-article-jsonld');
      if (aTag) aTag.remove();
      const bTag = document.getElementById('blog-breadcrumb-jsonld');
      if (bTag) bTag.remove();
    };
  }, [blog]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <span className="text-4xl mb-4 animate-spin inline-block">⏳</span>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono-tech">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <span className="text-4xl font-mono-tech font-bold text-slate-400 mb-4">404</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B192C] dark:text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Article Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md">
          The blog article you requested does not exist or may have been unpublished.
        </p>
        <button
          onClick={() => onNavigate('blog')}
          className="px-6 py-3 rounded-xl bg-[#0B192C] dark:bg-blue-600 text-white font-mono-tech font-semibold text-xs sm:text-sm shadow-md hover:bg-[#1E3A8A] cursor-pointer"
        >
          ← Return to All Articles
        </button>
      </div>
    );
  }


  // Format date
  const formattedDate = new Date(blog.publishDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="pt-24 sm:pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0F172A] transition-colors duration-300">
      {/* Top Breadcrumb & Back Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 text-xs font-mono-tech">
        <button
          onClick={() => onNavigate('blog')}
          className="inline-flex items-center gap-1.5 text-[#0B192C] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
        >
          ← Back to All Articles
        </button>

        <nav aria-label="Breadcrumb" className="text-slate-400 flex items-center gap-2">
          <span
            onClick={() => onNavigate('home')}
            className="hover:text-[#0B192C] dark:hover:text-white cursor-pointer"
          >
            Home
          </span>
          <span>/</span>
          <span
            onClick={() => onNavigate('blog')}
            className="hover:text-[#0B192C] dark:hover:text-white cursor-pointer"
          >
            Blog
          </span>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300 truncate max-w-[180px] sm:max-w-xs font-medium">
            {blog.category}
          </span>
        </nav>
      </div>

      {/* Article Header */}
      <header className="mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/30">
            {blog.category}
          </span>
          {blog.isFeatured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              ★ Featured Post
            </span>
          )}
          <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400">
            {blog.readingTimeMinutes || 5} min read
          </span>
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B192C] dark:text-white leading-tight mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {blog.title}
        </h1>

        <p className="text-base sm:text-xl text-[#475569] dark:text-slate-300 leading-relaxed mb-6 font-normal">
          {blog.excerpt}
        </p>

        {/* Author Details & Date */}
        <div className="flex items-center gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
          <img
            src="/favicon.png"
            alt="WebSoul"
            className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 block dark:hidden"
          />
          <img
            src="/websoul_logo/favicondark.png"
            alt="WebSoul"
            className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 hidden dark:block"
          />
          <div>
            <div className="text-sm font-bold text-[#0B192C] dark:text-white font-mono-tech">
              {blog.author}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech flex items-center gap-2">
              <span>{blog.authorRole || 'Senior Full-Stack Engineer'}</span>
              <span>•</span>
              <time dateTime={blog.publishDate}>{formattedDate}</time>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Banner Image with SEO Alt Text */}
      <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-10 sm:mb-14 shadow-lg bg-slate-100 dark:bg-slate-900">
        <img
          src={blog.featuredImage}
          alt={blog.imageAlt || blog.title}
          width="1200"
          height="675"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Blog Content Body */}
      <div className="blog-prose space-y-6 text-[#334155] dark:text-slate-300 text-base sm:text-lg leading-relaxed">
        {renderRichContent(blog.content, onNavigate)}
      </div>

      {/* Tags Section */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs uppercase tracking-widest font-mono-tech text-slate-500 dark:text-slate-400 font-semibold mb-3">
            Article Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg text-xs font-mono-tech bg-slate-100 dark:bg-slate-800 text-[#0B192C] dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related / Internal Links Box */}
      {blog.internalLinks && blog.internalLinks.length > 0 && (
        <section className="mt-10 p-6 sm:p-8 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔗</span>
            <h4 className="text-sm sm:text-base font-bold text-[#0B192C] dark:text-blue-300 font-mono-tech uppercase tracking-wide">
              Related WebSoul Pages & Services
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 mb-4">
            Explore relevant services and case studies mentioned in this guide:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {blog.internalLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                onClick={(e) => {
                  if (link.url.startsWith('/')) {
                    e.preventDefault();
                    const route = link.url.replace(/^\//, '') || 'home';
                    if (route.startsWith('blog/')) {
                      onNavigate('blog-detail', route.replace('blog/', ''));
                    } else {
                      onNavigate(route);
                    }
                  }
                }}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-semibold text-[#0B192C] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 font-mono-tech">
                  {link.label}
                </span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform text-xs">
                  →
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Author Bio Box */}
      <div className="mt-10 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <img
          src="/favicon.png"
          alt="WebSoul"
          className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 block dark:hidden shrink-0"
        />
        <img
          src="/websoul_logo/favicondark.png"
          alt="WebSoul"
          className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 hidden dark:block shrink-0"
        />
        <div>
          <h4 className="text-base font-bold text-[#0B192C] dark:text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Written by {blog.author}
          </h4>
          <p className="text-xs font-mono-tech text-blue-600 dark:text-blue-400 mb-2">
            {blog.authorRole || 'Founder & Full-Stack Architect at WebSoul'}
          </p>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
            Engineering high-performance web products, React applications, and custom digital platforms with sub-second speeds and bulletproof technical SEO.
          </p>
        </div>
      </div>

      {/* Next / Previous Article Navigation */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevPost ? (
          <div
            onClick={() => onNavigate('blog-detail', prevPost.slug)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-800/60 transition-all cursor-pointer group"
          >
            <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400 block mb-1">
              ← Previous Article
            </span>
            <h5 className="text-sm font-bold text-[#0B192C] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
              {prevPost.title}
            </h5>
          </div>
        ) : <div />}

        {nextPost ? (
          <div
            onClick={() => onNavigate('blog-detail', nextPost.slug)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-800/60 transition-all cursor-pointer group sm:text-right"
          >
            <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400 block mb-1">
              Next Article →
            </span>
            <h5 className="text-sm font-bold text-[#0B192C] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
              {nextPost.title}
            </h5>
          </div>
        ) : <div />}
      </div>
    </article>
  );
};

// Rich Content Renderer Helper
function renderRichContent(content: string, onNavigate: (page: string, param?: string | number) => void) {
  if (!content) return null;

  const sections = content.split('\n\n');

  return sections.map((sec, idx) => {
    const trimmed = sec.trim();
    if (!trimmed) return null;

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      return <hr key={idx} className="my-8 border-slate-200 dark:border-slate-800" />;
    }

    // Headings
    if (trimmed.startsWith('## ')) {
      return (
        <h2
          key={idx}
          className="text-2xl sm:text-3xl font-bold text-[#0B192C] dark:text-white mt-10 mb-4 pt-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {trimmed.replace('## ', '')}
        </h2>
      );
    }
    if (trimmed.startsWith('### ')) {
      return (
        <h3
          key={idx}
          className="text-xl sm:text-2xl font-bold text-[#0B192C] dark:text-slate-100 mt-8 mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {trimmed.replace('### ', '')}
        </h3>
      );
    }
    if (trimmed.startsWith('#### ')) {
      return (
        <h4
          key={idx}
          className="text-lg sm:text-xl font-bold text-[#0B192C] dark:text-slate-100 mt-6 mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {trimmed.replace('#### ', '')}
        </h4>
      );
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote
          key={idx}
          className="p-5 my-6 border-l-4 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-slate-800/80 rounded-r-xl italic text-slate-700 dark:text-slate-200 text-base sm:text-lg"
        >
          {renderFormattedInlineText(trimmed.replace(/^>\s*/, ''), onNavigate)}
        </blockquote>
      );
    }

    // Code Block
    if (trimmed.startsWith('```')) {
      const codeLines = trimmed.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
      return (
        <div key={idx} className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#0B192C] text-slate-200 p-5 font-mono-tech text-xs sm:text-sm overflow-x-auto shadow-lg">
          <pre>
            <code>{codeLines}</code>
          </pre>
        </div>
      );
    }

    // Table
    if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
      const rows = trimmed.split('\n').filter((r) => r.trim().startsWith('|'));
      const headerRow = rows[0]?.split('|').map((c) => c.trim()).filter(Boolean);
      const dataRows = rows.slice(2); // Skip separator row

      return (
        <div key={idx} className="my-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-[#0B192C] dark:text-white font-mono-tech border-b border-slate-200 dark:border-slate-700">
              <tr>
                {headerRow?.map((h, i) => (
                  <th key={i} className="p-3.5 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {dataRows.map((rowStr, rIdx) => {
                const cols = rowStr.split('|').map((c) => c.trim()).filter(Boolean);
                return (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    {cols.map((col, cIdx) => (
                      <td key={cIdx} className="p-3.5 text-slate-700 dark:text-slate-300">
                        {renderFormattedInlineText(col, onNavigate)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // Unordered List
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.trim().startsWith('* ') || l.trim().startsWith('- '));
      return (
        <ul key={idx} className="my-4 space-y-2 list-none pl-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2.5 shrink-0" />
              <span>{renderFormattedInlineText(item.replace(/^[*|-]\s*/, ''), onNavigate)}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Ordered List
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
      return (
        <ol key={idx} className="my-4 space-y-2.5 pl-2">
          {items.map((item, i) => {
            const numMatch = item.match(/^(\d+)\.\s/);
            const num = numMatch ? numMatch[1] : `${i + 1}`;
            const text = item.replace(/^\d+\.\s/, '');
            return (
              <li key={i} className="flex items-start gap-3">
                <span className="font-mono-tech font-bold text-xs px-2 py-0.5 rounded bg-[#0B192C]/10 dark:bg-blue-900/50 text-[#0B192C] dark:text-blue-300 shrink-0 mt-0.5">
                  {num}
                </span>
                <span>{renderFormattedInlineText(text, onNavigate)}</span>
              </li>
            );
          })}
        </ol>
      );
    }

    // Regular Paragraph
    return (
      <p key={idx} className="leading-relaxed">
        {renderFormattedInlineText(trimmed, onNavigate)}
      </p>
    );
  });
}

function renderFormattedInlineText(text: string, onNavigate: (page: string, param?: string | number) => void): React.ReactNode {
  // Replace links [label](url), bold **text**, inline `code`
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      parts.push(parseBoldAndCode(text.substring(lastIndex, matchIndex)));
    }

    const label = match[1];
    const url = match[2];

    if (url.startsWith('/')) {
      parts.push(
        <button
          key={`link-${matchIndex}`}
          type="button"
          onClick={() => {
            const route = url.replace(/^\//, '') || 'home';
            if (route.startsWith('blog/')) {
              onNavigate('blog-detail', route.replace('blog/', ''));
            } else {
              onNavigate(route);
            }
          }}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer inline"
        >
          {label}
        </button>
      );
    } else {
      parts.push(
        <a
          key={`ext-${matchIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline"
        >
          {label}
        </a>
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(parseBoldAndCode(text.substring(lastIndex)));
  }

  return parts.length > 0 ? parts : parseBoldAndCode(text);
}

function parseBoldAndCode(text: string): React.ReactNode {
  // Process bold (**...**) and inline code (`...`)
  const segments = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[#0B192C] dark:text-white">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    if (seg.startsWith('`') && seg.endsWith('`')) {
      return (
        <code
          key={i}
          className="font-mono-tech text-xs sm:text-sm px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#0B192C] dark:text-sky-300 border border-slate-200 dark:border-slate-700"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    return seg;
  });
}
