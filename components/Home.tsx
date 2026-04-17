import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { THEME_COLORS } from '../constants';

const HeroSlider: React.FC = () => {
  const images = [
    'https://images.unsplash.com/photo-1544717297-fa154ddad54f?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200'
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
      {images.map((img, i) => (
        <div
          key={i}
          style={{ transition: 'opacity 1.5s ease-in-out' }}
          className={`absolute inset-0 ${i === current ? 'opacity-100 scale-105' : 'opacity-0 scale-100'} transition-transform duration-[5s]`}
        >
          <img src={img} className="w-full h-full object-cover blur-[4px] brightness-[0.45]" alt="Teacher" referrerPolicy="no-referrer" />
        </div>
      ))}
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string; detail: string }> = ({ icon, title, description, detail }) => {
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`${colors.card} p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] border ${colors.border} shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 group relative overflow-hidden`}
    >
      <div className="flex justify-between items-start mb-2 md:mb-6">
        <span className="text-3xl md:text-5xl group-hover:scale-110 transition-transform duration-500">{icon}</span>
        <span className="text-sm md:text-xl opacity-0 group-hover:opacity-40 transition-opacity">ℹ️</span>
      </div>
      <h3 className={`text-sm md:text-2xl font-black mb-1 md:mb-4 ${colors.text}`}>{title}</h3>
      <p className={`${colors.muted} leading-tight md:leading-relaxed text-[10px] md:text-lg`}>{description}</p>
      
      {isExpanded && (
        <div className={`mt-3 md:mt-6 pt-3 md:pt-6 border-t ${colors.border} animate-fadeIn`}>
          <p className="text-[10px] md:text-sm opacity-90 leading-relaxed italic font-medium">{detail}</p>
        </div>
      )}
      
      <div className="absolute bottom-0 right-0 w-12 h-12 md:w-24 md:h-24 bg-current opacity-[0.02] rounded-full translate-y-1/2 translate-x-1/2" />
    </div>
  );
};

const Home: React.FC = () => {
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme];
  
  return (
    <div className="space-y-32 py-10 px-4 max-w-7xl mx-auto">
      <div className="relative h-[450px] md:h-[700px] flex items-center justify-center rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl mx-auto">
        <HeroSlider />
        <div className="relative z-10 text-center space-y-6 md:space-y-10 animate-fadeIn px-6 md:px-8 max-w-5xl">
          <h1 className="text-4xl md:text-9xl font-black leading-tight text-white drop-shadow-2xl tracking-tighter">
            مستقبل التعليم <br/> <span className="text-blue-400">يبدأ بإبداعك</span>
          </h1>
          <p className="text-lg md:text-3xl text-white/95 leading-relaxed drop-shadow-xl font-medium opacity-90">
             رفيقك المبدع الذي يدمج التكنولوجيا بالفن التربوي ليصنع فرقاً في حياة كل معلم وطالب.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-4">
            <Link to="/planner" className="bg-blue-600 text-white px-8 md:px-14 py-4 md:py-6 rounded-2xl md:rounded-[2rem] text-lg md:text-2xl font-black shadow-2xl hover:scale-105 transition-all shadow-blue-900/40">ابدأ التخطيط الذكي</Link>
            <Link to="/community" className="bg-white/10 backdrop-blur-2xl text-white border-2 border-white/30 px-8 md:px-14 py-4 md:py-6 rounded-2xl md:rounded-[2rem] text-lg md:text-2xl font-black hover:bg-white/20 transition-all">استكشف المجتمع</Link>
          </div>
        </div>
      </div>

      <div className="space-y-12 md:space-y-16">
        <div className="text-center space-y-4 px-4">
           <h2 className={`text-3xl md:text-6xl font-black ${colors.text}`}>لماذا "معلم بلس"؟</h2>
           <p className={`${colors.muted} text-lg md:text-xl max-w-2xl mx-auto`}>نحن نعيد تعريف مفهوم التحضير المدرسي ليصبح تجربة إلهامية وشاملة.</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
           <FeatureCard 
              icon="🚀" 
              title="تقنيات STEAM" 
              description="دمج العلوم والتكنولوجيا والهندسة والفنون والرياضيات في خطة واحدة متماسكة."
              detail="يعتمد STEAM على التعلم القائم على الاستقصاء والتفكير النقدي. نساعدك في تصميم تجارب تجمع بين التصميم الهندسي والمنطق البرمجي بأسلوب فني جذاب."
           />
           <FeatureCard 
              icon="🌍" 
              title="التعليم الجامع" 
              description="تخصيص كامل لذوي الاحتياجات وصعوبات التعلم لضمان وصول المعرفة للجميع."
              detail="التعليم الجامع يعني تكييف البيئة والوسائل لتناسب كل فرد. نوفر استراتيجيات تعديل السلوك، وتبسيط المفاهيم، ودمج لغة الإشارة أو الوسائل البصرية."
           />
           <FeatureCard 
              icon="💡" 
              title="رؤى عميقة" 
              description="دليل معرفي يجعلك متمكناً من كل زوايا الدرس والتعامل مع الأسئلة غير المتوقعة."
              detail="نقدم لك أصل المعلومات، سياقها التاريخي، وأجوبة لأسئلة 'ماذا لو؟' التي قد يطرحها الطلاب، لتبقى دائماً في موقع المتمكن والمبدع."
           />
           <FeatureCard 
              icon="🧩" 
              title="مونتيسوري" 
              description="التعلم القائم على الاستقلالية والتجربة اليدوية داخل الصف."
              detail="مونتيسوري تركز على الطفل كقائد لعملية تعلمه. نوفر خططاً تدعم الركن الحسي، العملي، واللغوي بمهام مصممة لتنمية مهارات الحياة."
           />
           <FeatureCard 
              icon="🏗️" 
              title="التعلم بالمشاريع (PBL)" 
              description="حل مشكلات حقيقية من خلال مشاريع غامرة طويلة الأمد."
              detail="في PBL، يبحث الطلاب عن حلول لقضايا واقعية. نساعدك في تقسيم المشروع لمراحل: التساؤل، البحث، النمذجة، ثم عرض النتائج أمام الجمهور."
           />
           <FeatureCard 
              icon="🎭" 
              title="الأنشطة المسلية" 
              description="تحويل الدرس إلى لعبة أو مغامرة لا تنسى."
              detail="التلعيب (Gamification) يزيد من إفراز الدوبامين وتحسين الذاكرة. خططنا تحتوي دائماً على ألعاب حركية أو ذهنية تكسر جمود المناهج."
           />
        </div>
      </div>
    </div>
  );
};

export default Home;
