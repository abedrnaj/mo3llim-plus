import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { THEME_COLORS } from '../constants';
import { TeachingMethod, LearningStyle, StudentGroup } from '../types';
import { generateLessonPlan } from '../services/geminiService';

const LessonPlannerForm: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    grade: 'المرحلة الابتدائية',
    subject: 'العلوم',
    method: TeachingMethod.STEAM,
    studentGroup: StudentGroup.GENERAL,
    style: LearningStyle.VISUAL,
    needsComplexity: 20
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateLessonPlan(formData);
      onResult(result);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ في توليد الخطة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full p-3 rounded-lg border ${colors.border} ${colors.input} ${colors.text} focus:ring-2 focus:ring-blue-500 outline-none transition-colors`;
  const labelClass = `block text-sm font-semibold mb-2 ${colors.text} opacity-80`;

  return (
    <div className={`${colors.card} p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-lg border ${colors.border} max-w-4xl mx-auto`}>
      <div className="text-center mb-6 md:mb-8">
        <h2 className={`text-xl md:text-2xl font-black mb-2 ${colors.text}`}>تخصيص الخطة الذكية</h2>
        <p className={`${colors.muted} text-xs md:text-sm`}>املأ المعايير التالية ليقوم "معلم بلس" بصياغة تجربة تعليمية فريدة</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div>
          <label className={labelClass}>ما هو عنوان الدرس الرئيسي؟</label>
          <input
            type="text"
            required
            className={inputClass}
            placeholder="مثال: الفصول الأربعة والفرق بينها"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className={labelClass}>المادة الدراسية</label>
            <input
               type="text"
               className={inputClass}
               value={formData.subject}
               onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>
          <div>
            <label className={labelClass}>المستوى</label>
            <select
              className={inputClass}
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            >
              <option>المرحلة الابتدائية</option>
              <option>المرحلة الإعدادية</option>
              <option>المرحلة الثانوية</option>
            </select>
          </div>
        </div>

        <div className={`${theme === 'day' ? 'bg-blue-50/50' : 'bg-gray-800/30'} p-4 md:p-6 rounded-xl space-y-6 text-right`}>
           <h3 className={`${theme === 'day' ? 'text-blue-600' : 'text-orange-500'} font-bold text-center border-b pb-2 mb-4 border-current opacity-60 text-sm md:text-base`}>الإعدادات التربوية المتقدمة</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] md:text-xs font-bold mb-1 opacity-60 uppercase">المنهجية</label>
                <select
                  className={inputClass}
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value as TeachingMethod })}
                >
                  {Object.values(TeachingMethod).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-bold mb-1 opacity-60 uppercase">فئة الطلاب</label>
                <select
                  className={inputClass}
                  value={formData.studentGroup}
                  onChange={(e) => setFormData({ ...formData, studentGroup: e.target.value as StudentGroup })}
                >
                  {Object.values(StudentGroup).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-bold mb-1 opacity-60 uppercase">النمط التعليمي</label>
                <select
                  className={inputClass}
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value as LearningStyle })}
                >
                  {Object.values(LearningStyle).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
           </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 md:py-5 px-8 rounded-xl md:rounded-2xl text-white font-black text-lg md:text-xl transition-all transform hover:scale-[1.01] shadow-xl ${
            theme === 'day' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/20'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'جاري بناء خطتك الذكية...' : 'صناعة التجربة التعليمية'}
        </button>
      </form>
    </div>
  );
};

export default LessonPlannerForm;
