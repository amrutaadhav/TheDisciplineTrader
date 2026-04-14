import React, { useState } from 'react';

export default function Journal() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Journal</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-primary hover:bg-primary/80 transition-colors text-white px-6 py-2 rounded-xl font-medium shadow-lg shadow-primary/20">
          + New Trade
        </button>
      </div>

      {showAdd && (
        <div className="bg-darkCard p-6 rounded-2xl border border-primary/30 shadow-xl mb-4">
          <h3 className="text-lg font-bold mb-4">Log New Trade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Asset / Pair" className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] text-white focus:outline-none focus:border-primary" />
            <input type="text" placeholder="Setup Name" className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] text-white focus:outline-none focus:border-primary" />
            <input type="number" placeholder="Entry Price" className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] text-white focus:outline-none focus:border-primary" />
            <input type="number" placeholder="Exit Price" className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] text-white focus:outline-none focus:border-primary" />
            <input type="text" placeholder="Risk:Reward" className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] text-white focus:outline-none focus:border-primary" />
            <input type="number" placeholder="P/L Amount" className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] text-white focus:outline-none focus:border-primary" />
          </div>
          <div className="mt-4">
            <h4 className="text-sm text-red-400 font-semibold mb-2">Rules Checklist (Must check all true to maintain discipline score!)</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> No overtrading</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> Min R:R 1:4</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> Logical entry</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> No FOMO</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> Avoid fear & greed</label>
            </div>
          </div>
          <textarea placeholder="Notes..." className="w-full bg-[#1a1a1a] mt-4 p-3 rounded-xl border border-[#333] text-white focus:outline-none focus:border-primary h-24" />
          <button className="mt-4 bg-secondary hover:bg-secondary/80 text-white font-bold py-2 px-6 rounded-xl w-full transition-colors">Save Trade</button>
        </div>
      )}

      <div className="bg-darkCard rounded-2xl border border-[#333] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] border-b border-[#333] text-gray-400 text-sm">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Asset</th>
              <th className="p-4 font-medium">Setup</th>
              <th className="p-4 font-medium">P/L</th>
              <th className="p-4 font-medium">R:R</th>
              <th className="p-4 font-medium">Rules Followed</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#333] hover:bg-[#252525] transition-colors">
              <td className="p-4 text-sm text-gray-300">14 Apr, 10:30 AM</td>
              <td className="p-4 font-semibold">EUR/USD</td>
              <td className="p-4 text-sm text-gray-300">Breakout</td>
              <td className="p-4 font-bold text-secondary">+$120.00</td>
              <td className="p-4 text-sm text-gray-300">1:4.5</td>
              <td className="p-4"><span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full border border-green-500/30">100%</span></td>
            </tr>
            <tr className="border-b border-[#333] hover:bg-[#252525] transition-colors">
              <td className="p-4 text-sm text-gray-300">13 Apr, 2:15 PM</td>
              <td className="p-4 font-semibold">BTC/USD</td>
              <td className="p-4 text-sm text-gray-300">Support Bounce</td>
              <td className="p-4 font-bold text-red-500">-$50.00</td>
              <td className="p-4 text-sm text-gray-300">1:3</td>
              <td className="p-4"><span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full border border-yellow-500/30">80%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
