import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import Layout from '../components/layout/Layout';
import StatCard from '../components/cards/StatCard';
import { FaBookOpen, FaGamepad, FaRobot } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Spinner from '../components/common/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!stats) return <div className="text-center py-20 text-gray-500">Failed to load data.</div>;

  const chartData = (stats.progressBySubject || []).map(p => ({
    name: p.subject?.name || 'Unknown',
    score: p.averageScore || 0
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Quizzes Taken" value={stats.summary.totalQuizzes || 0} icon={<FaGamepad size={28} />} textColor="text-green-600" />
        <StatCard title="Average Score" value={`${stats.summary.averageScore || 0}%`} icon={<FaBookOpen size={28} />} textColor="text-blue-600" />
        <StatCard title="AI Chat Sessions" value={stats.summary.totalChats || 0} icon={<FaRobot size={28} />} textColor="text-purple-600" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Subject Progress</h2>
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">No progress data to show yet. Take a quiz to see your stats here!</p>
        )}
      </div>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}
