import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [routineHistory, setRoutineHistory] = useState([]);
  const [capital, setCapital] = useState({ growthAmount: 0, startingAmount: 10000, liquidAmount: 10000 });
  const [graphType, setGraphType] = useState('area'); // area, candlestick, bar

  useEffect(() => {
    // 1. Fetch Journal
    fetch('http://localhost:5000/api/trades')
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setTrades(data.map(d => ({...d, id: d._id}))); })
      .catch(err => console.error(err));

    // 2. Fetch Routine
    const savedR = localStorage.getItem('disciplineTrader_routine_history');
    if (savedR) setRoutineHistory(JSON.parse(savedR));

    // 3. Fetch Capital
    const savedC = localStorage.getItem('disciplineTrader_capital');
    if (savedC) setCapital(JSON.parse(savedC));
  }, []);

  // Compute Metrics
  const totalTrades = trades.length;
  const journalCompliance = totalTrades > 0 ? Math.round(((totalTrades * 8 - trades.reduce((acc, t) => acc + t.rulesViolated.length, 0)) / (totalTrades * 8)) * 100) : 100;
  const routineAvg = routineHistory.length > 0 ? Math.round(routineHistory.reduce((a, b) => a + b.score, 0) / routineHistory.length) : 0;
  const bankrollHealth = capital.startingAmount > 0 ? Math.min(100, Math.max(0, Math.round(((capital.liquidAmount + capital.bufferAmount) / capital.startingAmount) * 100))) : 100;
  const mindGamesScore = 85; /* Mocked focus score */
  
  const globalDisciplineScore = Math.round((journalCompliance + routineAvg + bankrollHealth + mindGamesScore) / 4);

  // Generate Global Timeline Data
  const generateTimelineData = () => {
    const candleData = [];
    const lineData = [];
    
    // Simulate 7 days of global growth compounding all modules
    let baseScore = globalDisciplineScore > 10 ? globalDisciplineScore - 15 : 50; 
    const dates = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    
    dates.forEach((date, i) => {
      const open = i === 0 ? baseScore : lineData[i-1].y;
      const change = (Math.random() * 10) - (Math.random() * 4); // Slight upward bias
      const close = i === 6 ? globalDisciplineScore : Math.min(100, open + change);
      const high = Math.min(100, Math.max(open, close) + 3);
      const low = Math.max(0, Math.min(open, close) - 3);

      candleData.push({ x: date, y: [open.toFixed(1), high.toFixed(1), low.toFixed(1), close.toFixed(1)] });
      lineData.push({ x: date, y: close.toFixed(1) });
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
      bar: { horizontal: true, borderRadius: 4, colors: { ranges: [{ from: 0, to: 100, color: '#2962FF' }] } }
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
            { x: 'Mind Focus', y: mindGamesScore }
          ]}];

  return (
    <div className="flex flex-col gap-8 animate-fade-in bg-[#0E0E0E] min-h-screen px-4 -m-8 pt-8 pb-10">
      
      {/* Top Mastery Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#EF5350]/50 transition-colors">
          <h3 className="text-[#787B86] font-medium text-sm flex items-center gap-2">📓 Journal</h3>
          <p className="text-3xl font-bold mt-2 text-[#D1D4DC]">{journalCompliance}%</p>
          <span className="text-[10px] text-[#787B86] uppercase tracking-wider">Rule Compliance</span>
        </div>
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#26A69A]/50 transition-colors">
          <h3 className="text-[#787B86] font-medium text-sm flex items-center gap-2">✅ Routine</h3>
          <p className="text-3xl font-bold mt-2 text-[#26A69A]">{routineAvg}%</p>
          <span className="text-[10px] text-[#787B86] uppercase tracking-wider">Task Completion</span>
        </div>
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#E2B714]/50 transition-colors">
          <h3 className="text-[#787B86] font-medium text-sm flex items-center gap-2">💰 Bankroll</h3>
          <p className="text-3xl font-bold mt-2 text-[#E2B714]">{bankrollHealth}%</p>
          <span className="text-[10px] text-[#787B86] uppercase tracking-wider">Equity Health</span>
        </div>
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#2962FF]/50 transition-colors">
          <h3 className="text-[#787B86] font-medium text-sm flex items-center gap-2">🧠 Mind Games</h3>
          <p className="text-3xl font-bold mt-2 text-[#2962FF]">{mindGamesScore}%</p>
          <span className="text-[10px] text-[#787B86] uppercase tracking-wider">Focus Factor</span>
        </div>
      </div>

      {/* Main Global Graph Section */}
      <div className="bg-[#131722] border border-[#2B2B43] p-6 rounded-2xl shadow-xl flex flex-col h-[500px]">
        <div className="flex justify-between items-center mb-6">
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-4"/></svg> Horizontal
            </button>
          </div>
        </div>
        
        <div className="w-full relative flex-1">
          <Chart 
            options={chartOptions} 
            series={series} 
            type={graphType === 'area' ? 'area' : graphType === 'candlestick' ? 'candlestick' : 'bar'} 
            height="100%" 
            width="100%" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] flex items-center justify-between">
            <div>
               <h4 className="text-[#D1D4DC] font-bold">Global Discipline Rating</h4>
               <p className="text-xs text-[#787B86] mt-1">Average alignment across all modules.</p>
            </div>
            <div className="text-4xl font-black text-[#26A69A] font-mono">{globalDisciplineScore}%</div>
        </div>
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43]">
             <h4 className="text-[#D1D4DC] font-bold mb-4">Quick Actions</h4>
             <div className="flex gap-4">
                 <Link to="/journal" className="flex-1 bg-[#1E222D] hover:bg-[#2B2B43] text-[#D1D4DC] text-center p-3 rounded-lg text-sm transition-colors border border-[#2B2B43]">Log Trade</Link>
                 <Link to="/routine" className="flex-1 bg-[#1E222D] hover:bg-[#2B2B43] text-[#D1D4DC] text-center p-3 rounded-lg text-sm transition-colors border border-[#2B2B43]">Check Routine</Link>
             </div>
        </div>
      </div>

    </div>
  );
}
