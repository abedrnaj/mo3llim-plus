import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { THEME_COLORS } from '../constants';

const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    specialization: user?.specialization || '',
    bio: user?.bio || '',
    photoURL: user?.photoURL || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto py-6 animate-fadeIn px-4">
      <div className={`${colors.card} rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border ${colors.border} relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12`}>
        <div className="w-full md:w-2/3 text-center md:text-right space-y-4 md:space-y-6 order-2 md:order-1">
           {isEditing ? (
             <form onSubmit={handleUpdate} className="space-y-4">
               <input
                 className={`w-full p-3 rounded-xl border ${colors.border} ${colors.input} ${colors.text} text-xl md:text-3xl font-black text-center md:text-right`}
                 value={formData.displayName}
                 onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                 placeholder="الاسم"
               />
               <input
                 className={`w-full p-3 rounded-xl border ${colors.border} ${colors.input} text-orange-500 font-bold text-lg md:text-xl text-center md:text-right bg-transparent`}
                 value={formData.specialization}
                 onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                 placeholder="التخصص (مثال: تكنولوجيا المعلومات)"
               />
               <textarea
                 className={`w-full p-3 rounded-xl border ${colors.border} ${colors.input} ${colors.text} leading-relaxed text-right resize-none`}
                 rows={3}
                 value={formData.bio}
                 onChange={(e) => setFormData({...formData, bio: e.target.value})}
                 placeholder="نبذة عنك"
               />
               <input
                 className={`w-full p-2 text-xs rounded-lg border ${colors.border} ${colors.input} ${colors.text}`}
                 value={formData.photoURL}
                 onChange={(e) => setFormData({...formData, photoURL: e.target.value})}
                 placeholder="رابط الصورة الشخصية"
               />
               <div className="flex gap-4 justify-center md:justify-end mt-6">
                 <button 
                   type="submit" 
                   disabled={isSaving}
                   className="bg-green-600 text-white px-6 md:px-8 py-2 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 text-sm md:text-base"
                 >
                   {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                 </button>
                 <button 
                   type="button"
                   onClick={() => setIsEditing(false)}
                   className="bg-gray-500 text-white px-6 md:px-8 py-2 rounded-xl font-bold hover:scale-105 transition-all text-sm md:text-base"
                 >
                   إلغاء
                 </button>
               </div>
             </form>
           ) : (
             <>
               <h2 className={`text-3xl md:text-5xl font-black ${colors.text}`}>{user.displayName}</h2>
               <p className="text-orange-500 font-bold text-lg md:text-2xl">{user.specialization || 'معلم مبدع'}</p>
               <p className={`${colors.muted} text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0`}>
                 {user.bio || 'لم تقم بإضافة نبذة شخصية بعد. شارك زملائك رؤيتك التعليمية وشغفك بالتدريس.'}
               </p>
               <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4 md:gap-6 pt-4">
                  <div className={`${theme === 'day' ? 'bg-slate-50' : 'bg-gray-800'} p-5 rounded-2xl md:rounded-3xl flex-1 md:flex-none md:w-40 shadow-inner`}>
                     <p className="text-3xl md:text-4xl font-black text-orange-500">92%</p>
                     <p className={`text-xs md:text-sm ${colors.muted}`}>مؤشر الأثر التربوي</p>
                  </div>
                  <div className={`${theme === 'day' ? 'bg-slate-50' : 'bg-gray-800'} p-5 rounded-2xl md:rounded-3xl flex-1 md:flex-none md:w-40 shadow-inner`}>
                     <p className={`text-3xl md:text-4xl font-black ${colors.text}`}>0</p>
                     <p className={`text-xs md:text-sm ${colors.muted}`}>الخطط المميزة</p>
                  </div>
               </div>
               <button 
                 onClick={() => setIsEditing(true)}
                 className={`mt-6 md:mt-8 px-6 md:px-10 py-3 rounded-2xl border-2 ${colors.border} ${colors.text} font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm md:text-base`}
               >
                 تعديل المحتوى الإبداعي
               </button>
             </>
           )}
        </div>
        
        <div className="relative order-1 md:order-2">
           <div className={`w-48 h-48 md:w-64 md:h-64 rounded-2xl md:rounded-[3rem] overflow-hidden border-4 md:border-8 ${theme === 'day' ? 'border-white' : 'border-gray-800'} shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 bg-gray-200`}>
              <img 
                src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} 
                className="w-full h-full object-cover" 
                alt={user.displayName} 
                referrerPolicy="no-referrer"
              />
           </div>
           <span className="absolute -bottom-4 -right-4 bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl border-4 border-white dark:border-gray-900">خبير معتمد</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
         <div className={`${colors.card} p-10 rounded-[2.5rem] shadow-xl border ${colors.border} lg:col-span-2`}>
            <h3 className={`text-2xl font-black mb-8 flex items-center justify-between ${colors.text}`}>
              لوحة التقدم المهني
              <span className={`text-xs font-bold uppercase tracking-widest ${colors.muted}`}>مسار التميز</span>
            </h3>
            <div className="space-y-10">
               <div>
                  <div className={`flex justify-between text-lg mb-3 ${colors.text}`}>
                     <span className="font-bold">التمكن من تقنيات STEAM</span>
                     <span className="font-black text-blue-500">80%</span>
                  </div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner">
                     <div className="h-full bg-gradient-to-l from-blue-600 to-blue-400 rounded-full transition-all duration-1000" style={{width: '80%'}}></div>
                  </div>
               </div>
               <div>
                  <div className={`flex justify-between text-lg mb-3 ${colors.text}`}>
                     <span className="font-bold">دمج التعليم الجامع</span>
                     <span className="font-black text-teal-500">65%</span>
                  </div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner">
                     <div className="h-full bg-gradient-to-l from-teal-600 to-teal-400 rounded-full transition-all duration-1000" style={{width: '65%'}}></div>
                  </div>
               </div>
            </div>
         </div>

         <div className={`${colors.card} p-10 rounded-[2.5rem] shadow-xl border ${colors.border} flex flex-col items-center justify-center text-center`}>
            <h3 className={`text-2xl font-black mb-6 w-full text-right ${colors.text}`}>التوزيمات المستلمة</h3>
            <div className="py-8 space-y-4">
               <div className="text-7xl grayscale opacity-20 filter hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help">🏆</div>
               <p className={`${colors.text} font-bold text-lg opacity-40 italic`}>لم يتم استلام أي أوسمة بعد</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
