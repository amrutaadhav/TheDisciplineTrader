import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const StreakContext = createContext(null);
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// Badge definitions
const BADGES = [
  { id: 'ignition',  streak: 7,   icon: '⚡', name: 'Ignition',    desc: '7-day streak — You are getting started!',         color: 'from-blue-500 to-cyan-400' },
  { id: 'warrior',   streak: 14,  icon: '⚔️', name: 'Warrior',     desc: '14-day streak — Two weeks of pure discipline.',    color: 'from-orange-400 to-amber-500' },
  { id: 'champion',  streak: 30,  icon: '🏆', name: 'Champion',    desc: '30-day streak — A full month of mastery!',         color: 'from-yellow-400 to-amber-300' },
  { id: 'titan',     streak: 60,  icon: '💎', name: 'Titan',       desc: '60-day streak — Diamond hands, iron discipline.',  color: 'from-cyan-400 to-blue-600' },
  { id: 'legend',    streak: 90,  icon: '👑', name: 'Legend',      desc: '90-day streak — 3 months. You are a LEGEND.',      color: 'from-yellow-400 to-orange-500' },
  { id: 'immortal',  streak: 180, icon: '🌟', name: 'Immortal',    desc: '180-day streak — Half a year. Truly immortal.',    color: 'from-purple-500 to-pink-500' },
  { id: 'godmode',   streak: 365, icon: '🔱', name: 'God Mode',    desc: '365-day streak — Full year. You are unstoppable.', color: 'from-emerald-400 to-teal-600' },
];

export function StreakProvider({ children }) {
  const { user } = useAuth();
  const userId = user?._id || user?.email || 'default';

  const [streakData, setStreakData] = useState({
    currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalActiveDays: 0, earnedBadges: [], history: []
  });

  useEffect(() => {
    if (!userId) return;
    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    fetch(`${API}/streak/${userId}`)
      .then(r => r.json())
      .then(prev => {
        const alreadyLoggedToday = (prev.history || []).includes(today);
        let updated = { ...prev };

        if (!alreadyLoggedToday) {
          let newStreak = 1;
          if (prev.lastActiveDate === yesterday) newStreak = (prev.currentStreak || 0) + 1;
          const newHistory = [...(prev.history || []), today];
          const newLongest = Math.max(prev.longestStreak || 0, newStreak);
          const newBadges = BADGES.filter(b => newStreak >= b.streak).map(b => b.id);
          updated = { ...prev, currentStreak: newStreak, longestStreak: newLongest, lastActiveDate: today, totalActiveDays: (prev.totalActiveDays || 0) + 1, earnedBadges: newBadges, history: newHistory };

          fetch(`${API}/streak/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
          }).catch(() => {});
        }

        setStreakData(updated);
      })
      .catch(() => {});
  }, [userId]);

  const persistStreak = (updated) => {
    setStreakData(updated);
    localStorage.setItem('disciplineTrader_streak', JSON.stringify(updated));
  };

  return (
    <StreakContext.Provider value={{ streakData, persistStreak, BADGES }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  return useContext(StreakContext);
}
