import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

export default function Routine() {
  const [graphType, setGraphType] = useState('area'); // 'area' or 'candlestick'

  const initialTasks = [
    { id: 1, name: 'Wake up on time', category: 'Discipline', done: false },
    { id: 2, name: 'Gym & exercises time', category: 'Fitness', done: false },
    { id: 3, name: 'Diet plan follow', category: 'Health', done: false },
    { id: 4, name: 'Proper sleep', category: 'Recovery', done: false },
    { id: 5, name: 'Sleep time fix', category: 'Discipline', done: false },
    { id: 6, name: 'Daily new learning improve 1% new day, mind growth', category: 'Learning', done: false },
    { id: 7, name: 'Mind game 15 to 20 min daily', category: 'Mindset', done: false },
    { id: 8, name: 'Meditation 10-15 min minimum', category: 'Mindset', done: false },
  ];

  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Load state from local storage
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('disciplineTrader_routine_history');
    if (saved) return JSON.parse(saved);
    
    // Seed with dummy realistic history for the graph
    return [
      { date: '2026-04-10', score: 62 },
      { date: '2026-04-11', score: 75 },
      { date: '2026-04-12', score: 50 },
      { date: '2026-04-13', score: 87.5 }
    ];
  });

  const [todayTasks, setTodayTasks] = useState(() => {
    const savedToday = localStorage.getItem(`disciplineTrader_routine_${getTodayString()}`);
    if (savedToday) return JSON.parse(savedToday);
    return initialTasks;
  });

  useEffect(() => {
    localStorage.setItem(`disciplineTrader_routine_${getTodayString()}`, JSON.stringify(todayTasks));
    
    // Automatically recalculate today's score into history
    const score = Math.round((todayTasks.filter(t => t.done).length / todayTasks.length) * 100);
    const newHistory = [...history];
    const todayIndex = newHistory.findIndex(h => h.date === getTodayString());
    
    if (todayIndex >= 0) {
      newHistory[todayIndex].score = score;
    } else {
      newHistory.push({ date: getTodayString(), score });
    }
    
    setHistory(newHistory);
    localStorage.setItem('disciplineTrader_routine_history', JSON.stringify(newHistory));
  }, [todayTasks]);

  const toggleTask = (id) => {
    setTodayTasks(todayTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const progress = Math.round((todayTasks.filter(t => t.done).length / todayTasks.length) * 100);

  // Chart Data Generation
  const generateGraphData = () => {
    let lastScore = 0;
    
    const candleData = [];
    const lineData = [];

    history.sort((a,b) => new Date(a.date) - new Date(b.date)).forEach((day, index) => {
      const currentScore = day.score;
      const open = index === 0 ? currentScore : lastScore;
      const close = currentScore;
      
      const volatility = 5; 
      const high = Math.min(100, Math.max(open, close) + volatility);
      const low = Math.max(0, Math.min(open, close) - volatility);
      
      const displayDate = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      candleData.push({ x: displayDate, y: [open.toFixed(1), high.toFixed(1), low.toFixed(1), close.toFixed(1)] });
      lineData.push({ x: displayDate, y: close.toFixed(1) });
      
      lastScore = close;
    });

    return { candleData, lineData };
  };

  const { candleData, lineData } = generateGraphData();

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
      min: 0,
      max: 100,
      labels: { style: { colors: '#787B86', fontSize: '11px' }, formatter: (value) => value.toFixed(0) + '%' },
      crosshairs: { show: true }
    },
    grid: { borderColor: '#1E222D', strokeDashArray: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      candlestick: { colors: { upward: '#26A69A', downward: '#EF5350' }, wick: { useDataColor: true } }
    },
    tooltip: { 
      theme: 'dark',
      y: { formatter: (val) => val + '%' }
    }
  };

  const series = graphType === 'area' ? [{ name: 'Daily Compliance', data: lineData }] : [{ name: 'Compliance Action', data: candleData }];

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-7xl mx-auto pb-10 bg-[#0E0E0E] min-h-screen px-4 -m-8 pt-8">
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Today's Checklist */}
        <div className="lg:w-1/3">
          <div className="flex flex-col mb-6">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#2962FF] to-cyan-400">Daily Edge Routine</h2>
            <p className="text-[#787B86] mt-1">Checklist for supreme mental clarity.</p>
          </div>

          <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg sticky top-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-[#D1D4DC]">Today's Progress</span>
              <span className="font-mono font-bold text-[#2962FF]">{progress}%</span>
            </div>
            
            <div className="w-full bg-[#1E222D] rounded-full h-4 mb-6 border border-[#2B2B43] overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#2962FF] to-cyan-400 h-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex flex-col gap-3">
              {todayTasks.map((task, i) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${task.done ? 'bg-[#26A69A]/10 border-[#26A69A]/30' : 'bg-[#1E222D] border-[#2B2B43] hover:border-[#787B86]'}`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${task.done ? 'bg-[#26A69A] border-none' : 'border border-[#787B86] bg-transparent'}`}>
                    {task.done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm tracking-wide ${task.done ? 'text-[#787B86] line-through decoration-[#787B86]/50' : 'text-[#D1D4DC] font-medium'}`}>
                      {i + 1}. {task.name}
                    </h4>
                    <span className="text-[10px] text-[#787B86] uppercase tracking-wider mt-1 block">{task.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Graph Analytics */}
        <div className="lg:w-2/3">
          <div className="bg-[#131722] border border-[#2B2B43] p-6 rounded-2xl shadow-xl flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4 items-center">
                <h3 className="text-lg font-bold text-[#D1D4DC]">Consistency Chart</h3>
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
            
            <div className="w-full relative flex-1">
              <Chart 
                options={chartOptions} 
                series={series} 
                type={graphType === 'area' ? 'area' : 'candlestick'} 
                height="100%" 
                width="100%" 
              />
            </div>

            <div className="mt-6 pt-6 border-t border-[#2B2B43] grid grid-cols-2 gap-4">
               <div>
                  <h4 className="text-[#787B86] text-xs uppercase font-bold tracking-wider mb-1">Today's Score</h4>
                  <p className="text-3xl font-mono font-bold text-[#E2B714]">{progress}%</p>
               </div>
               <div>
                  <h4 className="text-[#787B86] text-xs uppercase font-bold tracking-wider mb-1">Weekly Average</h4>
                  <p className="text-3xl font-mono font-bold text-[#2962FF]">
                     {history.length > 0 ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length) : 0}%
                  </p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
