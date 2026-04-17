import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { THEME_COLORS } from '../constants';

const Community: React.FC = () => {
  const { user, communityPosts, addPost } = useAuth();
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme];
  const [newPost, setNewPost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || isPosting) return;
    setIsPosting(true);
    try {
      await addPost(newPost, imageUrl);
      setNewPost('');
      setImageUrl('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  const getRandomImage = () => {
    setImageUrl(`https://picsum.photos/seed/${Math.random()}/800/600`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className={`text-4xl md:text-5xl font-black ${colors.text}`}>مجتمع المعلمين المبدعين</h1>
        <p className={`${colors.muted} text-lg`}>شارك أفكارك، تجاربك، وصورك مع زملائك في المهنة.</p>
      </div>

      {/* Post Box */}
      <div className={`${colors.card} p-6 rounded-3xl shadow-xl border ${colors.border}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className={`w-full p-4 rounded-2xl border ${colors.border} ${colors.input} ${colors.text} focus:ring-2 focus:ring-blue-500 outline-none resize-none`}
            rows={3}
            placeholder="بماذا تفكر اليوم؟ شاركنا إبداعك..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full md:w-auto">
              <input 
                type="text"
                placeholder="رابط الصورة (اختياري)"
                className={`flex-1 md:w-64 p-2 text-sm rounded-xl border ${colors.border} ${colors.input} ${colors.text}`}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <button 
                type="button"
                onClick={getRandomImage}
                className={`p-2 rounded-xl border ${colors.border} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                title="أضف صورة عشوائية"
              >
                🎲
              </button>
            </div>
            
            <button
              type="submit"
              disabled={isPosting || !newPost.trim()}
              className={`w-full md:w-auto px-10 py-3 rounded-2xl text-white font-bold transition-all transform hover:scale-105 ${
                theme === 'day' ? 'bg-blue-600 shadow-blue-200' : 'bg-orange-600 shadow-orange-950/20'
              } shadow-lg disabled:opacity-50`}
            >
              {isPosting ? 'جاري النشر...' : 'انشر الآن'}
            </button>
          </div>
          
          {imageUrl && (
            <div className="relative rounded-2xl overflow-hidden h-48 border group">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button 
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-6 md:space-y-8">
        {communityPosts.map((post: any) => (
          <div key={post.id} className={`${colors.card} rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border ${colors.border} flex flex-col`}>
             <div className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <img 
                  src={post.authorPhoto || `https://i.pravatar.cc/150?u=${post.authorUid}`} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl" 
                  alt={post.authorName} 
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                   <h3 className={`font-bold text-sm md:text-base ${colors.text}`}>{post.authorName}</h3>
                   <p className="text-[10px] md:text-xs text-orange-500 font-medium">معلم مبدع</p>
                </div>
                <span className={`text-[10px] md:text-xs ${colors.muted}`}>
                  {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString('ar-EG') : 'الآن'}
                </span>
             </div>
             
             <div className="px-4 md:px-6 pb-4 md:pb-6">
                <p className={`${colors.text} text-sm md:text-base whitespace-pre-wrap leading-relaxed`}>{post.content}</p>
             </div>

             {post.imageUrl && (
               <div className="w-full h-64 md:h-96 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    alt="Post media" 
                    referrerPolicy="no-referrer"
                  />
               </div>
             )}

             <div className={`p-3 md:p-4 border-t ${colors.border} flex items-center gap-6 px-4 md:px-6`}>
                <button className="flex items-center gap-2 group">
                   <span className="text-xl group-hover:scale-125 transition-transform">❤️</span>
                   <span className={`text-sm ${colors.muted}`}>{post.likesCount || 0}</span>
                </button>
                <button className="flex items-center gap-2 group">
                   <span className="text-xl group-hover:scale-125 transition-transform">💬</span>
                   <span className={`text-sm ${colors.muted}`}>0</span>
                </button>
             </div>
          </div>
        ))}
        
        {communityPosts.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <span className="text-6xl block mb-4">📭</span>
            <p>لا توجد منشورات بعد.. كن أول من يشارك!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
