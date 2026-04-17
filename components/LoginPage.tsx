import React from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { THEME_COLORS, Logo } from '../constants';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { login, error } = useAuth();
  const colors = THEME_COLORS[theme];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-white dark:from-black dark:to-gray-900">
      <div className={`${colors.card} w-full max-w-lg p-12 rounded-[3rem] shadow-2xl border ${colors.border} space-y-10 text-center relative overflow-hidden`}>
        <div className="space-y-4">
          <Logo theme={theme} className="mx-auto mb-6 scale-125" />
          <h1 className={`text-4xl font-black ${colors.text}`}>بوابة المعلم</h1>
          <p className={`${colors.muted} text-lg leading-relaxed`}>
            مرحباً بك مجدداً في مساحتك الخاصة للإبداع والتطوير. سجل دخولك لتبدأ رحلتك اليوم.
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-2xl text-sm font-bold border border-red-200 dark:border-red-800/50">
              {error}
            </div>
          )}
          <button
            onClick={login}
            className={`w-full py-5 rounded-[1.5rem] text-white font-black text-xl transition-all border-b-4 ${
              theme === 'day' 
                ? 'bg-blue-600 border-blue-800 hover:bg-blue-700 active:border-b-0' 
                : 'bg-orange-600 border-orange-800 hover:bg-orange-700 active:border-b-0'
            } shadow-2xl flex items-center justify-center gap-4`}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              className="w-6 h-6 bg-white rounded-full p-1" 
              alt="Google" 
              referrerPolicy="no-referrer"
            />
            تسجيل الدخول عبر غوغل
          </button>
          
          <p className={`text-sm ${colors.muted}`}>
             بمنقرك على تسجيل الدخول، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.
          </p>
        </div>

        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default LoginPage;
