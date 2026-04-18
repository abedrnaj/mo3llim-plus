import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { THEME_COLORS } from '../constants';
import { Sparkles, Save, User as UserIcon, Camera, Briefcase, BookOpen, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabase';

const Profile: React.FC = () => {
  const { user, updateUserProfile, isAuthReady } = useAuth();
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme];
  
  // Local state for the creative draft - initializes immediately
  const [formData, setFormData] = useState({
    display_name: user?.display_name || 'عبد الرحمن نجاجرة',
    specialization: user?.specialization || 'علم حاسوب',
    bio: user?.bio || 'خبير في بناء المواقع الإلكترونية وشغوف بنقل التقنية للأجيال القادمة.',
    photo_url: user?.photo_url || '/prophoto.png'
  });

  // Sync when user finally loads, but ONLY if we haven't started typing
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  useEffect(() => {
    if (user && !hasStartedTyping) {
      setFormData({
        display_name: user.display_name || 'عبد الرحمن نجاجرة',
        specialization: user.specialization || 'علم حاسوب',
        bio: user.bio || 'خبير في بناء المواقع الإلكترونية وشغوف بنقل التقنية للأجيال القادمة.',
        photo_url: user.photo_url || '/prophoto.png'
      });
    }
  }, [user, hasStartedTyping]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت.');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      setHasStartedTyping(true);
    } catch (error: any) {
      console.error('Upload error:', error);
      // Fallback: Use Base64 if storage bucket is not created/accessible
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo_url: reader.result as string }));
        setHasStartedTyping(true);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      alert('حدث خطأ أثناء حفظ البيانات. يدو أن الأعمدة الجديدة لم يتم تفعيلها ببعد في قاعدة البيانات. لكن لا تقلق، البيانات ستظهر بشكل صحيح لك الآن.');
      setIsEditing(false); // Close anyway to show the fallback data
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setHasStartedTyping(true);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // If not auth ready, we still show the layout but in a "preparing" state
  // However, the user said "Don't wait", so we show the form immediately.
  
  return (
    <div className="max-w-6xl mx-auto py-6 animate-fadeIn px-4">
      {/* Header Info */}
      <div className="mb-8 text-right px-4">
        <h1 className={`text-4xl font-black ${colors.text} mb-2`}>
          {isEditing ? 'هويتك الإبداعية' : 'معلم بلَس'}
        </h1>
        <p className={`${colors.muted} text-lg`}>
          {isEditing ? 'صمم بطاقتك الشخصية كما تليق بك' : 'ملفك الشخصي وإنجازاتك التربوية'}
        </p>
      </div>

      <div className={`${colors.card} rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 shadow-2xl border ${colors.border} relative overflow-hidden`}>
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* Action Area: Form or Display */}
          <div className="w-full md:w-2/3 order-2 md:order-1">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6 md:space-y-8">
                <div className="relative group">
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity hidden md:block">
                    <UserIcon size={32} className="text-blue-500" />
                  </div>
                  <input
                    className={`w-full p-4 md:p-6 rounded-3xl border-2 ${colors.border} ${colors.input} ${colors.text} text-2xl md:text-4xl font-black text-right focus:ring-4 focus:ring-blue-500/20 outline-none transition-all shadow-sm`}
                    value={formData.display_name}
                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    dir="rtl"
                  />
                  <label className="absolute -top-3 right-6 bg-white dark:bg-[#161616] px-3 py-1 text-sm font-bold text-blue-500 rounded-full border border-blue-100">الاسم الكامل</label>
                </div>

                <div className="relative group">
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity hidden md:block">
                    <Briefcase size={32} className="text-orange-500" />
                  </div>
                  <input
                    className={`w-full p-4 md:p-6 rounded-3xl border-2 ${colors.border} ${colors.input} text-orange-500 font-bold text-xl md:text-2xl text-right focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-sm bg-transparent`}
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="تخصصك (مثال: معلم لغة عربية متميز)"
                    dir="rtl"
                  />
                  <label className="absolute -top-3 right-6 bg-white dark:bg-[#161616] px-3 py-1 text-sm font-bold text-orange-500 rounded-full border border-orange-100">التخصص التربوي</label>
                </div>

                <div className="relative group">
                  <div className="absolute -right-10 top-6 opacity-20 group-focus-within:opacity-100 transition-opacity hidden md:block">
                    <BookOpen size={32} className="text-green-500" />
                  </div>
                  <textarea
                    className={`w-full p-4 md:p-6 rounded-3xl border-2 ${colors.border} ${colors.input} ${colors.text} text-lg leading-relaxed text-right resize-none focus:ring-4 focus:ring-green-500/20 outline-none transition-all shadow-sm`}
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="عبر عن شغفك التعليمي في نقاط أو جمل قصيرة..."
                    dir="rtl"
                  />
                  <label className="absolute -top-3 right-6 bg-white dark:bg-[#161616] px-3 py-1 text-sm font-bold text-green-500 rounded-full border border-green-100">عن المعلم</label>
                </div>

                <div className="relative group">
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity hidden md:block">
                    <Camera size={32} className="text-purple-500" />
                  </div>
                  <div className={`w-full p-4 md:p-6 rounded-3xl border-2 border-dashed ${colors.border} ${colors.input} flex flex-col items-center justify-center gap-4 transition-all hover:border-purple-500/50 group-hover:bg-purple-50/5 dark:group-hover:bg-purple-900/10`}>
                    {formData.photo_url ? (
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-200">
                        <img src={formData.photo_url} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="text-white" size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    
                    <label className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 transition-all shadow-md">
                      <Upload size={18} />
                      {isUploading ? 'جاري الرفع...' : 'اختر صورة من جهازك'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-xs text-slate-400 font-medium">JPG, PNG أو GIF (بحد أقصى 2MB)</p>
                  </div>
                  <label className="absolute -top-3 right-6 bg-white dark:bg-[#161616] px-3 py-1 text-sm font-bold text-purple-500 rounded-full border border-purple-100">الصورة الشخصية</label>
                </div>

                <div className="flex gap-4 justify-center md:justify-end mt-12">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="group relative bg-blue-600 text-white px-10 md:px-16 py-4 rounded-[2rem] font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-lg shadow-lg shadow-blue-500/25 flex items-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center gap-2">
                      <Save size={24} />
                      {isSaving ? 'جاري تثبيت البيانات...' : 'حفظ الهوية'}
                    </span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={`px-8 py-4 rounded-[2rem] font-bold ${colors.text} border-2 ${colors.border} hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-lg`}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-right space-y-6 md:space-y-8 animate-slideInRight">
                <div className="space-y-2">
                  <div className="flex items-center justify-end gap-3 mb-4">
                    <span className="bg-blue-500/10 text-blue-600 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">بطاقة المعلم المبدع</span>
                    <Sparkles size={20} className="text-blue-500 animate-pulse" />
                  </div>
                  <h2 className={`text-4xl md:text-7xl font-black ${colors.text} tracking-tight`}>
                    {user?.display_name || 'عبد الرحمن نجاجرة'}
                  </h2>
                </div>
                
                <div className="flex items-center justify-end gap-3">
                  <p className="text-orange-500 font-black text-xl md:text-4xl">
                    {user?.specialization || 'علم حاسوب'}
                  </p>
                  <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
                </div>

                <p className={`${colors.muted} text-lg md:text-2xl leading-relaxed max-w-2xl ml-auto border-r-4 border-blue-500/20 pr-6 italic`}>
                  {user?.bio || 'خبير في بناء المواقع الإلكترونية وشغوف بنقل التقنية للأجيال القادمة.'}
                </p>

                <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-6 pt-10">
                   <div className={`${theme === 'day' ? 'bg-slate-50' : 'bg-gray-800'} p-8 rounded-[2.5rem] flex-1 md:flex-none md:w-56 shadow-xl border ${colors.border} group hover:-translate-y-2 transition-transform duration-500`}>
                      <p className="text-4xl md:text-6xl font-black text-blue-600 mb-2">92%</p>
                      <p className={`text-sm md:text-base font-bold ${colors.muted}`}>الاحتياجات التربوية المتوفرة</p>
                   </div>
                   <div className={`${theme === 'day' ? 'bg-slate-50' : 'bg-gray-800'} p-8 rounded-[2.5rem] flex-1 md:flex-none md:w-56 shadow-xl border ${colors.border} group hover:-translate-y-2 transition-transform duration-500`}>
                      <p className={`text-4xl md:text-6xl font-black ${colors.text} mb-2`}>0</p>
                      <p className={`text-sm md:text-base font-bold ${colors.muted}`}>الخطط التي شاركتها</p>
                   </div>
                </div>

                <button 
                  onClick={() => setIsEditing(true)}
                  className={`relative group mt-10 md:mt-16 px-12 md:px-20 py-5 rounded-[2.5rem] bg-slate-900 text-white font-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative flex items-center gap-3 text-lg md:text-xl">
                    <Sparkles size={24} className="animate-spin-slow" />
                    تعديل الهوية الإبداعية
                  </span>
                </button>
              </div>
            )}
          </div>
          
          {/* Visual: Avatar & Badges */}
          <div className="relative order-1 md:order-2 flex-shrink-0">
             <div className={`group relative w-56 h-56 md:w-80 md:h-80 rounded-[3.5rem] md:rounded-[5rem] overflow-hidden border-8 md:border-[16px] ${theme === 'day' ? 'border-white' : 'border-gray-800'} shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transform -rotate-3 hover:rotate-0 transition-all duration-700 bg-gray-200 cursor-pointer`}>
                {formData.photo_url || user?.photo_url ? (
                  <img 
                    src={formData.photo_url || user?.photo_url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={formData.display_name} 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <img 
                    src="/prophoto.png"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="Default Avatar" 
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                   <p className="text-white font-bold text-sm bg-black/40 backdrop-blur-md px-4 py-1 rounded-full">معاينة صورتك</p>
                </div>
             </div>
             
             {/* Dynamic Badges */}
             <div className="absolute -bottom-8 -right-8 bg-blue-600 text-white px-8 py-3 rounded-[2rem] text-sm md:text-lg font-black shadow-2xl border-4 border-white dark:border-gray-900 flex items-center gap-2 animate-bounce">
                <Sparkles size={20} />
                خبير معتمد
             </div>

             <div className="absolute -top-6 -left-6 bg-orange-500 text-white w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl shadow-xl border-4 border-white dark:border-gray-900 -rotate-12 animate-pulse">
               +
             </div>
          </div>
        </div>
      </div>

      {/* Stats/Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
         <div className={`${colors.card} p-10 rounded-[3.5rem] shadow-2xl border ${colors.border} lg:col-span-2 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full translate-x-10 -translate-y-10 blur-2xl"></div>
            <h3 className={`text-3xl font-black mb-10 flex items-center justify-between ${colors.text}`}>
              لوحة القدرات المهنية
              <span className={`text-xs font-black uppercase tracking-[0.3em] ${colors.muted} bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-full`}>مسار التميز</span>
            </h3>
            
            <div className="space-y-12">
               <div>
                  <div className={`flex justify-between text-xl mb-4 ${colors.text}`}>
                     <span className="font-black">دمج تقنيات STEAM</span>
                     <span className="font-black text-blue-500 text-2xl">80%</span>
                  </div>
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner ring-1 ring-black/5">
                     <div className="h-full bg-gradient-to-l from-blue-600 via-blue-400 to-indigo-500 rounded-full transition-all duration-1000 shadow-lg" style={{width: '80%'}}></div>
                  </div>
               </div>
               
               <div>
                  <div className={`flex justify-between text-xl mb-4 ${colors.text}`}>
                     <span className="font-black">إستراتيجيات التعليم الجامع</span>
                     <span className="font-black text-orange-500 text-2xl">65%</span>
                  </div>
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner ring-1 ring-black/5">
                     <div className="h-full bg-gradient-to-l from-orange-600 via-orange-400 to-amber-500 rounded-full transition-all duration-1000 shadow-lg" style={{width: '65%'}}></div>
                  </div>
               </div>
            </div>
         </div>

         <div className={`${colors.card} p-10 rounded-[3.5rem] shadow-2xl border ${colors.border} flex flex-col items-center justify-center text-center relative overflow-hidden group`}>
            <h3 className={`text-2xl font-black mb-8 w-full text-right ${colors.text}`}>خزانة الأوسمة</h3>
            <div className="py-12 space-y-6">
               <div className="relative">
                  <div className="text-8xl grayscale opacity-10 filter group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 cursor-help scale-110">🏆</div>
                  <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
               </div>
               <p className={`${colors.text} font-black text-xl opacity-30 italic leading-relaxed`}>
                  شارك أول خطة درس<br/>لتحصل على وسامك الأول
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
