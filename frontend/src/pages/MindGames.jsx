import React from 'react';

export default function MindGames() {
  const games = [
    { title: 'Sudoku', desc: 'Sharpen your logic and pattern recognition.', link: 'https://sudoku.com', icon: '🔢', color: 'from-blue-500 to-cyan-500' },
    { title: 'Chess', desc: 'Improve strategic thinking and foresight.', link: 'https://chess.com', icon: '♟️', color: 'from-gray-600 to-gray-800' },
    { title: 'Reaction Time', desc: 'Test and improve your edge execution speed.', link: 'https://humanbenchmark.com/tests/reactiontime', icon: '⚡', color: 'from-yellow-400 to-orange-500' },
    { title: 'Lumosity', desc: 'Daily brain training for cognitive control.', link: 'https://lumosity.com', icon: '🧠', color: 'from-green-400 to-emerald-600' }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Mind Games</h2>
        <p className="text-gray-400 mt-2">15-20 minutes daily to keep your trading mind sharp.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game, i) => (
          <a href={game.link} target="_blank" rel="noreferrer" key={i} className="group relative overflow-hidden bg-darkCard p-6 rounded-2xl border border-[#333] shadow-lg hover:-translate-y-1 transition-transform cursor-pointer">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${game.color} blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="text-5xl">{game.icon}</div>
              <div>
                <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{game.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{game.desc}</p>
                <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Play Now <span>→</span></span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-2xl flex items-center justify-between mt-4">
        <div>
          <h3 className="text-xl font-bold text-gray-200">Daily Timer</h3>
          <p className="text-sm text-gray-400">Track your 20m mind session.</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white font-mono text-2xl px-6 py-3 rounded-xl transition-colors border border-white/10">
          20:00
        </button>
      </div>
    </div>
  );
}
