import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import QuizCard from '../../components/cards/QuizCard';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { apiFetch } from '../../services/api';
import { FaGraduationCap } from 'react-icons/fa';

export default function QuizHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiFetch('/quizzes/history');
        setHistory(data);
      } catch (error) {
        console.error("Failed to load quiz history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Quiz History</h1>
          <p className="text-gray-600 font-medium">Review your past quizzes and see your progress.</p>
        </div>
        <Link href="/quiz/generate">
          <Button className="rounded-xl shadow-md px-6 py-3 font-semibold hover:shadow-lg transition-all items-center flex gap-2">
            <FaGraduationCap /> Generate New Quiz
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map(quiz => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-16 text-center rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center mt-8">
          <div className="text-7xl mb-6 opacity-30 drop-shadow-sm">📝</div>
          <p className="text-2xl font-bold text-gray-800 mb-3">No quizzes taken yet</p>
          <p className="text-gray-500 max-w-sm mb-8">Test your knowledge by generating a quick quiz on any topic you want to learn.</p>
          <Link href="/quiz/generate">
            <Button className="px-8 py-4 text-lg rounded-2xl shadow-lg shadow-blue-500/30 font-bold hover:-translate-y-1 transition-transform">
              Create your first quiz ✨
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

QuizHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}
