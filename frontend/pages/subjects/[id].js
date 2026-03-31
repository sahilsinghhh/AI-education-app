import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { apiFetch } from '../../services/api';
import { FaPlay, FaRobot } from 'react-icons/fa';

export default function SubjectDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchSubject = async () => {
      try {
        const data = await apiFetch(`/subjects/${id}`);
        setSubject(data);
      } catch (error) {
        console.error("Failed to fetch subject", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!subject) return <div className="text-center py-20 text-gray-500">Subject not found.</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-inner">
            📘
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">{subject.name}</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl leading-relaxed">{subject.description}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/quiz/generate?subject=${subject._id}`}>
                <Button className="flex items-center gap-2 px-6 py-3 font-semibold shadow-md hover:shadow-lg">
                  <FaPlay /> Generate Quiz
                </Button>
              </Link>
              <Link href={`/chat?subject=${subject.name}`}>
                <Button variant="outline" className="flex items-center gap-2 px-6 py-3 font-semibold border-2 border-blue-200 hover:border-blue-600 bg-blue-50">
                  <FaRobot /> Ask AI Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Topics</h2>
        {subject.topics && subject.topics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {subject.topics.map((topic, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-blue-50 focus:bg-blue-100 hover:border-blue-200 transition-all cursor-pointer group flex justify-between items-center shadow-sm hover:shadow-md" 
                onClick={() => router.push(`/quiz/generate?subject=${subject._id}&topic=${encodeURIComponent(topic)}`)}
              >
                <span className="font-semibold text-gray-800 group-hover:text-blue-700">{topic}</span>
                <span className="text-blue-500 transform scale-0 group-hover:scale-100 transition-transform origin-right w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full">→</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">No specific topics defined.</p>
            <p className="text-gray-400 mt-2">You can still generate a quiz for the whole subject!</p>
          </div>
        )}
      </div>
    </div>
  );
}

SubjectDetails.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}
