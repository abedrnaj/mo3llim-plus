import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { THEME_COLORS, Logo } from '../constants';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { login, loginWithEmail, error } = useAuth();
  const colors = THEME_COLORS[theme];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithEmail(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-white dark:from-black dark:to-gray-900">
      <div className={`${colors.card} w-full max-w-lg p-12 rounded-[3rem] shadow-2xl border ${colors.border} space-y-8 text-center relative overflow-hidden`}>
        <div className="space-y-6">
          <Logo theme={theme} className="mx-auto scale-110" />
          <p className={`${colors.muted} text-xl leading-relaxed font-bold`}>
            مرحباً بك مجدداً في مساحتك الخاصة للإبداع والتطوير. سجل دخولك لتبدأ رحلتك اليوم.
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-2xl text-sm font-bold border border-red-200 dark:border-red-800/50">
              {error}
            </div>
          )}

          {!showEmailForm ? (
            <>
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

              <button
                onClick={() => setShowEmailForm(true)}
                className={`w-full py-4 rounded-[1.5rem] border-2 font-bold ${colors.text} ${colors.border} hover:bg-gray-50 dark:hover:bg-gray-800 transition-all`}
              >
                تسجيل الدخول بالبريد الإلكتروني
              </button>
            </>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4 text-right" dir="rtl">
              <div className="space-y-2">
                <label className={`block text-sm font-bold ${colors.text}`}>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-4 rounded-2xl border ${colors.border} ${colors.card} ${colors.text}`}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className={`block text-sm font-bold ${colors.text}`}>كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-4 rounded-2xl border ${colors.border} ${colors.card} ${colors.text}`}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full py-4 rounded-[1.5rem] text-white font-black text-xl transition-all border-b-4 ${
                  theme === 'day' 
                    ? 'bg-blue-600 border-blue-800 hover:bg-blue-700 active:border-b-0' 
                    : 'bg-orange-600 border-orange-800 hover:bg-orange-700 active:border-b-0'
                }`}
              >
                دخول
              </button>
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className={`w-full text-center text-sm ${colors.muted} hover:underline`}
              >
                العودة لخيارات تسجيل الدخول
              </button>
            </form>
          )}
          
          <p className={`text-sm ${colors.muted}`}>
             بمنقرك على تسجيل الدخول، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-[10px] opacity-50 underline"
          >
            تحديث إجباري للنظام (Force Refresh)
          </button>
        </div>

        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default LoginPage;
