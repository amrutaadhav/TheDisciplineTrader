import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StreakProvider } from './context/StreakContext';
import StreakWidget from './components/StreakWidget';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Routine from './pages/Routine';
import Capital from './pages/Capital';
import Videos from './pages/Videos';
import MindGames from './pages/MindGames';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Chatbot from './components/Chatbot';
function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'TR';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2962FF] to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(41,98,255,0.35)] hover:shadow-[0_0_25px_rgba(41,98,255,0.55)] transition-all cursor-pointer border-2 border-[#2B2B43]"
      >
        {initials}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-56 bg-[#131722] border border-[#2B2B43] rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-[#2B2B43]">
              <p className="font-bold text-white text-sm">{user?.name || 'Trader'}</p>
              <p className="text-xs text-[#787B86] mt-0.5 truncate">{user?.email || ''}</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#EF5350] hover:bg-[#EF5350]/10 transition-colors text-sm font-semibold"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AppLayout() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0E0E0E] text-white w-full overflow-hidden font-sans relative">
      {/* Global Atmospheric Background Logo */}
      <div className="fixed inset-0 flex items-center justify-center opacity-[0.10] pointer-events-none overflow-hidden select-none z-0">
        <img 
          src="/logo.png" 
          alt="" 
          className="w-[120%] md:w-[80%] max-w-none scale-150 transform rotate-12"
        />
      </div>
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-darkCard border-b md:border-b-0 md:border-r border-[#333] flex flex-col p-4 shadow-xl z-20 transition-all duration-300 md:h-full shrink-0">
        <div className="flex items-center justify-between md:justify-start gap-3 mb-2 md:mb-8 md:mt-2 px-2">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="The Discipline Trader Logo" className="w-9 h-9 rounded-xl shadow-[0_0_12px_rgba(41,98,255,0.4)] object-cover" />
            <h1 className="text-base md:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-cyan-400 tracking-wide leading-tight">The Discipline<br className="hidden md:block"/>Trader</h1>
          </div>
        </div>
        <nav className="flex md:flex-col gap-2 md:gap-3 font-medium overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
          <Link to="/" className="p-2 md:p-3 whitespace-nowrap shrink-0 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-2 md:gap-3 text-sm md:text-base"><span className="text-xl">📊</span><span className="md:inline">Dashboard</span></Link>
          <Link to="/journal" className="p-2 md:p-3 whitespace-nowrap shrink-0 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-2 md:gap-3 text-sm md:text-base"><span className="text-xl">📓</span><span className="md:inline">Journal</span></Link>
          <Link to="/routine" className="p-2 md:p-3 whitespace-nowrap shrink-0 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-2 md:gap-3 text-sm md:text-base"><span className="text-xl">✅</span><span className="md:inline">Routine</span></Link>
          <Link to="/capital" className="p-2 md:p-3 whitespace-nowrap shrink-0 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-2 md:gap-3 text-sm md:text-base"><span className="text-xl">💰</span><span className="md:inline">Bankroll</span></Link>
          <Link to="/videos" className="p-2 md:p-3 whitespace-nowrap shrink-0 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-2 md:gap-3 text-sm md:text-base"><span className="text-xl">🎬</span><span className="md:inline">Videos</span></Link>
          <Link to="/mindgames" className="p-2 md:p-3 whitespace-nowrap shrink-0 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-2 md:gap-3 text-sm md:text-base"><span className="text-xl">🧠</span><span className="md:inline">Mind Games</span></Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <header className="h-auto md:h-16 py-3 md:py-0 border-b border-[#333] flex flex-col md:flex-row items-center justify-between px-4 md:px-8 bg-darkBg/90 backdrop-blur relative md:sticky top-0 z-10 gap-3 md:gap-0">
          <h2 className="text-base md:text-lg font-semibold text-gray-200 truncate w-full md:w-auto text-center md:text-left">Welcome back, {user?.name?.split(' ')[0] || 'Trader'} 👋</h2>
          <div className="flex items-center justify-center md:justify-end gap-3 md:gap-4 w-full md:w-auto">
            <StreakWidget />
            <ProfileMenu />
          </div>
        </header>
        <div className="p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/capital" element={<Capital />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/mindgames" element={<MindGames />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </div>
        
        {/* Meaningful Footer */}
        <footer className="mt-auto py-6 border-t border-[#2B2B43] bg-[#0A0E17]/80 backdrop-blur flex flex-col md:flex-row items-center justify-between px-4 md:px-8">
          <p className="text-[#787B86] text-xs sm:text-sm italic text-center md:text-left mb-4 md:mb-0 max-w-sm md:max-w-none">
            "Discipline is the bridge between goals and accomplishment. Protect your capital, respect your rules."
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/about" className="text-[#D1D4DC] hover:text-[#2962FF] text-xs sm:text-sm font-semibold transition-colors">
              About Us
            </Link>
            <span className="text-[#2B2B43] hidden sm:inline">|</span>
            <span className="text-[#787B86] text-[10px] sm:text-xs text-center">© {new Date().getFullYear()} The Discipline Trader</span>
          </div>
        </footer>

        {/* Global Chatbot */}
        <Chatbot />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <StreakProvider>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </StreakProvider>
      </AuthProvider>
    </Router>
  );
}

function LoginRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <Login />;
}

export default App;
