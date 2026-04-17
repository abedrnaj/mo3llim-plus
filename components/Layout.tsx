
import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { THEME_COLORS, Logo } from '../constants';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const colors = THEME_COLORS[theme];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'الرئيسية', path: '/' },
    { name: 'مخطط الدروس', path: '/planner' },
    { name: 'المجتمع', path: '/community' },
    { name: 'دليل المعلم', path: '/guide' },
    { name: 'الملف الشخصي', path: '/profile' },
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${colors.bg} ${colors.text}`}>
      <header className={`sticky top-0 z-50 ${colors.card} shadow-sm border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 h-12">
            <Logo theme={theme} className="h-full" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg font-bold hover:opacity-70 transition-opacity ${
                  location.pathname === item.path ? (theme === 'day' ? 'text-blue-600 underline underline-offset-8' : 'text-orange-500 underline underline-offset-8') : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3 ml-4 border-r pr-4 border-slate-200 dark:border-gray-800">
                <img 
                  src={user.photoURL} 
                  className="w-10 h-10 rounded-xl" 
                  alt="User" 
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={logout}
                  className={`text-sm font-bold opacity-60 hover:opacity-100 transition-opacity ${colors.text}`}
                >
                  خروج
                </button>
              </div>
            )}
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${colors.border} hover:scale-110 transition-transform`}
              title="تبديل الوضع"
            >
              {theme === 'day' ? '🌙' : '☀️'}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-2xl"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className={`md:hidden absolute top-20 left-0 w-full ${colors.card} border-b ${colors.border} shadow-xl animate-slideDown z-40 overflow-y-auto max-h-[calc(100vh-5rem)]`}>
            <nav className="flex flex-col p-6 gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-2xl font-black ${
                    location.pathname === item.path ? (theme === 'day' ? 'text-blue-600' : 'text-orange-500') : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {user && (
                <div className="pt-6 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.photoURL} 
                      className="w-12 h-12 rounded-xl" 
                      alt="User" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{user.displayName}</span>
                      <span className="text-sm opacity-50">{user.email}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold"
                  >
                    خروج
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
        {children}
      </main>

      <footer className={`mt-20 py-10 border-t ${colors.border} ${colors.card} text-center`}>
        <div className="max-w-2xl mx-auto flex flex-col items-center space-y-4">
          <Logo theme={theme} className="h-12 opacity-30" />
          <p className="opacity-60 font-bold">معلم بلس - رفيقك نحو تعليم مخصص، ممتع، وذو أثر.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
