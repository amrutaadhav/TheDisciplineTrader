import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Capital Growth',
      data: [10000, 10200, 10150, 10400, 10600],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      tension: 0.4,
      fill: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { color: '#333' } }, y: { grid: { color: '#333' } } }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-darkCard p-6 rounded-2xl border border-[#333] shadow-lg hover:border-primary/50 transition-colors">
          <h3 className="text-gray-400 font-medium text-sm">Total Trades</h3>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>
        <div className="bg-darkCard p-6 rounded-2xl border border-[#333] shadow-lg hover:border-secondary/50 transition-colors">
          <h3 className="text-gray-400 font-medium text-sm">Win Rate</h3>
          <p className="text-3xl font-bold mt-2 text-secondary">68%</p>
        </div>
        <div className="bg-darkCard p-6 rounded-2xl border border-[#333] shadow-lg hover:border-primary/50 transition-colors">
          <h3 className="text-gray-400 font-medium text-sm">Profit / Loss</h3>
          <p className="text-3xl font-bold mt-2 text-secondary">+$600.00</p>
        </div>
        <div className="bg-darkCard p-6 rounded-2xl border border-[#333] shadow-lg hover:border-yellow-500/50 transition-colors">
          <h3 className="text-gray-400 font-medium text-sm">Discipline Score</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-500">95/100</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 bg-darkCard p-6 rounded-2xl border border-[#333] shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-200">Capital Growth</h3>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-darkCard p-6 rounded-2xl border border-[#333] shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-200">Recent Trades</h3>
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center p-4 bg-[#252525] rounded-xl border border-[#333]">
                <div>
                  <h4 className="font-semibold text-gray-200">EUR/USD Setup {i}</h4>
                  <p className="text-xs text-gray-400 mt-1">Today, 10:30 AM</p>
                </div>
                <div className={`font-bold ${i === 2 ? 'text-red-500' : 'text-secondary'}`}>
                  {i === 2 ? '-$50.00' : '+$120.00'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
