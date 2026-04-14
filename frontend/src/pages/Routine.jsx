import React, { useState } from 'react';

export default function Routine() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Study (1 hr)', category: 'Learning', done: false },
    { id: 2, name: 'Gym/Exercise', category: 'Fitness', done: false },
    { id: 3, name: 'Diet Plan Followed', category: 'Health', done: false },
    { id: 4, name: '8 Hours Sleep & Fixed Timing', category: 'Health', done: false },
    { id: 5, name: 'Daily Learning (1% Growth)', category: 'Learning', done: false },
    { id: 6, name: 'Mind Games (15-20 min)', category: 'Mindset', done: false },
    { id: 7, name: 'Meditation (10-15 min)', category: 'Mindset', done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const progress = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Daily Routine Tracker</h2>
        <p className="text-gray-400 mt-2">Build the habits that build your edge.</p>
      </div>

      <div className="bg-darkCard p-6 rounded-2xl border border-[#333] shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Daily Progress</span>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-[#1a1a1a] rounded-full h-4 mb-6 border border-[#333]">
          <div className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => toggleTask(task.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${task.done ? 'bg-primary/10 border-primary/30' : 'bg-[#1a1a1a] border-[#333] hover:border-gray-500'}`}
            >
              <div className={`w-6 h-6 rounded border flex items-center justify-center ${task.done ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                {task.done && <span className="text-white text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${task.done ? 'text-white line-through opacity-70' : 'text-gray-200'}`}>{task.name}</h4>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{task.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
