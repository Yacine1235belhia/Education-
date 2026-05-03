import React from 'react';
import { Student } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, AlertCircle, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface ClassAnalysisProps {
  students: Student[];
  allStudents?: Student[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-1">
        <p className="font-black text-slate-800 text-sm">{label}</p>
        <p className="font-bold text-emerald-600 text-sm">
          المعدل: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-1">
        <p className="font-black text-slate-800 text-sm">{payload[0].name}</p>
        <p className="font-bold text-emerald-600 text-sm">
          العدد: {payload[0].value} ({Math.round(payload[0].payload.percent * 100)}%)
        </p>
      </div>
    );
  }
  return null;
};

export const ClassAnalysis: React.FC<ClassAnalysisProps> = ({ students, allStudents }) => {
  if (!students || students.length === 0) return null;

  const classComparisonData = React.useMemo(() => {
    if (!allStudents) return [];
    const classes = Array.from(new Set<string>(allStudents.map(s => (s.className as string) || 'غير مصنف')));
    if (classes.length <= 1) return []; 
    return classes.map(c => {
      const clsStudents = allStudents.filter(s => (s.className || 'غير مصنف') === c);
      const sum = clsStudents.reduce((acc, s) => acc + (s.overallAverage || 0), 0);
      return {
        name: c.length > 15 ? c.substring(0, 15) + '...' : c, // shorten names
        average: Number((sum / (clsStudents.length || 1)).toFixed(2))
      };
    }).sort((a,b) => b.average - a.average);
  }, [allStudents]);

  // Grade Distribution
  const excellent = students.filter(s => (s.overallAverage || 0) >= 15).length;
  const good = students.filter(s => (s.overallAverage || 0) >= 12 && (s.overallAverage || 0) < 15).length;
  const average = students.filter(s => (s.overallAverage || 0) >= 10 && (s.overallAverage || 0) < 12).length;
  const poor = students.filter(s => (s.overallAverage || 0) < 10).length;

  const distributionData = [
    { name: 'ممتاز (-15)', value: excellent, color: '#f59e0b' },
    { name: 'جيد (12-14)', value: good, color: '#34d399' },
    { name: 'متوسط (10-11)', value: average, color: '#60a5fa' },
    { name: 'ضعيف (<10)', value: poor, color: '#f87171' },
  ];

  const total = students.length;
  const distributionDataWithPercent = distributionData.map(d => ({ ...d, percent: d.value / total }));

  // Top 10 for bar chart or line chart of all if small
  const chartData = [...students]
    .sort((a, b) => (b.overallAverage || 0) - (a.overallAverage || 0))
    .slice(0, 30) // taking top 30 to not clutter
    .map(s => ({
      name: s.name.split(' ')[0], // only first name or short name
      average: s.overallAverage || 0,
      fullName: s.name
    }));

  const averages = students.map(s => s.overallAverage || 0);
  const classAvg = averages.reduce((a, b) => a + b, 0) / averages.length;
  const max = Math.max(...averages);
  const min = Math.min(...averages);
  
  // Variance
  const variance = averages.reduce((a, b) => a + Math.pow(b - classAvg, 2), 0) / averages.length;
  const stdDev = Math.sqrt(variance);

  return (
    <div className="space-y-8 mt-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">تحليل البيانات والفروقات</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 font-bold mb-2 uppercase tracking-wide text-xs">أعلى معدل</p>
          <p className="text-3xl font-black text-emerald-600 font-mono">{max.toFixed(2)}</p>
        </div>
        <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 font-bold mb-2 uppercase tracking-wide text-xs">أدنى معدل</p>
          <p className="text-3xl font-black text-rose-600 font-mono">{min.toFixed(2)}</p>
        </div>
         <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 font-bold mb-2 uppercase tracking-wide text-xs">الانحراف المعياري (التباين)</p>
          <p className="text-3xl font-black text-indigo-600 font-mono">{stdDev.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-2 font-bold">
            {stdDev < 2 ? 'مستوى القسم متقارب' : 'مستوى القسم متفاوت'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-[2rem] border border-slate-100">
          <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
            معدلات التلاميذ (ترتيب تنازلي)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} domain={[0, 20]} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="average" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-slate-100 flex flex-col">
          <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 block"></span>
            التوزيع والمستويات
          </h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionDataWithPercent}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionDataWithPercent.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {distributionData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-xs font-bold text-slate-600 truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {classComparisonData && classComparisonData.length > 0 && (
        <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-slate-100 mt-8">
          <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 block"></span>
            مقارنة معدلات الأقسام (الفروقات)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} domain={[0, 20]} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="average" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                  {classComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};
