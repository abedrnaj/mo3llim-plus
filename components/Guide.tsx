import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { THEME_COLORS } from '../constants';

const Guide: React.FC = () => {
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme];
  const [activeTab, setActiveTab] = useState('steam');

  const sections = [
    {
      id: 'steam',
      icon: '🚀',
      title: 'تقنيات STEAM',
      content: `نهج تعليمي يركز على تكامل العلوم والتكنولوجيا والهندسة والفن والرياضيات. يهدف إلى تنمية التفكير النقدي لدى الطلاب من خلال استكشاف مواقف واقعية. في معلم بلس، نساعدك في بناء خطط تركز على استقلالية الطلاب وإتاحة المجال لهم للإبداع والابتكار.`,
      tips: [
         'ابدأ بسؤال يثير الفضول.',
         'اربط المادة العلمية بتطبيق هندسي بسيط.',
         'أعطِ مساحة للطلاب للتعديل والإضافة الفنية.'
      ]
    },
    {
      id: 'montessori',
      icon: '🧩',
      title: 'نهج مونتيسوري',
      content: `فلسفة تربوية تعتمد على مبدأ "ساعدني لأفعل ذلك بنفسي". تركز على البيئة المعدة والعمل اليدوي والاحترام العميق لتطور الطفل الطبيعي. خطط معلم بلس في هذا القسم توفر أنشطة حسية وعملية تعزز استقلالية المتعلم.`,
      tips: [
         'نظم الأنشطة من البسيط إلى المعقد.',
         'اترك للطفل حرية اختيار النشاط المناسب له.',
         'ركز على العملية التعليمية وليس النتيجة النهائية فقط.'
      ]
    },
    {
      id: 'pbl',
      icon: '🏗️',
      title: 'التعلم بالمشاريع (PBL)',
      content: `طريقة تدريس يقوم فيها الطلاب باستكشاف مشكلات العالم الحقيقي وتحدياته. يكتسب الطلاب معرفة عميقة من خلال العمل لفترة ممتدة من الزمن للتحقيق والاستجابة لسؤال أو مشكلة معقدة.`,
      tips: [
         'حدد مخرجات نهائية واضحة وملموسة للمشروع.',
         'قسم المشروع إلى مراحل زمنية محددة.',
         'شجع العمل الجماعي وتوزيع الأدوار.'
      ]
    },
    {
        id: 'inclusive',
        icon: '🌍',
        title: 'التعليم الجامع',
        content: `استراتيجيات تعليمية تضمن مشاركة جميع الطلاب، بمن فيهم ذوو الاحتياجات الخاصة، في العملية التعليمية. تركز هذه الاستراتيجيات على تكييف المناهج والوسائل لتناسب قدرات واحتياجات كل فرد.`,
        tips: [
           'استخدم الوسائل البصرية والسمعية معاً.',
           'بسط التعليمات وقسم المهام المعقدة.',
           'اتبع مبادئ التصميم الشامل للتعلم (UDL).'
        ]
      }
  ];

  const activeSection = sections.find(s => s.id === activeTab) || sections[0];

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12 animate-fadeIn px-4">
      <div className="text-center space-y-4">
        <h1 className={`text-5xl font-black ${colors.text}`}>دليل المعلم المبدع</h1>
        <p className={`${colors.muted} text-xl max-w-2xl mx-auto leading-relaxed`}>
          لقد جمعنا لك أفضل المنهجيات التربوية الحديثة في مكان واحد لتساعدك على التميز داخل الصف.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${
              activeTab === section.id 
                ? (theme === 'day' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-orange-600 text-white shadow-xl scale-105')
                : (theme === 'day' ? 'bg-white border-2 border-slate-100 text-slate-600' : 'bg-gray-800 border-2 border-gray-700 text-gray-400')
            }`}
          >
            <span className="text-2xl">{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      <div className={`${colors.card} rounded-[3rem] p-10 md:p-16 shadow-2xl border ${colors.border} relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-12`}>
        <div className="space-y-8 relative z-10">
           <div className="flex items-center gap-4">
              <span className="text-6xl">{activeSection.icon}</span>
              <h2 className={`text-4xl font-black ${colors.text}`}>{activeSection.title}</h2>
           </div>
           
           <div className="space-y-6">
              <h3 className={`text-xl font-bold opacity-60 ${colors.text}`}>عن المنهجية</h3>
              <p className={`text-lg leading-relaxed ${colors.text} opacity-80`}>
                {activeSection.content}
              </p>
           </div>
           
           <div className="space-y-6">
              <h3 className={`text-xl font-bold opacity-60 ${colors.text}`}>نصائح سريعة للتحضير</h3>
              <ul className="space-y-4">
                {activeSection.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold ${theme === 'day' ? 'bg-blue-100 text-blue-600' : 'bg-gray-700 text-orange-400'}`}>
                      {index + 1}
                    </span>
                    <span className={`${colors.text} opacity-90`}>{tip}</span>
                  </li>
                ))}
              </ul>
           </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
           <div className={`w-full aspect-square rounded-[2rem] border-8 ${colors.border} overflow-hidden shadow-inner grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-1000`}>
             <img 
               src={`https://picsum.photos/seed/${activeSection.id}/800`} 
               className="w-full h-full object-cover" 
               alt={activeSection.title} 
               referrerPolicy="no-referrer"
             />
           </div>
        </div>
        
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className={`${colors.card} p-8 rounded-3xl border ${colors.border} shadow-lg space-y-4`}>
            <h3 className={`text-xl font-bold ${colors.text}`}>لماذا نستخدم هذا الدليل؟</h3>
            <p className={`${colors.muted} leading-relaxed`}>
              هذا الدليل هو خلاصة تجارب طويلة في مجال التدريس الحديث. هدفنا هو تمكينك من الأدوات اللازمة لتكون قائداً تعليمياً ملهماً لطلابك.
            </p>
         </div>
         <div className={`${colors.card} p-8 rounded-3xl border ${colors.border} shadow-lg space-y-4`}>
            <h3 className={`text-xl font-bold ${colors.text}`}>كيف تبدأ؟</h3>
            <p className={`${colors.muted} leading-relaxed`}>
               اختر المنهجية التي تود اتباعها، ثم اذهب إلى "مخطط الدروس" واختر نفس المنهجية هناك، وسيقوم نظامنا بتوليد محتوى يتوافق معها.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Guide;
