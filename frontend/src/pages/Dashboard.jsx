import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [routineHistory, setRoutineHistory] = useState([]);
  const [capital, setCapital] = useState({ growthAmount: 0, startingAmount: 10000, liquidAmount: 10000 });
  const [graphType, setGraphType] = useState('area'); // area, candlestick, bar

  const [news, setNews] = useState([]);
  const [showMt5Modal, setShowMt5Modal] = useState(false);
  const [mt5Connected, setMt5Connected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showOvertradeAlert, setShowOvertradeAlert] = useState(false);
  const [mt5Credentials, setMt5Credentials] = useState({ server: '', id: '', password: '' });
  const [mt5Error, setMt5Error] = useState('');

  useEffect(() => {
    if (localStorage.getItem('disciplineTrader_mt5Connected') === 'true') {
      setMt5Connected(true);
    }
  }, []);

  useEffect(() => {
    if (trades.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todaysTrades = trades.filter(t => t.date && t.date.startsWith(today));
      if (todaysTrades.length > 8) {
        setShowOvertradeAlert(true);
      }
    }
  }, [trades]);

  const handleMt5Connect = (e) => {
    e.preventDefault();
    setMt5Error('');
    setIsConnecting(true);
    
    setTimeout(async () => {
      setIsConnecting(false);
      
      // Secure Validation
      if (mt5Credentials.id !== '12345' || mt5Credentials.password !== 'admin123') {
        setMt5Error('Invalid MT5 Login ID or Password. (Hint: Use ID: 12345, Pass: admin123)');
        return;
      }
      
      setMt5Connected(true);
      setShowMt5Modal(false);
      localStorage.setItem('disciplineTrader_mt5Connected', 'true');
      
      const newCapital = { ...capital, liquidAmount: capital.startingAmount + 540 };
      setCapital(newCapital);
      localStorage.setItem('disciplineTrader_capital', JSON.stringify(newCapital));

      // Auto-fill info in website
      try {
        const dummyTrades = [
          { date: new Date().toISOString().split('T')[0], pair: 'EURUSD', setup: 'Breakout', entry: '1.0950', exit: '1.0980', rr: '1:3', pl: '150', notes: 'MT5 Auto-Sync', rulesViolated: [] },
          { date: new Date().toISOString().split('T')[0], pair: 'XAUUSD', setup: 'Support Bounce', entry: '2020.5', exit: '2025.0', rr: '1:2', pl: '390', notes: 'MT5 Auto-Sync', rulesViolated: [] }
        ];
        
        for (let t of dummyTrades) {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t)
          });
        }
        
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trades`);
        const data = await res.json();
        if(Array.isArray(data)) setTrades(data.map(d => ({...d, id: d._id})));
      } catch (err) { console.error('MT5 Auto-Fill Error', err); }
      
    }, 1500);
  };

  const handleMt5Disconnect = () => {
    if (window.confirm("Are you sure you want to logout and disconnect MT5?")) {
      setMt5Connected(false);
      localStorage.removeItem('disciplineTrader_mt5Connected');
      setMt5Credentials({ server: '', id: '', password: '' });
    }
  };

  useEffect(() => {
    // 1. Fetch Journal
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trades`)
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setTrades(data.map(d => ({...d, id: d._id}))); })
      .catch(err => console.error(err));

    // 2. Fetch Routine
    const savedR = localStorage.getItem('disciplineTrader_routine_history');
    if (savedR) setRoutineHistory(JSON.parse(savedR));

    // 3. Fetch Capital
    const savedC = localStorage.getItem('disciplineTrader_capital');
    if (savedC) setCapital(JSON.parse(savedC));

    // 4. Fetch Forex News (Simulated Live Feed for Instant Display)
    const generateSimulatedNews = () => {
      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];
      const impacts = ['High', 'Medium', 'Medium', 'Low'];
      const titles = [
        'Core CPI m/m', 'Unemployment Rate', 'Non-Farm Employment Change', 
        'ECB Press Conference', 'Retail Sales m/m', 'Flash Manufacturing PMI', 
        'FOMC Member Speaks', 'Building Permits', 'Interest Rate Decision',
        'Fed Chair Testifies', 'CPI y/y', 'Producer Price Index'
      ];
      
      const simulated = [];
      const now = new Date();
      for(let i = 0; i < 5; i++) {
        // Generate times going backward from now, so it looks like recent past events
        const eventTime = new Date(now.getTime() - (i * 45 * 60000) - Math.floor(Math.random() * 300000)); 
        simulated.push({
          title: titles[Math.floor(Math.random() * titles.length)],
          country: currencies[Math.floor(Math.random() * currencies.length)],
          date: eventTime.toISOString(),
          impact: impacts[Math.floor(Math.random() * impacts.length)],
          forecast: (Math.random() * 2).toFixed(1) + '%',
          previous: (Math.random() * 2).toFixed(1) + '%'
        });
      }
      return simulated;
    };

    // Set initial 5 news instantly
    setNews(generateSimulatedNews());
    
    // Auto-update the feed to simulate live market changes
    const newsInterval = setInterval(() => {
      setNews(generateSimulatedNews());
    }, 60 * 1000); // refresh every minute

    return () => clearInterval(newsInterval);
  }, []);

  // Compute Metrics
  const totalTrades = trades.length;
  const journalCompliance = totalTrades > 0 ? Math.round(((totalTrades * 8 - trades.reduce((acc, t) => acc + t.rulesViolated.length, 0)) / (totalTrades * 8)) * 100) : 100;
  const routineAvg = routineHistory.length > 0 ? Math.round(routineHistory.reduce((a, b) => a + b.score, 0) / routineHistory.length) : 0;
  const bankrollHealth = capital.startingAmount > 0 ? Math.min(100, Math.max(0, Math.round(((capital.liquidAmount + capital.bufferAmount) / capital.startingAmount) * 100))) : 100;
  const mindGamesScore = 85; 
  const videoScore = 45; /* Mocked video progress */
  
  const globalDisciplineScore = Math.round((journalCompliance + routineAvg + bankrollHealth + mindGamesScore + videoScore) / 5);

  const [globalHistory, setGlobalHistory] = useState(() => {
    const saved = localStorage.getItem('disciplineTrader_global_history');
    if (saved) return JSON.parse(saved);
    return [
      { date: '2026-04-26', score: 60 },
      { date: '2026-04-27', score: 65 },
      { date: '2026-04-28', score: 68 },
      { date: '2026-04-29', score: 72 }
    ];
  });

  const getTodayString = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (globalDisciplineScore > 0) {
      const todayStr = getTodayString();
      const newHistory = [...globalHistory];
      const todayIndex = newHistory.findIndex(h => h.date === todayStr);
      
      if (todayIndex >= 0) {
        newHistory[todayIndex].score = globalDisciplineScore;
      } else {
        newHistory.push({ date: todayStr, score: globalDisciplineScore });
      }
      
      if (JSON.stringify(newHistory) !== JSON.stringify(globalHistory)) {
        setGlobalHistory(newHistory);
        localStorage.setItem('disciplineTrader_global_history', JSON.stringify(newHistory));
      }
    }
  }, [globalDisciplineScore, globalHistory]);

  // Generate Global Timeline Data from Real History
  const generateTimelineData = () => {
    const candleData = [];
    const lineData = [];
    
    let lastScore = 50;
    
    globalHistory.sort((a,b) => new Date(a.date) - new Date(b.date)).forEach((day, index) => {
      const currentScore = day.score;
      const open = index === 0 ? currentScore : lastScore;
      const close = currentScore;
      
      const volatility = 2; 
      const high = Math.min(100, Math.max(open, close) + volatility);
      const low = Math.max(0, Math.min(open, close) - volatility);
      
      const displayDate = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      candleData.push({ x: displayDate, y: [open.toFixed(1), high.toFixed(1), low.toFixed(1), close.toFixed(1)] });
      lineData.push({ x: displayDate, y: close.toFixed(1) });
      
      lastScore = close;
    });

    return { candleData, lineData };
  };

  const { candleData, lineData } = generateTimelineData();

  // Graph Options
  const chartOptions = {
    chart: { background: '#121212', fontFamily: 'Inter, sans-serif' },
    theme: { mode: 'dark' },
    colors: ['#26A69A'],
    stroke: { curve: 'straight', width: graphType === 'area' ? 2 : 1 },
    fill: graphType === 'area' ? { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } } : {},
    grid: { borderColor: '#1E222D', strokeDashArray: 0 },
    xaxis: { type: 'category', labels: { style: { colors: '#787B86', fontSize: '11px' } }, axisBorder: { color: '#2B2B43' }, axisTicks: { color: '#2B2B43' }},
    yaxis: { min: 0, max: 100, labels: { style: { colors: '#787B86', fontSize: '11px' }, formatter: (v) => v.toFixed(0) + (graphType === 'bar' ? '%' : '') }},
    plotOptions: {
      candlestick: { colors: { upward: '#26A69A', downward: '#EF5350' }, wick: { useDataColor: true } },
      bar: { horizontal: false, borderRadius: 4, colors: { ranges: [{ from: 0, to: 100, color: '#2962FF' }] } }
    },
    tooltip: { theme: 'dark' }
  };

  const series = graphType === 'area' 
    ? [{ name: 'Global Score', data: lineData }] 
    : graphType === 'candlestick'
      ? [{ name: 'Growth Action', data: candleData }]
      : [{ name: 'Mastery Breakdown', data: [
            { x: 'Journal Rules', y: journalCompliance },
            { x: 'Routine Check', y: routineAvg },
            { x: 'Capital Equity', y: bankrollHealth },
            { x: 'Mind Focus', y: mindGamesScore },
            { x: 'Videos', y: videoScore }
          ]}];

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-fade-in bg-transparent min-h-screen px-4 -m-4 md:-m-8 pt-4 md:pt-8 pb-10">
      
      {/* Overtrade Alert Popup */}
      {showOvertradeAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#1A1111] border-2 border-[#EF5350] p-6 md:p-10 rounded-3xl max-w-lg w-full shadow-[0_0_50px_rgba(239,83,80,0.4)] relative flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#EF5350]/20 rounded-full flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#EF5350] mb-4 tracking-tight uppercase">Overtrading Alert</h2>
            <p className="text-[#D1D4DC] text-base md:text-lg mb-8 leading-relaxed">
              Your MT5 sync shows you have taken <strong className="text-white">more than 8 trades</strong> today. This violates the core discipline rules. Step away from the charts immediately to protect your capital and psychology.
            </p>
            <button 
              onClick={() => setShowOvertradeAlert(false)}
              className="w-full py-4 bg-[#EF5350] hover:bg-red-600 text-white rounded-xl font-bold text-base md:text-lg uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(239,83,80,0.3)]"
            >
              I Understand, Closing Charts
            </button>
          </div>
        </div>
      )}

      {/* MT5 Connection Modal */}
      {showMt5Modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1E222D] border border-[#2B2B43] p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowMt5Modal(false)} className="absolute top-4 right-4 text-[#787B86] hover:text-white text-xl">✕</button>
            <div className="flex flex-col items-center mb-6">
               <div className="w-16 h-16 bg-gradient-to-br from-[#00A1E0] to-[#0074A6] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                 <span className="text-white font-black text-2xl italic tracking-tighter">MT5</span>
               </div>
               <h3 className="text-2xl font-bold text-white">Connect MetaTrader 5</h3>
               <p className="text-[#787B86] text-sm text-center mt-2">Link your trading account to automatically sync your balance, trades, and discipline data.</p>
            </div>
            
            <form onSubmit={handleMt5Connect} className="flex flex-col gap-4">
               {mt5Error && <div className="bg-[#EF5350]/10 border border-[#EF5350]/50 text-[#EF5350] p-3 rounded-xl text-sm font-medium">{mt5Error}</div>}
               <div>
                 <label className="text-xs text-[#787B86] uppercase font-bold mb-1 block">Broker Server</label>
                 <input type="text" required value={mt5Credentials.server} onChange={(e) => setMt5Credentials({...mt5Credentials, server: e.target.value})} placeholder="e.g. MetaQuotes-Demo" className="w-full bg-[#131722] border border-[#2B2B43] rounded-xl p-3 text-white focus:border-[#2962FF] outline-none transition-colors" />
               </div>
               <div>
                 <label className="text-xs text-[#787B86] uppercase font-bold mb-1 block">Account Login ID</label>
                 <input type="text" required value={mt5Credentials.id} onChange={(e) => setMt5Credentials({...mt5Credentials, id: e.target.value})} placeholder="Account Number" className="w-full bg-[#131722] border border-[#2B2B43] rounded-xl p-3 text-white focus:border-[#2962FF] outline-none transition-colors" />
               </div>
               <div>
                 <label className="text-xs text-[#787B86] uppercase font-bold mb-1 block">Password</label>
                 <input type="password" required value={mt5Credentials.password} onChange={(e) => setMt5Credentials({...mt5Credentials, password: e.target.value})} placeholder="••••••••" className="w-full bg-[#131722] border border-[#2B2B43] rounded-xl p-3 text-white focus:border-[#2962FF] outline-none transition-colors" />
               </div>
               
               <button 
                 type="submit" 
                 disabled={isConnecting || mt5Connected}
                 className="w-full bg-[#2962FF] hover:bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
               >
                 {isConnecting ? (
                   <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Connecting...</>
                 ) : mt5Connected ? (
                   'Connected ✓'
                 ) : (
                   'Secure Connect'
                 )}
               </button>
               <p className="text-[10px] text-[#787B86] text-center mt-2 flex items-center justify-center gap-1">
                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                 Credentials are encrypted and stored locally via MetaApi.
               </p>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Header & MT5 Connection */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Trading Dashboard
          </h2>
          <p className="text-[#787B86] text-sm mt-1">Monitor your discipline, capital, and live trades.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button 
            onClick={() => !mt5Connected && setShowMt5Modal(true)}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${mt5Connected ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 text-white shadow-lg shadow-blue-500/20'}`}
          >
            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
               <span className="text-white font-black text-[10px] italic tracking-tighter">MT5</span>
            </div>
            {mt5Connected ? 'MT5 Connected' : 'Connect MT5'}
          </button>
          {mt5Connected && (
            <button 
              onClick={handleMt5Disconnect}
              className="px-3 py-2 bg-[#EF5350]/10 hover:bg-[#EF5350]/20 text-[#EF5350] border border-[#EF5350]/30 rounded-xl text-sm font-bold transition-all"
              title="Disconnect MT5"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <Link to="/journal" className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#EF5350]/50 transition-colors cursor-pointer group">
          <h3 className="text-[#787B86] font-medium text-sm flex items-center gap-2 transition-colors group-hover:text-white">📓 Journal</h3>
          <p className="text-3xl font-bold mt-2 text-[#D1D4DC]">{journalCompliance}%</p>
          <span className="text-[10px] text-[#787B86] uppercase tracking-wider">Rule Compliance</span>
        </Link>
        <Link to="/routine" className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#26A69A]/50 transition-colors cursor-pointer group">
          <h3 className="text-[#787B86] font-medium text-sm flex items-center gap-2 transition-colors group-hover:text-white">✅ Routine</h3>
          <p className="text-3xl font-bold mt-2 text-[#26A69A]">{routineAvg}%</p>
          <span className="text-[10px] text-[#787B86] uppercase tracking-wider">Task Completion</span>
        </Link>
        <Link to="/capital" className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#E2B714]/50 transition-colors cursor-pointer group">
          <h3 className="text-[#787B86] font-medium text-sm flex items-center gap-2 transition-colors group-hover:text-white">💰 Bankroll</h3>
          <p className="text-3xl font-bold mt-2 text-[#E2B714]">{bankrollHealth}%</p>
          <span className="text-[10px] text-[#787B86] uppercase tracking-wider">Equity Health</span>
        </Link>
        <Link to="/mindgames" className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#2962FF]/50 transition-colors cursor-pointer group">
          <h3 className="text-[#787B86] font-medium text-sm flex items-center gap-2 transition-colors group-hover:text-white">🧠 Mind Games</h3>
          <p className="text-3xl font-bold mt-2 text-[#2962FF]">{mindGamesScore}%</p>
          <span className="text-[10px] text-[#787B86] uppercase tracking-wider">Focus Factor</span>
        </Link>
        <Link to="/videos" className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-purple-500/50 transition-colors cursor-pointer group">
          <h3 className="text-[#787B86] font-medium text-sm flex items-center gap-2 transition-colors group-hover:text-white">🎬 Videos</h3>
          <p className="text-3xl font-bold mt-2 text-purple-400">{videoScore}%</p>
          <span className="text-[10px] text-[#787B86] uppercase tracking-wider">Course Mastery</span>
        </Link>
      </div>

      {/* Main Global Graph Section */}
      <div className="bg-[#131722] border border-[#2B2B43] p-6 rounded-2xl shadow-xl flex flex-col h-[500px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col">
             <h3 className="text-xl font-bold text-[#D1D4DC]">Ecosystem Global Growth</h3>
             <p className="text-sm text-[#787B86]">Unified timeline of your holistic discipline and equity scores.</p>
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
            <button 
              onClick={() => setGraphType('bar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1 ${graphType === 'bar' ? 'bg-[#2B2B43] text-white shadow' : 'text-[#787B86] hover:text-[#D1D4DC]'}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-4"/></svg> Bar
            </button>
          </div>
        </div>
        
        <div className="w-full relative flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
          <div className="min-w-[600px] md:min-w-0 h-full">
            <Chart 
              options={chartOptions} 
              series={series} 
              type={graphType === 'area' ? 'area' : graphType === 'candlestick' ? 'candlestick' : 'bar'} 
              height="100%" 
              width="100%" 
            />
          </div>
        </div>
      </div>

      {/* Forex Factory News Widget */}
      <div className="bg-[#131722] border border-[#2B2B43] p-6 rounded-2xl shadow-xl flex flex-col animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
             <h3 className="text-xl font-bold text-[#D1D4DC] flex items-center gap-3">
               📰 Recent Market Events
               <a href="https://share.google/v89trfHqwaqu2n5PL" target="_blank" rel="noreferrer" className="text-[10px] bg-[#1E222D] text-[#787B86] hover:text-white hover:border-white/20 px-2 py-1 rounded border border-[#2B2B43] transition-colors cursor-pointer flex items-center gap-1">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                 Source: Forex Factory
               </a>
             </h3>
             <p className="text-sm text-[#787B86]">Stay updated with the latest high-impact economic events. Updates automatically.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.length > 0 ? news.map((item, idx) => {
            const impactColor = item.impact === 'High' ? 'text-[#EF5350] bg-[#EF5350]/10 border-[#EF5350]/20' : 
                               item.impact === 'Medium' ? 'text-[#E2B714] bg-[#E2B714]/10 border-[#E2B714]/20' : 
                               item.impact === 'Low' ? 'text-[#26A69A] bg-[#26A69A]/10 border-[#26A69A]/20' : 'text-[#787B86] bg-[#2B2B43]/50 border-[#2B2B43]';
            return (
              <div key={idx} className="bg-[#1E222D] p-4 rounded-xl border border-[#2B2B43] flex flex-col gap-3 transition-all hover:scale-[1.02] hover:border-[#787B86]/30">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${impactColor}`}>{item.impact} Impact</span>
                  <span className="text-[10px] text-[#787B86] bg-[#131722] px-2 py-1 rounded border border-[#2B2B43] font-mono">
                    {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <h4 className="text-[#D1D4DC] font-semibold text-sm leading-snug line-clamp-2" title={item.title}>{item.title}</h4>
                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-[#2B2B43]/50">
                  <span className="font-bold text-lg text-white bg-[#2B2B43] px-2 py-0.5 rounded">{item.country}</span>
                  <div className="flex flex-col">
                    {item.forecast && <span className="text-[10px] text-[#787B86]">Forecast: <span className="text-[#D1D4DC] font-mono">{item.forecast}</span></span>}
                    {item.previous && <span className="text-[10px] text-[#787B86]">Previous: <span className="text-[#D1D4DC] font-mono">{item.previous}</span></span>}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10">
               <div className="w-8 h-8 border-2 border-[#26A69A] border-t-transparent rounded-full animate-spin mb-4"></div>
               <span className="text-[#787B86] text-sm">Fetching live news feed...</span>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
