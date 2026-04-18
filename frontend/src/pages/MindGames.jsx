import React, { useState, useEffect } from 'react';

export default function MindGames() {
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setCompleted(true);
      clearInterval(interval);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (completed) {
      setTimeLeft(1200);
      setCompleted(false);
    }
    setIsActive(!isActive);
  };

  const games = [
    { title: 'Sudoku', desc: 'Sharpen your logic and pattern recognition.', link: 'https://sudoku.com', icon: '🔢', color: 'from-blue-500 to-cyan-500' },
    { title: 'Chess', desc: 'Improve strategic thinking and foresight.', link: 'https://chess.com', icon: '♟️', color: 'from-gray-600 to-gray-800' },
    { title: 'Reaction Time', desc: 'Test and improve your edge execution speed.', link: 'https://humanbenchmark.com/tests/reactiontime', icon: '⚡', color: 'from-yellow-400 to-orange-500' },
    { title: 'Lumosity', desc: 'Daily brain training for cognitive control.', link: 'https://lumosity.com', icon: '🧠', color: 'from-green-400 to-emerald-600' }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Mind Games</h2>
          <p className="text-gray-400 mt-2">15-20 minutes daily to keep your trading mind sharp and disciplined.</p>
        </div>
        {completed && (
          <div className="bg-green-500/20 text-green-400 border border-green-500/50 px-4 py-2 rounded-xl flex items-center gap-2 animate-bounce">
            <span>🏆</span> Session Complete!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game, i) => (
          <a href={game.link} target="_blank" rel="noreferrer" key={i} className="group relative overflow-hidden bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${game.color} blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity`}></div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="text-5xl">{game.icon}</div>
              <div>
                <h3 className="text-2xl font-bold mb-1 group-hover:text-purple-400 transition-colors uppercase tracking-tight">{game.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{game.desc}</p>
                <span className="text-purple-400 font-bold text-sm flex items-center gap-1 group-hover:gap-3 transition-all">Play Now <span>→</span></span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className={`bg-[#131722] border transition-all duration-500 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between mt-4 gap-6 ${isActive ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'border-[#2B2B43]'}`}>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Focus Session Timer</h3>
          <p className="text-sm text-[#787B86]">Start this timer before you begin your mind games. Consistency is key.</p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className={`text-6xl font-black font-mono transition-colors ${isActive ? 'text-white' : 'text-[#787B86]'}`}>
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={toggleTimer}
            className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${isActive ? 'bg-[#EF5350] hover:bg-red-600 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'}`}
          >
            {completed ? 'Restart Session' : isActive ? 'Pause Focus' : 'Start Session'}
          </button>
        </div>
      </div>
    </div>
  );
}
