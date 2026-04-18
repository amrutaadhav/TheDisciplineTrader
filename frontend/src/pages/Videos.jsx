import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Videos() {
  const { user } = useAuth();
  const categories = [
    { id: 1, title: 'Trading Psychology', icon: '🧠', color: 'from-blue-500 to-indigo-600' },
    { id: 2, title: 'Discipline', icon: '⚖️', color: 'from-emerald-400 to-teal-500' },
    { id: 3, title: 'Money Management', icon: '💰', color: 'from-yellow-400 to-orange-500' },
    { id: 4, title: 'Self Improvement', icon: '🚀', color: 'from-purple-500 to-pink-600' },
    { id: 5, title: 'Diet and Exercise', icon: '🥦', color: 'from-green-500 to-emerald-600' },
    { id: 6, title: 'Audio Books', icon: '🎧', color: 'from-red-500 to-rose-600' }
  ];

  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '' });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/videos`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setVideos(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    const ytId = extractYouTubeId(formData.url);
    if (!ytId) { alert("Please enter a valid YouTube URL."); return; }

    const payload = {
      categoryId: activeTab,
      title: formData.title || 'Untitled Lesson',
      youtubeId: ytId,
      url: formData.url
    };

    const res = await fetch(`${API}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const newVideo = await res.json();
    setVideos([newVideo, ...videos]);
    setFormData({ title: '', url: '' });
    setShowAddForm(false);
  };

  const deleteVideo = async (id) => {
    if (!window.confirm('Remove this video from your library?')) return;
    await fetch(`${API}/videos/${id}`, { method: 'DELETE' });
    setVideos(videos.filter(v => v._id !== id));
  };

  const activeVideos = videos.filter(v => v.categoryId === activeTab);

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto pb-10 bg-[#0E0E0E] min-h-screen px-4 -m-8 pt-8">
      <div className="flex justify-between items-end border-b border-[#2B2B43] pb-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Videos</h2>
          <p className="text-[#787B86] mt-1">Curated educational content for your mental edge and mastery.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl shadow-lg transition-all font-bold">
          {showAddForm ? 'Cancel' : '+ Add Video'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddVideo} className="bg-[#131722] border border-purple-500/50 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 flex flex-col w-full">
            <label className="text-xs text-[#787B86] mb-1 font-bold uppercase tracking-wider">Video Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="bg-[#1E222D] p-3 rounded-xl border border-[#2B2B43] focus:border-purple-500 text-white outline-none w-full" placeholder="e.g. Master Your Mindset part 1"/>
          </div>
          <div className="flex-1 flex flex-col w-full">
            <label className="text-xs text-[#787B86] mb-1 font-bold uppercase tracking-wider">YouTube URL</label>
            <input type="url" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})}
              className="bg-[#1E222D] p-3 rounded-xl border border-[#2B2B43] focus:border-purple-500 text-white outline-none w-full" placeholder="https://youtube.com/watch?v=..."/>
          </div>
          <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all w-full md:w-auto">
            Save to {categories.find(c => c.id === activeTab)?.title}
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3 mt-2">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveTab(cat.id)}
            className={`px-5 py-3 rounded-xl border flex items-center gap-2 transition-all font-semibold ${activeTab === cat.id ? 'bg-[#1E222D] border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-[#131722] border-[#2B2B43] text-[#787B86] hover:bg-[#1E222D]'}`}>
            <span>{cat.icon}</span>{cat.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {loading ? (
          <div className="col-span-full text-center text-[#787B86] py-12">Loading videos...</div>
        ) : activeVideos.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#787B86] border border-dashed border-[#2B2B43] rounded-2xl bg-[#131722]/50">
            <span className="text-4xl mb-4 block opacity-50">📂</span>
            <p>No videos added to this category yet.</p>
            <p className="text-sm mt-1">Click "+ Add Video" to save important YouTube lessons here.</p>
          </div>
        ) : activeVideos.map((video) => (
          <div key={video._id} className="bg-[#131722] border border-[#2B2B43] rounded-2xl overflow-hidden shadow-xl hover:border-purple-500/50 transition-all group flex flex-col">
            <a href={video.url} target="_blank" rel="noreferrer" className="h-48 w-full bg-[#1E222D] relative block overflow-hidden">
              <img src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <svg className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div className="absolute top-3 left-3 bg-[#E2B714]/90 text-black text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase shadow">YouTube</div>
            </a>
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <h3 className="text-white font-bold text-lg mb-1 leading-tight group-hover:text-purple-400 transition-colors">{video.title}</h3>
              <div className="flex justify-between items-center pt-3 border-t border-[#2B2B43]">
                <a href={video.url} target="_blank" rel="noreferrer" className="text-sm text-[#787B86] hover:text-white transition-colors">Study Now ↗</a>
                <button onClick={() => deleteVideo(video._id)} className="text-[#EF5350] hover:bg-[#EF5350]/10 p-2 rounded-lg transition-colors text-sm font-semibold">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
