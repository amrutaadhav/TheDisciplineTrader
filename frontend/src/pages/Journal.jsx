import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

export default function Journal() {
  const [showAdd, setShowAdd] = useState(false);
  const [editTradeId, setEditTradeId] = useState(null);
  const [graphType, setGraphType] = useState('area');
  
  const initialRules = {
    r1: { text: 'No overtrading', checked: true },
    r2: { text: 'Minimum R:R 1:4', checked: true },
    r3: { text: 'Entry on setup/logical', checked: true },
    r4: { text: 'No FOMO after missed entry', checked: true },
    r5: { text: 'No revenge trade after SL', checked: true },
    r6: { text: 'Avoid fear & greed', checked: true },
    r7: { text: 'Max 2-3 trades', checked: true },
    r8: { text: 'Wait for setup', checked: true }
  };
  
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trades`)
      .then(res => res.json())
      .then(data => {
         if(Array.isArray(data)) {
           setTrades(data.map(d => ({...d, id: d._id})));
         }
      })
      .catch(err => console.error(err));
  }, []);

  const [formData, setFormData] = useState({ pair: '', setup: '', entry: '', exit: '', rr: '', pl: '', notes: '' });
  const [rules, setRules] = useState(initialRules);
  const [warningMessage, setWarningMessage] = useState('');

  const toggleRule = (key) => setRules(prev => ({ ...prev, [key]: { ...prev[key], checked: !prev[key].checked } }));

  // Generate Data for Graph & KPIs
  const generateGraphData = () => {
    let startingCapital = 10000;
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentCapital = startingCapital;
    
    const candleData = [];
    const lineData = [];
    lineData.push({ x: 'Start', y: startingCapital });

    sortedTrades.forEach((t, index) => {
      const pl = Number(t.pl);
      const open = currentCapital;
      const close = currentCapital + pl;
      const volatility = Math.max(Math.abs(pl) * 0.4, 15);
      
      const high = Math.max(open, close) + (Math.random() * volatility);
      const low = Math.min(open, close) - (Math.random() * volatility);
      
      const dateLabel = t.pair + ' (T' + (index + 1) + ')';
      
      candleData.push({ x: dateLabel, y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)] });
      lineData.push({ x: dateLabel, y: close.toFixed(2) });
      
      currentCapital = close;
    });

    // Rule Compliance logic: Percentage of Total Checked Rules vs Total Possible
    const totalPossibleRules = trades.length * 8;
    const totalViolatedRules = trades.reduce((acc, t) => acc + t.rulesViolated.length, 0);
    const compliancePercent = trades.length > 0 ? Math.round(((totalPossibleRules - totalViolatedRules) / totalPossibleRules) * 100) : 100;

    // Total Net P/L
    const totalPL = trades.reduce((acc, t) => acc + Number(t.pl), 0);

    return { candleData, lineData, finalBalance: totalPL, compliancePercent };
  };

  const { candleData, lineData, finalBalance, compliancePercent } = generateGraphData();

  const chartOptions = {
    chart: { 
      background: '#121212',
      toolbar: { show: true, tools: { pan: true, zoom: true, reset: true, download: false } },
      fontFamily: 'Inter, sans-serif'
    },
    theme: { mode: 'dark' },
    colors: graphType === 'area' ? ['#2962FF'] : undefined,
    stroke: { curve: 'straight', width: graphType === 'area' ? 2 : 1 },
    fill: graphType === 'area' ? {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] }
    } : {},
    xaxis: { 
      type: 'category',
      labels: { style: { colors: '#787B86', fontSize: '11px' } },
      axisBorder: { show: true, color: '#2B2B43' },
      axisTicks: { show: true, color: '#2B2B43' },
      crosshairs: { show: true, stroke: { color: '#787B86', width: 1, dashArray: 4 } }
    },
    yaxis: {
      opposite: true,
      labels: { style: { colors: '#787B86', fontSize: '11px' }, formatter: (value) => value.toFixed(2) },
      crosshairs: { show: true }
    },
    grid: { borderColor: '#1E222D', strokeDashArray: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      candlestick: { colors: { upward: '#26A69A', downward: '#EF5350' }, wick: { useDataColor: true } }
    },
    tooltip: { theme: 'dark' }
  };

  const series = graphType === 'area' ? [{ name: 'Balance', data: lineData }] : [{ name: 'Equity OHLC', data: candleData }];

  const handleEditClick = (trade) => {
    setFormData({ pair: trade.pair, setup: trade.setup, entry: trade.entry, exit: trade.exit, rr: trade.rr, pl: trade.pl, notes: trade.notes || '' });
    const newRules = { ...initialRules };
    Object.keys(newRules).forEach(k => {
      if (trade.rulesViolated.includes(newRules[k].text)) newRules[k].checked = false;
    });
    setRules(newRules);
    setEditTradeId(trade.id);
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setShowAdd(false);
    setEditTradeId(null);
    setFormData({ pair: '', setup: '', entry: '', exit: '', rr: '', pl: '', notes: '' });
    setRules(initialRules);
  };

  const handleSaveTrade = () => {
    const violated = Object.values(rules).filter(r => !r.checked).map(r => r.text);
    if (violated.length > 0) {
      setWarningMessage(`Warning: You skipped ${violated.length} rule(s)! This negatively impacts your Discipline Score.`);
      setTimeout(() => setWarningMessage(''), 5000);
    }
    
    const tradeData = {
      pair: formData.pair || 'Unknown',
      setup: formData.setup || 'Manual',
      entry: Number(formData.entry) || 0,
      exit: Number(formData.exit) || 0,
      rr: formData.rr || 'Unknown',
      pl: Number(formData.pl) || 0,
      notes: formData.notes || '',
      rulesViolated: violated,
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    };
    
    if (editTradeId) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trades/${editTradeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData)
      }).then(res => res.json()).then(updatedTrade => {
        setTrades(trades.map(t => t.id === editTradeId ? { ...updatedTrade, id: updatedTrade._id } : t));
        cancelEdit();
      });
    } else {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData)
      }).then(res => res.json()).then(newTrade => {
        setTrades([{...newTrade, id: newTrade._id}, ...trades]);
        cancelEdit();
      });
    }
  };

  const deleteTrade = (id) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trades/${id}`, { method: 'DELETE' })
      .then(() => setTrades(trades.filter(t => t.id !== id)));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto pb-10 bg-transparent min-h-screen px-4 -m-8 pt-8">
      <div className="flex justify-between items-end border-b border-[#2B2B43] pb-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#2962FF] to-cyan-400">Trading Journal</h2>
          <p className="text-[#787B86] mt-1">Review your actions, learn from patterns.</p>
        </div>
        <button onClick={() => showAdd ? cancelEdit() : setShowAdd(true)} className={`transition-all px-6 py-2 rounded-xl font-bold shadow-lg ${showAdd ? 'bg-[#EF5350]/20 text-[#EF5350] border border-[#EF5350]/50' : 'bg-[#2962FF] hover:bg-[#2962FF]/80 text-white shadow-[#2962FF]/20'}`}>
          {showAdd ? 'Cancel' : '+ New Trade'}
        </button>
      </div>

      {warningMessage && (
        <div className="bg-[#EF5350]/10 border-l-4 border-[#EF5350] p-4 rounded-r-xl flex items-center justify-between">
          <p className="text-[#EF5350] font-semibold">{warningMessage}</p>
          <button onClick={() => setWarningMessage('')} className="text-[#EF5350] font-bold hover:text-white">✕</button>
        </div>
      )}

      {showAdd && (
        <div className="bg-[#131722] border border-[#2B2B43] p-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2962FF]/5 blur-[100px] pointer-events-none"></div>
          <h3 className="text-xl font-bold text-white mb-6">{editTradeId ? 'Update Execution' : 'Log New Execution'}</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 z-10 w-full relative">
              <div className="flex flex-col"><label className="text-sm text-[#787B86] mb-1">Asset/Pair</label><input type="text" value={formData.pair} onChange={(e) => setFormData({...formData, pair: e.target.value})} className="bg-[#1E222D] p-3 rounded-xl border border-[#2B2B43] focus:border-[#2962FF] text-[#D1D4DC] focus:outline-none transition-colors font-mono" placeholder="e.g. NQ, EURUSD" /></div>
              <div className="flex flex-col"><label className="text-sm text-[#787B86] mb-1">Setup Type</label><input type="text" value={formData.setup} onChange={(e) => setFormData({...formData, setup: e.target.value})} className="bg-[#1E222D] p-3 rounded-xl border border-[#2B2B43] focus:border-[#2962FF] text-[#D1D4DC] focus:outline-none transition-colors" placeholder="e.g. Reversal, A+" /></div>
              <div className="flex flex-col"><label className="text-sm text-[#787B86] mb-1">Entry Price ($)</label><input type="number" value={formData.entry} onChange={(e) => setFormData({...formData, entry: e.target.value})} className="bg-[#1E222D] p-3 rounded-xl border border-[#2B2B43] focus:border-[#2962FF] text-[#D1D4DC] focus:outline-none transition-colors font-mono" placeholder="0.00" /></div>
              <div className="flex flex-col"><label className="text-sm text-[#787B86] mb-1">Exit Price ($)</label><input type="number" value={formData.exit} onChange={(e) => setFormData({...formData, exit: e.target.value})} className="bg-[#1E222D] p-3 rounded-xl border border-[#2B2B43] focus:border-[#2962FF] text-[#D1D4DC] focus:outline-none transition-colors font-mono" placeholder="0.00" /></div>
              <div className="flex flex-col"><label className="text-sm text-[#787B86] mb-1">Risk:Reward Ratio</label><input type="text" value={formData.rr} onChange={(e) => setFormData({...formData, rr: e.target.value})} className="bg-[#1E222D] p-3 rounded-xl border border-[#2B2B43] focus:border-[#2962FF] text-[#D1D4DC] focus:outline-none transition-colors" placeholder="e.g. 1:4.5" /></div>
              <div className="flex flex-col"><label className="text-sm text-[#787B86] mb-1">Net P/L Amount ($)</label><input type="number" value={formData.pl} onChange={(e) => setFormData({...formData, pl: e.target.value})} className="bg-[#1E222D] p-3 rounded-xl border border-[#2B2B43] focus:border-[#2962FF] text-[#26A69A] focus:outline-none transition-colors font-mono font-bold" placeholder="e.g. 250 or -50" /></div>
              <div className="sm:col-span-2 flex flex-col"><label className="text-sm text-[#787B86] mb-1">Trade Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="bg-[#1E222D] p-3 rounded-xl border border-[#2B2B43] focus:border-[#2962FF] text-[#D1D4DC] focus:outline-none transition-colors h-24 resize-none" placeholder="What went well? What went wrong?"></textarea></div>
            </div>

            <div className="bg-[#1E222D] border border-[#2B2B43] rounded-2xl p-5 z-10 w-full relative">
              <h4 className="text-[#2962FF] font-bold mb-4 flex items-center gap-2">🛑 Pre-Trade Rules</h4>
              <p className="text-xs text-[#787B86] mb-4 pb-4 border-b border-[#2B2B43]">Unchecking these implies you broke discipline on this trade.</p>
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(rules).map(([key, rule]) => (
                  <label key={key} className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${rule.checked ? 'hover:bg-[#2B2B43]' : 'bg-[#EF5350]/10 border-l-2 border-[#EF5350]'}`}>
                    <input type="checkbox" checked={rule.checked} onChange={() => toggleRule(key)} className="mt-1 accent-[#2962FF] w-4 h-4 cursor-pointer" />
                    <span className={`text-sm ${rule.checked ? 'text-[#D1D4DC]' : 'text-[#EF5350] font-medium'}`}>{rule.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#2B2B43] flex justify-end z-10 w-full relative">
            <button onClick={handleSaveTrade} className="bg-[#2962FF] hover:bg-[#1E53E5] text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all w-full sm:w-auto">
              {editTradeId ? 'Update Execution' : 'Save Execution to Journal'}
            </button>
          </div>
        </div>
      )}

      {/* Analytics Graph */}
      {!showAdd && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up">
          <div className="lg:col-span-3 bg-[#131722] border border-[#2B2B43] p-6 rounded-2xl shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4 items-center">
                <h3 className="text-lg font-bold text-[#D1D4DC]">Equity Chart</h3>
                <span className="bg-[#1E222D] text-[#787B86] text-xs px-2 py-1 rounded font-mono border border-[#2B2B43]">1D</span>
              </div>
              <div className="flex bg-[#1E222D] p-1 rounded-lg border border-[#2B2B43]">
                <button 
                  onClick={() => setGraphType('area')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1 ${graphType === 'area' ? 'bg-[#2B2B43] text-white shadow' : 'text-[#787B86] hover:text-[#D1D4DC]'}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 14l5-5 4 4 5-5"/></svg> Line
                </button>
                <button 
                  onClick={() => setGraphType('candlestick')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1 ${graphType === 'candlestick' ? 'bg-[#2B2B43] text-white shadow' : 'text-[#787B86] hover:text-[#D1D4DC]'}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 4v16"/><path d="M15 4v16"/><path d="M7 8h4v8H7zm6-2h4v12h-4z"/></svg> Candles
                </button>
              </div>
            </div>
            
            <div className="w-full relative flex-1 min-h-[350px] overflow-x-auto overflow-y-auto custom-scrollbar">
              <div className="min-w-[600px] md:min-w-0 h-full">
                <Chart options={chartOptions} series={series} type={graphType === 'area' ? 'area' : 'candlestick'} height="100%" width="100%" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-[#131722] border border-[#2B2B43] p-6 rounded-2xl shadow-xl flex-1 flex flex-col justify-center items-center">
              <span className="text-[#787B86] text-sm font-medium uppercase tracking-wider">Net P/L To Date</span>
              <span className={`text-4xl font-black mt-2 font-mono ${finalBalance >= 0 ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
                {finalBalance >= 0 ? '+' : ''}${finalBalance.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#131722] border border-[#2B2B43] p-6 rounded-2xl shadow-xl flex-1 flex flex-col justify-center items-center relative overflow-hidden">
              <span className="text-[#787B86] text-sm font-medium uppercase tracking-wider text-center">Cumulative Rule<br/>Compliance</span>
              <span className="text-4xl font-black mt-2 text-[#E2B714] font-mono relative z-10">
                {compliancePercent}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Trades Table */}
      <div className="flex justify-between items-end mt-4 mb-2">
        <h3 className="text-xl font-bold text-[#D1D4DC]">Positions</h3>
      </div>
      
      <div className="bg-[#131722] rounded-2xl border border-[#2B2B43] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#1E222D] border-b border-[#2B2B43] text-[#787B86] text-xs font-semibold tracking-wider">
                <th className="p-4 pl-6">Time</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Side / Setup</th>
                <th className="p-4">Price / Target ($)</th>
                <th className="p-4">P&L</th>
                <th className="p-4">R:R</th>
                <th className="p-4 border-r border-[#2B2B43]">Compliance</th>
                <th className="p-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr><td colSpan="8" className="text-center p-8 text-[#787B86]">No positions logged.</td></tr>
              ) : trades.map((trade) => (
                <tr key={trade.id} className="border-b border-[#2A2E39] hover:bg-[#1E222D] transition-colors font-mono text-sm">
                  <td className="p-4 pl-6 text-[#D1D4DC]">{trade.date}</td>
                  <td className="p-4 font-bold text-[#D1D4DC]">{trade.pair}</td>
                  <td className="p-4"><span className="text-xs font-sans text-[#787B86]">{trade.setup}</span></td>
                  <td className="p-4 text-[#D1D4DC]">
                    <div className="flex items-center gap-1">${trade.entry} <span className="text-[#787B86]">→</span> ${trade.exit}</div>
                  </td>
                  <td className={`p-4 font-bold ${trade.pl >= 0 ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
                      {trade.pl >= 0 ? '+' : ''}${trade.pl}
                  </td>
                  <td className="p-4 text-[#D1D4DC]">{trade.rr}</td>
                  <td className="p-4 border-r border-[#2B2B43]">
                    {trade.rulesViolated.length === 0 ? (
                      <span className="bg-[#26A69A]/10 text-[#26A69A] px-2 py-1 rounded text-xs font-sans border border-[#26A69A]/20">100% OK</span>
                    ) : (
                      <div className="flex gap-1 items-center group relative cursor-help">
                        <span className="bg-[#EF5350]/10 text-[#EF5350] px-2 py-1 rounded text-xs font-sans border border-[#EF5350]/20">{trade.rulesViolated.length} Warn</span>
                        <div className="hidden group-hover:block absolute left-0 top-full mt-2 bg-[#131722] border border-[#EF5350]/50 p-3 rounded-lg shadow-2xl z-50 w-48 font-sans">
                          {trade.rulesViolated.map((r, i) => <span key={i} className="text-[#EF5350] block text-xs mb-1">• {r}</span>)}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleEditClick(trade)} className="text-[#787B86] hover:text-[#2962FF] p-2 transition-colors focus:outline-none" title="Edit Position">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => deleteTrade(trade.id)} className="text-[#787B86] hover:text-[#EF5350] p-2 transition-colors ml-1 focus:outline-none" title="Close Position">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
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
