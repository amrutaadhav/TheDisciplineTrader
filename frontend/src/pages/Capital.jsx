import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Capital() {
  const { user } = useAuth();
  const userId = user?._id || user?.email || 'default';

  const defaultCapital = {
    startingAmount: 10000,
    liquidAmount: 8500,
    bufferAmount: 1500,
    withdrawAmount: 500,
    growthAmount: 500
  };

  const [capital, setCapital] = useState(defaultCapital);
  const [formData, setFormData] = useState(defaultCapital);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/capital/${userId}`)
      .then(r => r.json())
      .then(data => {
        const { startingAmount, liquidAmount, bufferAmount, withdrawAmount, growthAmount } = data;
        const loaded = { startingAmount, liquidAmount, bufferAmount, withdrawAmount, growthAmount };
        setCapital(loaded);
        setFormData(loaded);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) || 0 });
  };

  const saveChanges = async () => {
    await fetch(`${API}/capital/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setCapital(formData);
    setIsEditing(false);
  };

  const chartOptions = {
    chart: { background: '#121212', fontFamily: 'Inter, sans-serif' },
    theme: { mode: 'dark' },
    labels: ['Liquid Funds', 'Buffer Vault', 'Withdrawn', 'Growth'],
    colors: ['#2962FF', '#26A69A', '#EF5350', '#E2B714'],
    stroke: { colors: ['#131722'], width: 2 },
    dataLabels: { enabled: true, style: { fontSize: '14px' } },
    legend: { position: 'bottom', labels: { colors: '#D1D4DC' } },
    tooltip: { theme: 'dark', y: { formatter: (val) => '$' + val.toLocaleString() } }
  };

  const series = [
    capital.liquidAmount || 0,
    capital.bufferAmount || 0,
    capital.withdrawAmount || 0,
    capital.growthAmount > 0 ? capital.growthAmount : 0
  ];

  if (loading) return <div className="flex items-center justify-center h-48 text-[#787B86]">Loading Bankroll...</div>;

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto pb-10 bg-transparent min-h-screen px-4 -m-8 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#2B2B43] pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-[#26A69A] leading-tight">Bankroll & Capital Planner</h2>
          <p className="text-[#787B86] mt-1">Manage your liquidity, buffers, and growth targets safely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="bg-[#131722] border border-[#2B2B43] rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="border-b border-[#2B2B43] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1E222D]/50">
            <h3 className="text-xl font-bold text-[#D1D4DC]">Treasury Metrics</h3>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="text-[#2962FF] hover:text-white px-4 py-1.5 rounded-lg border border-[#2962FF]/30 transition-all font-medium text-sm">Update Funds</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setFormData(capital); setIsEditing(false); }} className="text-[#EF5350] hover:text-white px-3 py-1.5 rounded-lg border border-[#EF5350]/30 transition-all text-sm font-medium">Cancel</button>
                <button onClick={saveChanges} className="bg-[#2962FF] text-white px-4 py-1.5 rounded-lg shadow-md transition-all text-sm font-medium">Save Ledger</button>
              </div>
            )}
          </div>

          <div className="p-6 flex-1 flex flex-col gap-5">
            {[
              { label: 'Starting Amount', key: 'startingAmount', desc: 'Initial deposit capital.', color: 'text-white' },
              { label: 'Liquid Amount', key: 'liquidAmount', desc: 'Deployable trading ammo.', color: 'text-[#2962FF]' },
              { label: 'Buffer Amount', key: 'bufferAmount', desc: 'Vaulted safety net.', color: 'text-[#26A69A]' },
              { label: 'Withdraw Amount', key: 'withdrawAmount', desc: 'Cold hard cash pulled out.', color: 'text-[#EF5350]' },
              { label: 'Growth Amount', key: 'growthAmount', desc: 'Net gains over baseline.', color: 'text-[#E2B714]' },
            ].map((field) => (
              <div key={field.key} className="flex items-center justify-between group">
                <div>
                  <h4 className="font-semibold text-[#D1D4DC]">{field.label}</h4>
                  <p className="text-xs text-[#787B86]">{field.desc}</p>
                </div>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#787B86]">$</span>
                    <input type="number" name={field.key} value={formData[field.key]} onChange={handleChange}
                      className="bg-[#1E222D] p-2 pl-7 rounded-lg border border-[#2B2B43] focus:border-[#2962FF] text-white focus:outline-none transition-colors w-32 text-right font-mono"/>
                  </div>
                ) : (
                  <span className={`text-xl font-bold font-mono tracking-tight ${field.color}`}>
                    ${(capital[field.key] || 0).toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="bg-[#1E222D]/30 p-4 border-t border-[#2B2B43] flex items-center justify-between">
            <span className="text-sm font-medium text-[#787B86]">Total Equity Check</span>
            <span className="font-mono text-lg text-white font-black bg-[#2B2B43]/50 px-3 py-1 rounded">
              ${((capital.liquidAmount || 0) + (capital.bufferAmount || 0)).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-[#131722] border border-[#2B2B43] rounded-2xl shadow-xl flex flex-col p-6">
          <h3 className="text-xl font-bold text-[#D1D4DC] mb-2">Capital Allocation</h3>
          <p className="text-[#787B86] text-sm mb-8">Visual distribution of your active and vaulted funds.</p>
          <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar flex items-center justify-center">
            <div className="min-w-[350px] md:min-w-0">
              {series.every(val => val === 0) ? (
                <p className="text-[#787B86] italic">No capital allocated to visualize.</p>
              ) : (
                <Chart options={chartOptions} series={series} type="donut" width="100%" height="350" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
