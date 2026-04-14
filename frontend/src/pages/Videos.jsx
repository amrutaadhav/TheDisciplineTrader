import React, { useState } from 'react';

export default function Videos() {
  const categories = [
    { id: 1, title: 'Trading Psychology', icon: '🧠', color: 'from-blue-500 to-indigo-600' },
    { id: 2, title: 'Discipline', icon: '⚖️', color: 'from-emerald-400 to-teal-500' },
    { id: 3, title: 'Money Management', icon: '💰', color: 'from-yellow-400 to-orange-500' },
    { id: 4, title: 'Self Improvement', icon: '🚀', color: 'from-purple-500 to-pink-600' },
    { id: 5, title: 'Diet and Exercise', icon: '🥦', color: 'from-green-500 to-emerald-600' },
    { id: 6, title: 'Audio Books', icon: '🎧', color: 'from-red-500 to-rose-600' }
  ];

  const [activeTab, setActiveTab] = useState(categories[0].id);

  // Mock videos based on category
  const videos = [
    { id: 1, categoryId: 1, title: 'Mastering the Mindset of a Pro', duration: '12:45', watched: true },
    { id: 2, categoryId: 1, title: 'Overcoming FOMO & Revenge Trading', duration: '24:30', watched: false },
    { id: 3, categoryId: 2, title: 'Building Unbreakable Habits', duration: '18:15', watched: true },
    { id: 4, categoryId: 3, title: 'The 1% Risk Rule Explained', duration: '14:20', watched: false },
    { id: 5, categoryId: 4, title: '1% Better Every Day', duration: '09:50', watched: true },
    { id: 6, categoryId: 5, title: 'Biohacking for Traders', duration: '22:10', watched: false },
    { id: 7, categoryId: 6, title: 'Trading in the Zone (Summary)', duration: '45:00', watched: true },
  ];

  const activeVideos = videos.filter(v => v.categoryId === activeTab || [1, 2, 3, 4, 5, 6].includes(activeTab)); // Mock logic: show some generic if empty
  const displayVideos = activeVideos.length > 0 ? activeVideos : [
    { id: 99, categoryId: activeTab, title: 'Introduction Course Module', duration: '15:00', watched: false },
    { id: 100, categoryId: activeTab, title: 'Advanced Tactics Overview', duration: '20:00', watched: false }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto pb-10 bg-[#0E0E0E] min-h-screen px-4 -m-8 pt-8">
      <div className="flex flex-col border-b border-[#2B2B43] pb-4">
        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Video Library</h2>
        <p className="text-[#787B86] mt-1">Curated educational content for mental edge and mastery.</p>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => setActiveTab(cat.id)}
            className={`px-5 py-3 rounded-xl border flex items-center gap-2 transition-all font-semibold ${activeTab === cat.id ? 'bg-[#1E222D] border-[#2962FF] text-white shadow-[0_0_15px_rgba(41,98,255,0.2)]' : 'bg-[#131722] border-[#2B2B43] text-[#787B86] hover:bg-[#1E222D]'}`}
          >
            <span>{cat.icon}</span>
            {cat.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {displayVideos.map((video) => (
          <div key={video.id} className="bg-[#131722] border border-[#2B2B43] rounded-2xl overflow-hidden shadow-xl hover:border-[#2962FF]/50 transition-all group cursor-pointer">
            {/* Mock Thumbnail */}
            <div className="h-44 w-full bg-[#1E222D] relative flex items-center justify-center overflow-hidden">
               <div className={`absolute inset-0 bg-gradient-to-br opacity-20 ${categories.find(c => c.id === activeTab)?.color}`}></div>
               <svg className="w-16 h-16 text-white/50 group-hover:text-white group-hover:scale-110 transition-all drop-shadow-lg relative z-10" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M8 5v14l11-7z" />
               </svg>
               <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-mono px-2 py-1 rounded">
                 {video.duration}
               </div>
               {video.watched && (
                 <div className="absolute top-3 left-3 bg-[#26A69A]/20 border border-[#26A69A]/50 text-[#26A69A] text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Watched
                 </div>
               )}
            </div>
            
            <div className="p-5">
              <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-[#2962FF] transition-colors">{video.title}</h3>
              <p className="text-[#787B86] text-sm">{categories.find(c => c.id === activeTab)?.title} Series</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
