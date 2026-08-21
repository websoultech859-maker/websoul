import React, { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'overview' | 'blogs' | 'new' | 'edit';
  onNavigate: (page: string, param?: string | number) => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  title?: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onNavigate,
  darkMode,
  toggleDarkMode,
  title,
  subtitle,
  actionButton
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const user = AuthService.getCurrentUser();

  // Authentication guard
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      onNavigate('admin-login');
    }
  }, [onNavigate]);

  const handleLogout = () => {
    AuthService.logout();
    onNavigate('admin-login');
  };

  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: '📊',
      route: 'admin'
    },
    {
      id: 'blogs',
      label: 'Blog Management',
      icon: '📝',
      route: 'admin-blogs'
    },
    {
      id: 'new',
      label: 'Create New Blog',
      icon: '✨',
      route: 'admin-blog-new'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09101E] text-slate-800 dark:text-slate-200 flex flex-col md:flex-row transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white dark:bg-[#0B1424] border-r border-slate-200 dark:border-slate-800 p-6 justify-between shrink-0 fixed top-0 bottom-0 left-0 z-30">
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-[#0B192C] dark:bg-blue-600 text-white font-bold flex items-center justify-center font-mono-tech shadow-md">
              WS
            </div>
            <div>
              <h2 className="font-bold text-base text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                WebSoul Admin
              </h2>
              <span className="text-[11px] font-mono-tech text-blue-600 dark:text-blue-400">
                Dashboard Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-mono-tech text-xs">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.route)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-[#0B192C] dark:bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B192C] dark:hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Public Website Shortcuts */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase tracking-widest font-mono-tech text-slate-400 block mb-3 font-semibold">
              Public Shortcuts
            </span>
            <div className="space-y-1 font-mono-tech text-xs">
              <button
                onClick={() => onNavigate('blog')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span>🌐 Public Blog</span>
                <span className="text-[10px]">↗</span>
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span>🏠 Homepage</span>
                <span className="text-[10px]">↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Badge & Logout */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono-tech shrink-0">
                S
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#0B192C] dark:text-white truncate font-mono-tech">
                  {user?.name || 'Saad (Admin)'}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono-tech">
                  {user?.email || 'websoul.tech859@gmail.com'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 text-xs font-mono-tech font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white dark:bg-[#0B1424] border-b border-slate-200 dark:border-slate-800 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B192C] dark:bg-blue-600 text-white font-bold flex items-center justify-center font-mono-tech text-xs">
            WS
          </div>
          <span className="font-bold text-sm text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-2">
          {toggleDarkMode && (
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          )}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex">
          <div className="w-4/5 max-w-xs bg-white dark:bg-[#0B1424] h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-base text-[#0B192C] dark:text-white font-mono-tech">
                  WebSoul Admin
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>

              <nav className="space-y-1.5 font-mono-tech text-xs">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileSidebarOpen(false);
                      onNavigate(item.route);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-semibold cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-[#0B192C] dark:bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono-tech">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    onNavigate('blog');
                  }}
                  className="w-full text-left py-2 text-slate-600 dark:text-slate-400"
                >
                  🌐 View Public Blog
                </button>
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    onNavigate('home');
                  }}
                  className="w-full text-left py-2 text-slate-600 dark:text-slate-400"
                >
                  🏠 Return to Homepage
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-mono-tech text-xs font-bold"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 lg:ml-72 min-h-screen flex flex-col justify-between">
        {/* Top Header Bar for Desktop */}
        <div className="hidden md:flex items-center justify-between px-8 py-5 bg-white dark:bg-[#0B1424] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <div>
            {title && (
              <h1 className="text-xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {actionButton}

            {toggleDarkMode && (
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-mono-tech flex items-center gap-1.5"
                title="Toggle Theme"
              >
                <span>{darkMode ? '☀️ Light' : '🌙 Dark'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1424] text-xs text-slate-400 font-mono-tech flex items-center justify-between">
          <span>WebSoul Content Management System • v2.0</span>
          <span>Authenticated as Saad (websoul.tech859@gmail.com)</span>
        </footer>
      </main>
    </div>
  );
};
