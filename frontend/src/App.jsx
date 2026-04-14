import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Routine from './pages/Routine';
import Capital from './pages/Capital';
import Videos from './pages/Videos';
import MindGames from './pages/MindGames';
import Login from './pages/Login';

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
    <div className="flex h-screen bg-darkBg text-white w-full overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-darkCard border-r border-[#333] flex flex-col p-4 shadow-xl z-10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-8 mt-2 px-2">
          <img src="/logo.png" alt="The Discipline Trader Logo" className="w-9 h-9 rounded-xl shadow-[0_0_12px_rgba(41,98,255,0.4)] object-cover" />
          <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-cyan-400 tracking-wide leading-tight">The Discipline<br/>Trader</h1>
        </div>
        <nav className="flex flex-col gap-3 font-medium">
          <Link to="/" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">📊</span>Dashboard</Link>
          <Link to="/journal" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">📓</span>Journal</Link>
          <Link to="/routine" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">✅</span>Routine</Link>
          <Link to="/capital" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">💰</span>Bankroll</Link>
          <Link to="/videos" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">🎬</span>Videos</Link>
          <Link to="/mindgames" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">🧠</span>Mind Games</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <header className="h-16 border-b border-[#333] flex items-center justify-between px-8 bg-darkBg/90 backdrop-blur top-0 sticky z-10">
          <h2 className="text-lg font-semibold text-gray-200">Welcome back, {user?.name?.split(' ')[0] || 'Trader'} 👋</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">Score: 100</span>
            <ProfileMenu />
          </div>
        </header>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/capital" element={<Capital />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/mindgames" element={<MindGames />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
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
