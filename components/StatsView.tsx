import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Tree, TreeStatus, Tag } from '../types';
import { Target, Clock, Sprout, TrendingUp, Pencil, Check, X } from 'lucide-react';

interface StatsViewProps {
  trees: Tree[];
  tags: Tag[];
  onUpdateTag: (tag: Tag) => void;
}

const StatsView: React.FC<StatsViewProps> = ({ trees, tags, onUpdateTag }) => {
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editGoalValue, setEditGoalValue] = useState<number>(4);

  const aliveTrees = trees.filter(t => t.status === TreeStatus.ALIVE);

  // 1. Distribution by Tag
  const dataByTag = tags.map(tag => {
    const treesForTag = aliveTrees.filter(t => t.tagId === tag.id);
    const totalMinutes = treesForTag.reduce((acc, t) => acc + t.durationMinutes, 0);
    return {
      name: tag.name,
      value: totalMinutes,
      color: tag.color
    };
  }).filter(d => d.value > 0);

  // 2. Activity by Day (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const dataByDay = last7Days.map(dateStr => {
    const dayStart = new Date(dateStr).setHours(0,0,0,0);
    const dayEnd = new Date(dateStr).setHours(23,59,59,999);
    
    const minutes = aliveTrees
      .filter(t => t.createdAt >= dayStart && t.createdAt <= dayEnd)
      .reduce((acc, t) => acc + t.durationMinutes, 0);

    return {
      name: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: minutes
    };
  });

  // 3. Project Goals Logic
  const todayStart = new Date().setHours(0,0,0,0);
  const treesToday = aliveTrees.filter(t => t.createdAt >= todayStart);

  const startEditing = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditGoalValue(tag.dailyGoal || 4);
  };

  const saveGoal = (tag: Tag) => {
    if (editGoalValue > 0) {
        onUpdateTag({ ...tag, dailyGoal: editGoalValue });
    }
    setEditingTagId(null);
  };

  return (
    <div className="h-full w-full max-w-6xl mx-auto p-6 md:p-8 overflow-y-auto pb-20">
      <h2 className="text-3xl font-extrabold text-slate-100 mb-8 tracking-tight">Statistics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700 shadow-sm hover:border-slate-600 transition-all group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Total Focus</p>
            <Clock size={16} className="text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 shadow-emerald-400/20 drop-shadow-sm">
             {(aliveTrees.reduce((acc, t) => acc + t.durationMinutes, 0) / 60).toFixed(1)}<span className="text-lg text-slate-500 ml-1">h</span>
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700 shadow-sm hover:border-slate-600 transition-all group">
           <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Top Project</p>
            <Target size={16} className="text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
           </div>
           <p className="text-2xl font-bold text-blue-400 truncate" style={{ color: dataByTag.sort((a,b) => b.value - a.value)[0]?.color }}>
             {dataByTag.sort((a,b) => b.value - a.value)[0]?.name || '—'}
           </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700 shadow-sm hover:border-slate-600 transition-all group">
           <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Trees Grown</p>
              <Sprout size={16} className="text-slate-200 opacity-50 group-hover:opacity-100 transition-opacity" />
           </div>
           <p className="text-3xl font-bold text-slate-100">{aliveTrees.length}</p>
        </div>
         <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700 shadow-sm hover:border-slate-600 transition-all group">
           <div className="flex justify-between items-start mb-2">
             <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Success Rate</p>
             <TrendingUp size={16} className="text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" />
           </div>
           <p className="text-3xl font-bold text-slate-100">
             {trees.length > 0 
               ? Math.round((aliveTrees.length / trees.length) * 100) 
               : 0}<span className="text-lg text-slate-500">%</span>
           </p>
        </div>
      </div>

      {/* Detailed Project Stats */}
      <div className="mb-8">
         <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Target size={20} className="text-emerald-400" /> Project Goals & Insights
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map(tag => {
               const totalMinutes = aliveTrees.filter(t => t.tagId === tag.id).reduce((acc, t) => acc + t.durationMinutes, 0);
               const totalTrees = aliveTrees.filter(t => t.tagId === tag.id).length;
               
               // Daily Goal Calculation
               const sessionsToday = treesToday.filter(t => t.tagId === tag.id).length;
               const goal = tag.dailyGoal || 4;
               const percent = Math.min(100, (sessionsToday / goal) * 100);

               return (
                  <div key={tag.id} className="bg-slate-900/60 backdrop-blur-sm p-5 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                     
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: tag.color }} />
                              <h4 className="text-lg font-black text-white">{tag.name}</h4>
                           </div>
                        </div>
                     </div>

                     {/* Daily Goal Progress */}
                     <div className="mb-4">
                        <div className="flex justify-between items-end text-xs mb-2 font-bold h-6">
                           <span className="text-slate-400 uppercase tracking-wider">Today's Goal</span>
                           {editingTagId === tag.id ? (
                             <div className="flex items-center gap-2 animate-pop-in">
                                <input 
                                  type="number" 
                                  min="1" 
                                  max="50"
                                  value={editGoalValue}
                                  onChange={(e) => setEditGoalValue(parseInt(e.target.value) || 1)}
                                  className="w-12 bg-slate-800 border border-emerald-500 rounded px-1 py-0.5 text-white text-center focus:outline-none"
                                  autoFocus
                                />
                                <button onClick={() => saveGoal(tag)} className="p-1 bg-emerald-500 rounded hover:bg-emerald-400 text-slate-900 shadow-md shadow-emerald-500/20"><Check size={12} strokeWidth={3}/></button>
                                <button onClick={() => setEditingTagId(null)} className="p-1 bg-slate-700 rounded hover:bg-slate-600 text-slate-300"><X size={12} strokeWidth={3}/></button>
                             </div>
                           ) : (
                             <div className="flex items-center gap-2">
                                <span className={percent >= 100 ? "text-emerald-400" : "text-slate-300"}>
                                   {sessionsToday} <span className="text-slate-500">/</span> {goal}
                                </span>
                                <button 
                                  onClick={() => startEditing(tag)}
                                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                  title="Edit Goal"
                                >
                                   <Pencil size={12} strokeWidth={2.5} />
                                </button>
                             </div>
                           )}
                        </div>
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative">
                           <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out relative z-10"
                              style={{ width: `${percent}%`, backgroundColor: tag.color }}
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full animate-shimmer" />
                           </div>
                           {/* Markers for 25%, 50%, 75% */}
                           <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-20">
                              <div className="w-[1px] h-full bg-slate-900/50 translate-x-0" />
                              <div className="w-[1px] h-full bg-slate-900/50 translate-x-0" />
                              <div className="w-[1px] h-full bg-slate-900/50 translate-x-0" />
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-800/50 rounded-xl p-2 flex items-center gap-2">
                           <Clock size={14} className="text-slate-500" />
                           <span className="font-bold text-slate-300">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-2 flex items-center gap-2">
                           <Sprout size={14} className="text-slate-500" />
                           <span className="font-bold text-slate-300">{totalTrees} Trees</span>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-slate-800">
          <h3 className="text-lg font-bold text-slate-200 mb-6">Focus Distribution</h3>
          <div className="h-72">
            {dataByTag.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataByTag}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {dataByTag.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} min`, 'Time']}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', color: '#f1f5f9', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#94a3b8', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-sm font-medium bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-800">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Area Chart (Trend) */}
        <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-slate-800">
          <h3 className="text-lg font-bold text-slate-200 mb-6">Focus Trend (Last 7 Days)</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis hide={true} />
                  <Tooltip
                    cursor={{ stroke: '#334155', strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', color: '#f1f5f9', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                    formatter={(value: number) => [`${value} min`, 'Focused']}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMinutes)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                  />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;