import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('disciplineTrader_journal');
    if (saved) {
      setTrades(JSON.parse(saved));
    } else {
      setTrades([
        { id: 1, date: '14 Apr, 10:30 AM', pair: 'EUR/USD', setup: 'Breakout', rr: '1:4.5', pl: 120, rulesViolated: [] },
        { id: 2, date: '13 Apr, 2:15 PM', pair: 'BTC/USD', setup: 'Support', rr: '1:3', pl: -50, rulesViolated: ['Wait for setup', 'No FOMO after missed entry'] }
      ]);
    }
  }, []);

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => Number(t.pl) > 0).length;
  const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;
  
  const totalPL = trades.reduce((acc, t) => acc + Number(t.pl), 0);
  
  const totalPossibleRules = trades.length * 8;
  const totalViolatedRules = trades.reduce((acc, t) => acc + t.rulesViolated.length, 0);
  const disciplineScore = totalTrades > 0 ? Math.round(((totalPossibleRules - totalViolatedRules) / totalPossibleRules) * 100) : 100;

  // Chart data calculations
  const calculateCumulativePL = () => {
    let cumulative = 10000;
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
    return [10000, ...sortedTrades.map(t => {
      cumulative += Number(t.pl);
      return cumulative;
    })];
  };

  const chartData = {
    labels: ['Start', ...[...trades].sort((a, b) => new Date(a.date) - new Date(b.date)).map(t => t.date.split(',')[0])],
    datasets: [{
      label: 'Capital Growth ($)',
      data: calculateCumulativePL(),
      borderColor: '#26A69A',
      backgroundColor: 'rgba(38, 166, 154, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#131722',
      pointBorderColor: '#26A69A',
      pointRadius: 4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: { 
      x: { grid: { color: '#2B2B43' }, ticks: { color: '#787B86' } }, 
      y: { grid: { color: '#2B2B43' }, ticks: { color: '#787B86' } } 
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in bg-[#0E0E0E] min-h-screen px-4 -m-8 pt-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#2962FF]/50 transition-colors">
          <h3 className="text-[#787B86] font-medium text-sm">Total Executions</h3>
          <p className="text-3xl font-bold mt-2 text-[#D1D4DC]">{totalTrades}</p>
        </div>
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#26A69A]/50 transition-colors">
          <h3 className="text-[#787B86] font-medium text-sm">Win Rate</h3>
          <p className={`text-3xl font-bold mt-2 ${winRate >= 50 ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>{winRate}%</p>
        </div>
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#2962FF]/50 transition-colors">
          <h3 className="text-[#787B86] font-medium text-sm">Net Profit / Loss</h3>
          <p className={`text-3xl font-bold mt-2 ${totalPL >= 0 ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
            {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </p>
        </div>
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg hover:border-[#E2B714]/50 transition-colors">
          <h3 className="text-[#787B86] font-medium text-sm">Discipline Score</h3>
          <p className={`text-3xl font-bold mt-2 ${disciplineScore >= 80 ? 'text-[#E2B714]' : 'text-[#EF5350]'}`}>{disciplineScore}/100</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#D1D4DC]">Capital Growth Curve</h3>
            <span className="text-xs bg-[#1E222D] text-[#787B86] px-2 py-1 rounded">All Time</span>
          </div>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#2B2B43] shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#D1D4DC]">Recent Executions</h3>
            <Link to="/journal" className="text-sm text-[#2962FF] hover:underline">View All</Link>
          </div>
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-72">
            {trades.slice(0, 5).map((trade) => (
              <div key={trade.id} className="flex justify-between items-center p-4 bg-[#1E222D] rounded-xl border border-[#2B2B43] hover:border-[#2962FF]/50 transition-colors">
                <div>
                  <h4 className="font-mono font-bold text-[#D1D4DC]">{trade.pair}</h4>
                  <p className="text-xs text-[#787B86] mt-1">{trade.date}</p>
                </div>
                <div className="text-right">
                  <div className={`font-mono font-bold ${Number(trade.pl) >= 0 ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>
                    {Number(trade.pl) >= 0 ? '+' : ''}${trade.pl}
                  </div>
                  <div className="text-xs text-[#787B86] mt-1">{trade.rulesViolated.length === 0 ? 'Compliant' : 'Violated'}</div>
                </div>
              </div>
            ))}
            {trades.length === 0 && <p className="text-[#787B86] text-center mt-10">No trades yet. Go to Journal to start logging.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
