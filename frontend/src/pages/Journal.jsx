import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

export default function Journal() {
  const [showAdd, setShowAdd] = useState(false);
  const [graphType, setGraphType] = useState('area'); // 'area' or 'candlestick'
  const [trades, setTrades] = useState([
    { id: 1, date: '14 Apr, 10:30 AM', pair: 'EUR/USD', setup: 'Breakout', entry: 1.1000, exit: 1.1050, rr: '1:4.5', pl: 120, notes: 'Followed plan perfectly.', rulesViolated: [] },
    { id: 2, date: '13 Apr, 2:15 PM', pair: 'BTC/USD', setup: 'Support Bounce', entry: 64000, exit: 63800, rr: '1:3', pl: -50, notes: 'Jumped in early.', rulesViolated: ['Wait for setup', 'No FOMO after missed entry'] },
    { id: 3, date: '12 Apr, 9:00 AM', pair: 'AAPL', setup: 'Trend Continuation', entry: 170.5, exit: 175.0, rr: '1:5', pl: 300, notes: 'Great hold.', rulesViolated: [] },
    { id: 4, date: '11 Apr, 1:00 PM', pair: 'NQ1!', setup: 'Mean Reversion', entry: 18000, exit: 17950, rr: '1:2', pl: -100, notes: 'Hit stop loss quickly.', rulesViolated: ['Min R:R 1:4'] },
    { id: 5, date: '10 Apr, 10:00 AM', pair: 'GOLD', setup: 'Momentum', entry: 2350, exit: 2365, rr: '1:3', pl: 150, notes: 'Nice quick trade.', rulesViolated: [] },
  ]);

  const [formData, setFormData] = useState({ pair: '', setup: '', entry: '', exit: '', rr: '', pl: '', notes: '' });
  const [rules, setRules] = useState({
    r1: { text: 'No overtrading', checked: true },
    r2: { text: 'Minimum R:R 1:4', checked: true },
    r3: { text: 'Entry on setup/logical', checked: true },
    r4: { text: 'No FOMO after missed entry', checked: true },
    r5: { text: 'No revenge trade after SL', checked: true },
    r6: { text: 'Avoid fear & greed', checked: true },
    r7: { text: 'Max 2-3 trades', checked: true },
    r8: { text: 'Wait for setup', checked: true },
  });

  const [warningMessage, setWarningMessage] = useState('');

  const toggleRule = (key) => setRules(prev => ({ ...prev, [key]: { ...prev[key], checked: !prev[key].checked } }));

  // Generate Data for Graphs
  const generateGraphData = () => {
    let startingCapital = 10000;
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let currentCapital = startingCapital;
    
    // Candlestick data points (OHLC)
    const candleData = [];
    // Area/Line data points (Date, Capital)
    const lineData = [];

    // Push initial baseline
    lineData.push({ x: 'Start', y: startingCapital });

    sortedTrades.forEach(t => {
      const pl = Number(t.pl);
      const open = currentCapital;
      const close = currentCapital + pl;
      
      // Simulate drawdown and run-up for candlestick realism 
      // If win limit low to max drawdown observed. If loss limit high to max run-up observed.
      const volatility = Math.abs(pl) * 0.5; 
      const high = Math.max(open, close) + (Math.random() * volatility);
      const low = Math.min(open, close) - (Math.random() * volatility);
      
      candleData.push({
        x: t.date.split(',')[0], // Just the date part
        y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)] // O, H, L, C
      });

      lineData.push({
        x: t.date.split(',')[0],
        y: close.toFixed(2)
      });
      
      currentCapital = close;
    });

    return { candleData, lineData, finalBalance: currentCapital - startingCapital };
  };

  const { candleData, lineData, finalBalance } = generateGraphData();

  const chartOptions = {
    chart: { 
      background: 'transparent',
      toolbar: { show: true, tools: { zoom: true, pan: true, reset: true } },
      zoom: { enabled: true },
      fontFamily: 'Inter, sans-serif'
    },
    theme: { mode: 'dark' },
    colors: graphType === 'area' ? ['#4F46E5'] : undefined,
    stroke: { curve: 'smooth', width: graphType === 'area' ? 3 : 1 },
    xaxis: { 
      type: 'category',
      labels: { style: { colors: '#9ca3af' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { 
        style: { colors: '#9ca3af' },
        formatter: (value) => `$${Number(value).toLocaleString()}`
      }
    },
    grid: { borderColor: '#333', strokeDashArray: 4 },
    dataLabels: { enabled: false },
    plotOptions: {
      candlestick: {
        colors: { upward: '#10B981', downward: '#EF4444' },
        wick: { useDataColor: true }
      }
    },
    tooltip: { theme: 'dark' }
  };

  const series = graphType === 'area' 
    ? [{ name: 'Cumulative Equity', data: lineData }]
    : [{ name: 'Equity Fluctuation', data: candleData }];


  const handleSaveTrade = () => {
    const violated = Object.values(rules).filter(r => !r.checked).map(r => r.text);
    if (violated.length > 0) {
      setWarningMessage(`Warning: You skipped ${violated.length} rule(s)! This negatively impacts your Discipline Score.`);
      setTimeout(() => setWarningMessage(''), 5000);
    }
    
    const newTrade = {
      id: Date.now(),
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
      pair: formData.pair || 'Unknown',
      setup: formData.setup || 'Manual',
      entry: Number(formData.entry) || 0,
      exit: Number(formData.exit) || 0,
      rr: formData.rr || 'Unknown',
      pl: Number(formData.pl) || 0,
      notes: formData.notes || '',
      rulesViolated: violated
    };
    
    setTrades([newTrade, ...trades]);
    setShowAdd(false);
    setFormData({ pair: '', setup: '', entry: '', exit: '', rr: '', pl: '', notes: '' });
    setRules(Object.fromEntries(Object.entries(rules).map(([k, v]) => [k, { ...v, checked: true }])));
  };

  const deleteTrade = (id) => setTrades(trades.filter(t => t.id !== id));

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end border-b border-[#333] pb-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Trading Journal</h2>
          <p className="text-gray-400 mt-1">Review your actions, learn from patterns.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className={`transition-all px-6 py-2 rounded-xl font-bold shadow-lg ${showAdd ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-primary hover:bg-primary/80 text-white shadow-primary/20'}`}>
          {showAdd ? 'Cancel Form' : '+ New Trade'}
        </button>
      </div>

      {warningMessage && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center justify-between">
          <p className="text-red-400 font-semibold">{warningMessage}</p>
          <button onClick={() => setWarningMessage('')} className="text-red-500 font-bold hover:text-white">✕</button>
        </div>
      )}

      {showAdd && (
        <div className="bg-[#1a1a1a] border border-primary/30 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-6">Log New Trade Execution</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 z-10 w-full relative">
              <div className="flex flex-col"><label className="text-sm text-gray-400 mb-1">Asset/Pair</label><input type="text" value={formData.pair} onChange={(e) => setFormData({...formData, pair: e.target.value})} className="bg-[#242424] p-3 rounded-xl border border-[#333] focus:border-primary text-white focus:outline-none transition-colors" placeholder="e.g. NQ, EURUSD" /></div>
              <div className="flex flex-col"><label className="text-sm text-gray-400 mb-1">Setup Type</label><input type="text" value={formData.setup} onChange={(e) => setFormData({...formData, setup: e.target.value})} className="bg-[#242424] p-3 rounded-xl border border-[#333] focus:border-primary text-white focus:outline-none transition-colors" placeholder="e.g. Reversal, A+" /></div>
              <div className="flex flex-col"><label className="text-sm text-gray-400 mb-1">Entry Price</label><input type="number" value={formData.entry} onChange={(e) => setFormData({...formData, entry: e.target.value})} className="bg-[#242424] p-3 rounded-xl border border-[#333] focus:border-primary text-white focus:outline-none transition-colors" placeholder="0.00" /></div>
              <div className="flex flex-col"><label className="text-sm text-gray-400 mb-1">Exit Price</label><input type="number" value={formData.exit} onChange={(e) => setFormData({...formData, exit: e.target.value})} className="bg-[#242424] p-3 rounded-xl border border-[#333] focus:border-primary text-white focus:outline-none transition-colors" placeholder="0.00" /></div>
              <div className="flex flex-col"><label className="text-sm text-gray-400 mb-1">Risk:Reward Ratio</label><input type="text" value={formData.rr} onChange={(e) => setFormData({...formData, rr: e.target.value})} className="bg-[#242424] p-3 rounded-xl border border-[#333] focus:border-primary text-white focus:outline-none transition-colors" placeholder="e.g. 1:4.5" /></div>
              <div className="flex flex-col"><label className="text-sm text-gray-400 mb-1">Net P/L Amount ($)</label><input type="number" value={formData.pl} onChange={(e) => setFormData({...formData, pl: e.target.value})} className="bg-[#242424] p-3 rounded-xl border border-[#333] focus:border-primary text-white focus:outline-none transition-colors" placeholder="e.g. 250 or -50" /></div>
              <div className="sm:col-span-2 flex flex-col"><label className="text-sm text-gray-400 mb-1">Trade Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="bg-[#242424] p-3 rounded-xl border border-[#333] focus:border-primary text-white focus:outline-none transition-colors h-24 resize-none" placeholder="What went well? What went wrong?"></textarea></div>
            </div>

            <div className="bg-[#242424] border border-[#333] rounded-2xl p-5 z-10 w-full relative">
              <h4 className="text-primary font-bold mb-4 flex items-center gap-2">🛑 Pre-Trade Rules Checklist</h4>
              <p className="text-xs text-gray-400 mb-4 pb-4 border-b border-[#333]">Unchecking these implies you broke discipline on this trade.</p>
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(rules).map(([key, rule]) => (
                  <label key={key} className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${rule.checked ? 'hover:bg-primary/10' : 'bg-red-500/10 border-l-2 border-red-500'}`}>
                    <input type="checkbox" checked={rule.checked} onChange={() => toggleRule(key)} className="mt-1 accent-primary w-4 h-4 cursor-pointer" />
                    <span className={`text-sm ${rule.checked ? 'text-gray-300' : 'text-red-400 font-medium'}`}>{rule.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#333] flex justify-end z-10 w-full relative">
            <button onClick={handleSaveTrade} className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/80 hover:to-indigo-600/80 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/30 transition-all w-full sm:w-auto">
              Save Execution to Journal
            </button>
          </div>
        </div>
      )}

      {/* Analytics Graph */}
      {!showAdd && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up">
          <div className="lg:col-span-3 bg-darkCard border border-[#333] p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-200">Equity Performance Analysis</h3>
              
              <div className="flex bg-[#242424] p-1 rounded-xl border border-[#333]">
                <button 
                  onClick={() => setGraphType('area')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${graphType === 'area' ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Line (Point)
                </button>
                <button 
                  onClick={() => setGraphType('candlestick')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${graphType === 'candlestick' ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Candlestick
                </button>
              </div>
            </div>
            
            <div className="w-full relative h-[320px]">
              <Chart 
                options={chartOptions} 
                series={series} 
                type={graphType === 'area' ? 'area' : 'candlestick'} 
                height="100%" 
                width="100%" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-darkCard border border-[#333] p-6 rounded-2xl shadow-xl flex-1 flex flex-col justify-center items-center">
              <span className="text-gray-400 text-sm font-medium">Net P/L To Date</span>
              <span className={`text-4xl font-black mt-2 ${finalBalance >= 0 ? 'text-secondary' : 'text-red-500'}`}>
                {finalBalance >= 0 ? '+' : ''}${finalBalance.toFixed(2)}
              </span>
            </div>
            <div className="bg-darkCard border border-[#333] p-6 rounded-2xl shadow-xl flex-1 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute w-24 h-24 bg-yellow-500/10 rounded-full blur-xl top-0 right-0"></div>
              <span className="text-gray-400 text-sm font-medium">Rule Compliance</span>
              <span className="text-4xl font-black mt-2 text-yellow-500 relative z-10">
                {trades.length > 0 ? Math.round((trades.filter(t => t.rulesViolated.length === 0).length / trades.length) * 100) : 100}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Trades Table */}
      <h3 className="text-xl font-bold mt-4 mb-2 text-gray-200">Execution History</h3>
      <div className="bg-darkCard rounded-2xl border border-[#333] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#1a1a1a] border-b border-[#333] text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-5 font-semibold">Date</th>
                <th className="p-5 font-semibold">Asset / Setup</th>
                <th className="p-5 font-semibold">Entry → Exit</th>
                <th className="p-5 font-semibold">Net P/L</th>
                <th className="p-5 font-semibold">R:R</th>
                <th className="p-5 font-semibold">Discipline check</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr><td colSpan="7" className="text-center p-8 text-gray-500">No trades logged yet. Start executing!</td></tr>
              ) : trades.map((trade) => (
                <tr key={trade.id} className="border-b border-[#333] hover:bg-[#252525] transition-colors group">
                  <td className="p-5 text-sm text-gray-300">{trade.date}</td>
                  <td className="p-5">
                    <div className="font-bold text-gray-100">{trade.pair}</div>
                    <div className="text-xs text-gray-500 mt-1">{trade.setup}</div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                       <span className="bg-gray-800 px-2 py-0.5 rounded text-xs">E</span> {trade.entry}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span className="bg-gray-800 px-2 py-0.5 rounded text-xs">X</span> {trade.exit}
                    </div>
                  </td>
                  <td className={`p-5 font-bold ${trade.pl >= 0 ? 'text-secondary' : 'text-red-500'}`}>
                    <span className={`px-3 py-1 rounded bg-opacity-10 ${trade.pl >= 0 ? 'bg-secondary text-secondary' : 'bg-red-500 text-red-500'}`}>
                      {trade.pl >= 0 ? '+' : ''}${trade.pl}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-md border border-[#444]">{trade.rr}</span>
                  </td>
                  <td className="p-5 text-xs">
                    {trade.rulesViolated.length === 0 ? (
                      <span className="bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full border border-green-500/20 font-medium">✨ 100% Protocol</span>
                    ) : (
                      <div className="flex flex-col gap-1 items-start group relative">
                        <span className="bg-red-500/10 text-red-500 px-3 py-1.5 rounded-full border border-red-500/20 font-medium cursor-help">⚠️ Violated {trade.rulesViolated.length} rule(s)</span>
                        <div className="hidden group-hover:flex absolute left-0 top-full mt-2 bg-darkCard border border-red-500/50 p-3 rounded-lg shadow-2xl z-50 flex-col gap-1 w-48 transition-all">
                          {trade.rulesViolated.map((r, i) => <span key={i} className="text-red-400 block break-words whitespace-normal text-xs">• {r}</span>)}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-blue-400 p-2 transition-colors" title="Edit">✏️</button>
                    <button onClick={() => deleteTrade(trade.id)} className="text-gray-400 hover:text-red-500 p-2 transition-colors ml-2" title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
