import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Routine from './pages/Routine';
import Capital from './pages/Capital';
import MindGames from './pages/MindGames';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-darkBg text-white w-full overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-darkCard border-r border-[#333] flex flex-col p-4 shadow-xl z-10 transition-all duration-300">
          <div className="flex items-center gap-2 mb-8 mt-2 px-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">DT</div>
            <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-wide">Discipline Trader</h1>
          </div>
          <nav className="flex flex-col gap-3 font-medium">
            <Link to="/" className="p-3 rounded-xl hover:bg-[#333] hover:text-white transition-all text-gray-300 flex items-center gap-3"><span className="text-xl">📊</span>Dashboard</Link>
            <Link to="/journal" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">📓</span>Journal</Link>
            <Link to="/routine" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">✅</span>Routine</Link>
            <Link to="/capital" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">💰</span>Bankroll</Link>
            <Link to="/mindgames" className="p-3 rounded-xl hover:bg-[#1E222D] hover:text-white transition-all text-[#D1D4DC] flex items-center gap-3"><span className="text-xl">🧠</span>Mind Games</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full relative">
          <header className="h-16 border-b border-[#333] flex items-center justify-between px-8 bg-darkBg/90 backdrop-blur top-0 sticky z-10">
            <h2 className="text-lg font-semibold text-gray-200">Welcome back, Trader</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">Score: 100</span>
              <div className="w-10 h-10 rounded-full bg-gray-700 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg cursor-pointer"></div>
            </div>
          </header>
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/routine" element={<Routine />} />
              <Route path="/capital" element={<Capital />} />
              <Route path="/mindgames" element={<MindGames />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
