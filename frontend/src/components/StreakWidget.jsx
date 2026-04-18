import React, { useState } from 'react';
import { useStreak } from '../context/StreakContext';

export default function StreakWidget() {
  const { streakData, BADGES } = useStreak();
  const [showPopup, setShowPopup] = useState(false);

  const { currentStreak, longestStreak, totalActiveDays, earnedBadges } = streakData;

  // Find the highest badge earned
  const topBadge = [...BADGES].reverse().find(b => earnedBadges.includes(b.id));

  // Next upcoming badge
  const nextBadge = BADGES.find(b => !earnedBadges.includes(b.id));
  const daysToNext = nextBadge ? nextBadge.streak - currentStreak : null;

  // Monthly milestone computation (every 30 days)
  const monthlyBadges = Math.floor(currentStreak / 30);

  return (
    <div className="relative">
      {/* Streak Trigger Button */}
      <button
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
        onClick={() => setShowPopup(!showPopup)}
        className="flex items-center gap-2 bg-[#1E222D] border border-[#2B2B43] rounded-full px-3 py-1.5 hover:border-orange-400/60 transition-all cursor-pointer group hover:bg-[#2B2B43]"
      >
        <span className="text-lg leading-none group-hover:scale-110 transition-transform">🔥</span>
        <span className="text-sm font-bold text-orange-400 font-mono">{currentStreak}</span>
        {topBadge && (
          <span className="text-base leading-none" title={topBadge.name}>{topBadge.icon}</span>
        )}
      </button>

      {/* Popup Panel */}
      {showPopup && (
        <>
          {/* Mobile Overlay */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setShowPopup(false)} />
          
          <div
            className="fixed md:absolute right-4 md:right-0 top-20 md:top-12 left-4 md:left-auto w-auto md:w-80 bg-[#131722] border border-[#2B2B43] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200"
            onMouseEnter={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/10 border-b border-[#2B2B43] p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  🔥 Streak Progress
                </h3>
                <p className="text-xs text-[#787B86] mt-0.5">Daily discipline tracking</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-orange-400 font-mono leading-none">{currentStreak}</div>
                <div className="text-[10px] text-[#787B86] uppercase tracking-wider">days</div>
              </div>
            </div>

            {/* Progress to next badge */}
            {nextBadge && (
              <div>
                <div className="flex justify-between text-xs text-[#787B86] mb-1">
                  <span>Next: {nextBadge.icon} {nextBadge.name}</span>
                  <span>{daysToNext} days to go</span>
                </div>
                <div className="w-full bg-[#1E222D] rounded-full h-2 border border-[#2B2B43]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                    style={{ width: `${Math.min(100, ((nextBadge.streak - daysToNext) / nextBadge.streak) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 divide-x divide-[#2B2B43] border-b border-[#2B2B43]">
            <div className="p-4 text-center">
              <div className="text-xl font-black text-[#26A69A] font-mono">{currentStreak}</div>
              <div className="text-[10px] text-[#787B86] uppercase tracking-wider mt-1">Current</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xl font-black text-[#2962FF] font-mono">{longestStreak}</div>
              <div className="text-[10px] text-[#787B86] uppercase tracking-wider mt-1">Best</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xl font-black text-[#E2B714] font-mono">{totalActiveDays}</div>
              <div className="text-[10px] text-[#787B86] uppercase tracking-wider mt-1">Total Days</div>
            </div>
          </div>

          {/* Monthly Milestone Badges */}
          {monthlyBadges > 0 && (
            <div className="p-4 border-b border-[#2B2B43]">
              <h4 className="text-xs text-[#787B86] uppercase font-bold tracking-wider mb-3">Monthly Milestones</h4>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: monthlyBadges }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-lg">
                      🗓️
                    </div>
                    <span className="text-[10px] text-[#787B86]">Month {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Badges Section */}
          <div className="p-4">
            <h4 className="text-xs text-[#787B86] uppercase font-bold tracking-wider mb-3">Achievement Badges</h4>
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
              {BADGES.map((badge) => {
                const earned = earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${earned ? 'bg-[#1E222D] border-[#2B2B43]' : 'border-[#1E222D] opacity-40'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${earned ? `bg-gradient-to-br ${badge.color} shadow-lg` : 'bg-[#2B2B43]'}`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold text-sm ${earned ? 'text-white' : 'text-[#787B86]'}`}>{badge.name}</span>
                        <span className="text-[10px] text-[#787B86] font-mono shrink-0">{badge.streak}d</span>
                      </div>
                      <p className="text-xs text-[#787B86] mt-0.5 leading-tight truncate">{badge.desc}</p>
                    </div>
                    {earned && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#26A69A" strokeWidth="3" className="shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    )}
    </div>
  );
}
