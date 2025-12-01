import React from 'react';
import { PulseData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ExternalLink, MessageSquare, Zap, Minus } from 'lucide-react';

interface PulseDashboardProps {
  data: PulseData;
}

const COLORS = ['#ef4444', '#a855f7', '#06b6d4']; // Red (Side A), Purple (Neutral), Cyan (Side B)

const PulseDashboard: React.FC<PulseDashboardProps> = ({ data }) => {
  
  // Normalize data for the chart
  const chartData = [
    { name: data.sideA.name, value: data.sideA.percentage, color: '#ef4444' }, // Red-ish
    { name: 'Neutral/Undecided', value: data.neutral.percentage, color: '#94a3b8' }, // Slate
    { name: data.sideB.name, value: data.sideB.percentage, color: '#06b6d4' }, // Cyan
  ];

  return (
    <div className="w-full animate-fade-in pb-12">
      
      {/* Top Summary */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 mb-8 text-center border-t-4 border-t-purple-500">
        <h2 className="text-3xl font-bold text-white mb-2">{data.topic}</h2>
        <p className="text-slate-300 max-w-3xl mx-auto">{data.summary}</p>
      </div>

      {/* Main Stats Viz */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Side A Card */}
        <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-red-500 flex flex-col h-full relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
             <Zap className="w-24 h-24 text-red-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-red-400 font-bold uppercase tracking-wider text-sm mb-1">Perspective A</h3>
            <h4 className="text-2xl font-bold text-white mb-4">{data.sideA.name}</h4>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-4xl font-bold text-white">{data.sideA.percentage}%</span>
              <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                {data.sideA.emotion}
              </span>
            </div>
            <ul className="space-y-3">
              {data.sideA.arguments.map((arg, idx) => (
                <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                  <MessageSquare className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                  <span>{arg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Chart */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-slate-400 font-medium mb-4">Population Distribution</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full mt-4 space-y-2">
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-300"><div className="w-3 h-3 rounded-full bg-red-500"></div> {data.sideA.name}</span>
                <span className="font-bold text-white">{data.sideA.percentage}%</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-300"><div className="w-3 h-3 rounded-full bg-slate-400"></div> Neutral</span>
                <span className="font-bold text-white">{data.neutral.percentage}%</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-300"><div className="w-3 h-3 rounded-full bg-cyan-500"></div> {data.sideB.name}</span>
                <span className="font-bold text-white">{data.sideB.percentage}%</span>
             </div>
          </div>

          <div className="mt-6 p-3 bg-slate-800/50 rounded-lg w-full text-center">
             <p className="text-xs text-slate-400 italic">"{data.neutral.summary}"</p>
          </div>
        </div>

        {/* Side B Card */}
        <div className="glass-panel rounded-2xl p-6 border-r-4 border-r-cyan-500 flex flex-col h-full relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
             <Zap className="w-24 h-24 text-cyan-500" />
          </div>
          <div className="relative z-10 text-right">
            <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm mb-1">Perspective B</h3>
            <h4 className="text-2xl font-bold text-white mb-4">{data.sideB.name}</h4>
            <div className="flex items-center justify-end gap-2 mb-6">
              <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {data.sideB.emotion}
              </span>
              <span className="text-4xl font-bold text-white">{data.sideB.percentage}%</span>
            </div>
            <ul className="space-y-3">
              {data.sideB.arguments.map((arg, idx) => (
                <li key={idx} className="flex gap-3 text-slate-300 text-sm flex-row-reverse text-right">
                  <MessageSquare className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-1" />
                  <span>{arg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sources Section */}
      {data.sources.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12">
           <h3 className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-4 text-center">Pulse Signals Detected From</h3>
           <div className="flex flex-wrap justify-center gap-3">
              {data.sources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 px-4 py-2 rounded-full text-sm transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate max-w-[200px]">{source.title || 'Unknown Source'}</span>
                </a>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default PulseDashboard;
