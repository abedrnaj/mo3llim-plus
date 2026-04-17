
import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { THEME_COLORS } from '../constants';

const CheckBox: React.FC = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div 
      onClick={() => setChecked(!checked)}
      className={`w-7 h-7 rounded-md border-2 cursor-pointer transition-all flex items-center justify-center no-print ${
        checked ? 'bg-green-500 border-green-500' : 'border-slate-300'
      }`}
    >
      {checked && <span className="text-white text-sm">✓</span>}
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; icon: string }> = ({ title, icon }) => {
  const { theme } = useTheme();
  return (
    <div className={`flex items-center gap-2 md:gap-3 border-b-2 pb-2 md:pb-3 mb-6 md:mb-8 mt-8 md:mt-12 ${theme === 'day' ? 'border-slate-100 text-slate-800' : 'border-gray-800 text-gray-100'}`}>
      <span className="text-3xl md:text-4xl">{icon}</span>
      <h4 className="text-2xl md:text-3xl font-black">{title}</h4>
    </div>
  );
};

const LessonPlanDisplay: React.FC<{ data: any }> = ({ data }) => {
  const { theme } = useTheme();
  const { savePlan, savedPlans } = useAuth();
  const colors = THEME_COLORS[theme];
  const [isSaved, setIsSaved] = useState(false);

  if (!data) return null;

  const handleSave = () => {
    savePlan(data);
    setIsSaved(true);
  };

  const isAlreadySaved = savedPlans.some(p => p.title === data.title) || isSaved;

  // Explicit color helpers to solve the contrast issue visible in user's image
  // We avoid 'dark:' prefix and use explicit theme conditions
  const cardBg = theme === 'day' ? 'bg-slate-50 border-slate-100 text-slate-900' : 'bg-[#1a1a1a] border-gray-700 text-white';
  const subCardBg = theme === 'day' ? 'bg-white border-blue-50' : 'bg-[#252525] border-gray-600';

  return (
    <div className="mt-6 md:mt-12 space-y-8 md:space-y-12 animate-fadeIn max-w-6xl mx-auto mb-10 md:mb-20 px-4">
      <style>
        {`
          @media print {
            body { background: white !important; color: black !important; }
            .no-print { display: none !important; }
            .print-break { page-break-before: always; }
            .report-card { border: 2px solid #eee !important; box-shadow: none !important; margin: 0 !important; width: 100% !important; border-radius: 0 !important; }
            .text-xl { font-size: 1.1rem !important; }
            .text-3xl { font-size: 1.8rem !important; }
          }
        `}
      </style>

      <div className={`${colors.card} report-card p-4 md:p-14 rounded-3xl md:rounded-[3rem] shadow-2xl border-t-[8px] md:border-t-[20px] ${theme === 'day' ? 'border-blue-600' : 'border-orange-600'} relative`}>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 gap-6 md:gap-8 text-center md:text-right">
          <div className="space-y-2 md:space-y-3">
            <p className={`text-xs md:text-xl font-bold uppercase tracking-widest ${theme === 'day' ? 'text-blue-600' : 'text-orange-500'}`}>تقرير تحضير ذكي - معلم بلس</p>
            <h3 className="text-2xl md:text-6xl font-black leading-tight">{data.title}</h3>
          </div>
          <div className={`p-4 md:p-8 rounded-2xl md:rounded-[2rem] ${theme === 'day' ? 'bg-gray-50 border border-slate-100' : 'bg-gray-800/80 border border-gray-700'} flex flex-col items-center min-w-[120px] md:min-w-[180px]`}>
            <span className={`text-2xl md:text-5xl font-black ${theme === 'day' ? 'text-blue-600' : 'text-orange-500'}`}>معلم+</span>
            <p className="text-[10px] md:text-sm opacity-50 mt-1 md:mt-2 font-bold leading-none">وثيقة تربوية رقمية</p>
          </div>
        </div>

        {/* Ice Breaker */}
        <div className={`p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] border-2 shadow-sm ${theme === 'day' ? 'bg-amber-50 border-amber-100 text-slate-900' : 'bg-amber-900/20 border-amber-800/50 text-amber-50'}`}>
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h4 className="text-xl md:text-3xl font-black text-amber-700">❄️ نشاط كسر الجليد</h4>
            <CheckBox />
          </div>
          <p className="text-lg md:text-2xl font-black mb-2 md:mb-3">{data.iceBreaker.activity}</p>
          <p className="text-base md:text-xl opacity-90 leading-relaxed">{data.iceBreaker.instructions}</p>
        </div>

        <SectionHeader title="تسلسل الحصة الزمني" icon="⏱️" />
        <div className="space-y-4 md:space-y-6">
          {data.lessonFlow.map((flow: any, i: number) => (
            <div key={i} className={`flex gap-4 md:gap-8 p-6 md:p-8 rounded-2xl md:rounded-3xl transition-all border ${cardBg}`}>
              <CheckBox />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 md:mb-3 gap-2">
                  <span className="text-xl md:text-2xl font-black">{flow.step}</span>
                  {flow.duration && <span className={`${theme === 'day' ? 'bg-blue-100 text-blue-700' : 'bg-orange-900/40 text-orange-300'} px-4 md:px-5 py-1 md:py-2 rounded-full text-xs md:text-sm font-black`}>{flow.duration}</span>}
                </div>
                <p className="text-lg md:text-xl opacity-80 leading-relaxed">{flow.description}</p>
              </div>
            </div>
          ))}
        </div>

        <SectionHeader title="الأنشطة التطبيقية المقترحة" icon="🛠️" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {data.activityOptions.map((act: any, i: number) => (
            <div key={i} className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 relative transition-transform hover:scale-[1.02] ${subCardBg}`}>
              <div className="absolute top-4 right-4 md:top-6 md:right-6"><CheckBox /></div>
              <h5 className={`text-2xl md:text-3xl font-black mb-4 md:mb-6 pl-10 ${theme === 'day' ? 'text-blue-600' : 'text-orange-400'}`}>{act.name}</h5>
              <div className="space-y-4 md:space-y-6 text-lg md:text-xl">
                <p><span className="font-black text-blue-500/80">🎯 الهدف:</span> {act.goal}</p>
                <div>
                  <p className="font-black mb-2 md:mb-3 text-teal-600">📦 الأدوات المطلوبة:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 opacity-90 text-base md:text-lg">
                    {act.tools.map((t: string, idx: number) => <li key={idx} className="flex items-center gap-2"><span>•</span> {t}</li>)}
                  </ul>
                </div>
                {act.alternatives && (
                  <div className={`p-4 md:p-5 rounded-xl md:rounded-2xl text-sm md:text-base ${theme === 'day' ? 'bg-orange-50 text-orange-900' : 'bg-orange-900/30 text-orange-100'}`}>
                    <p className="font-black mb-1">💡 فكرة للبدائل:</p>
                    <p className="opacity-80">{act.alternatives.join('، ')}</p>
                  </div>
                )}
                <div className={`pt-4 md:pt-6 border-t italic ${theme === 'day' ? 'border-slate-100 text-slate-700' : 'border-gray-700 text-gray-300'}`}>
                  <p className="font-black not-italic mb-2 text-blue-500">💬 حوار مقترح مع الطلاب:</p>
                  <p className="text-base md:text-lg leading-relaxed">"{act.teacherScript}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SectionHeader title="الدعم البصري والتمثيل" icon="🖼️" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          <div className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border ${cardBg}`}>
            <h6 className="font-black text-xl md:text-2xl mb-4 md:mb-6">🎨 لوحة الألوان</h6>
            <div className="flex flex-wrap gap-3 md:gap-5 justify-center">
              {data.visualSupport.colorPalette.map((color: string, i: number) => (
                <div key={i} className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl shadow-2xl border-4 border-white/20" style={{ backgroundColor: color }}></div>
                  <span className="text-xs font-bold opacity-60 uppercase">{color}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`lg:col-span-2 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border ${cardBg}`}>
            <h6 className="font-black text-xl md:text-2xl mb-4 md:mb-6">📐 الرسوم التوضيحية</h6>
            <ul className="space-y-3 md:space-y-4 text-lg md:text-xl opacity-90">
              {data.visualSupport.diagramIdeas.map((idea: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold">←</span> {idea}
                </li>
              ))}
            </ul>
            <div className={`mt-6 md:mt-8 pt-6 md:pt-8 border-t font-black text-lg md:text-xl ${theme === 'day' ? 'border-slate-200' : 'border-gray-700'}`}>
              <span className="opacity-50">طريقة التمثيل:</span> <span className="text-blue-500">{data.visualSupport.representationMethod}</span>
            </div>
          </div>
        </div>

        <SectionHeader title="دليل الفهم العميق" icon="🎓" />
        <div className={`p-6 md:p-14 rounded-[2rem] md:rounded-[4rem] border-2 shadow-inner ${theme === 'day' ? 'bg-indigo-50/30 border-indigo-100 text-slate-900' : 'bg-indigo-950/20 border-indigo-900/50 text-indigo-50'}`}>
          <div className="max-w-none">
            <h5 className={`text-2xl md:text-3xl font-black mb-6 md:mb-8 underline underline-offset-[8px] md:underline-offset-[12px] decoration-4 ${theme === 'day' ? 'text-indigo-700' : 'text-indigo-400'}`}>المادة العلمية والتربوية:</h5>
            <p className="leading-[1.8] md:leading-[2.2] opacity-90 mb-10 md:mb-16 text-xl md:text-2xl whitespace-pre-wrap font-medium">{data.deepKnowledge.extendedExplanation}</p>
            
            <h5 className={`text-2xl md:text-3xl font-black mb-6 md:mb-10 ${theme === 'day' ? 'text-indigo-700' : 'text-indigo-400'}`}>الأسئلة الذكية (تحدي التفكير):</h5>
            <div className="space-y-6 md:space-y-8">
              {data.deepKnowledge.qa.map((item: any, idx: number) => (
                <div key={idx} className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all hover:bg-white/5 ${theme === 'day' ? 'bg-white border-indigo-50' : 'bg-black/30 border-indigo-800/30'}`}>
                  <p className="text-xl md:text-2xl font-black mb-3 md:mb-4 flex items-center gap-3">
                    <span className="bg-indigo-500 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg shrink-0">س</span>
                    {item.q}
                  </p>
                  <p className={`text-lg md:text-xl italic leading-relaxed pr-10 md:pr-12 ${theme === 'day' ? 'text-indigo-800' : 'text-indigo-300'}`}>
                    <span className="font-black not-italic ml-2">الإجابة:</span> {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SectionHeader title="تقييم الحصة والتعلم" icon="📝" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {data.evaluationQuestions.map((q: string, i: number) => (
            <div key={i} className={`flex gap-4 md:gap-6 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] items-center border shadow-sm transition-all hover:translate-x-2 ${cardBg}`}>
              <CheckBox />
              <p className="text-xl md:text-2xl font-black leading-snug">{q}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-20 flex flex-col sm:flex-row justify-center gap-4 md:gap-8 no-print">
          <button 
            onClick={() => window.print()}
            className="w-full sm:w-auto bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-10 md:px-16 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] hover:scale-105 transition-all font-black text-xl md:text-2xl shadow-2xl"
          >
            طباعة التقرير الكامل 🖨️
          </button>
          <button 
            onClick={handleSave}
            disabled={isAlreadySaved}
            className={`w-full sm:w-auto ${isAlreadySaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-10 md:px-16 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] transition-all font-black text-xl md:text-2xl shadow-xl hover:scale-105`}
          >
            {isAlreadySaved ? 'تم الحفظ ✓' : 'حفظ في الأرشيف 💾'}
          </button>
        </div>

        <div className="mt-10 md:mt-16 text-center opacity-30 no-print font-bold text-base md:text-lg">
          <p>جميع الحقوق محفوظة لمنصة معلم بلس © 2025 - رفيق المعلم المبدع</p>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanDisplay;
