import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { apiFetch } from '../../services/api';
import toast from 'react-hot-toast';
import { FaGraduationCap } from 'react-icons/fa';

export default function GenerateQuiz() {
  const router = useRouter();
  const { subject: subjectIdParam, topic: topicParam } = router.query;
  
  const [topic, setTopic] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (topicParam) setTopic(decodeURIComponent(topicParam));
    if (subjectIdParam) setSubjectId(subjectIdParam);
    
    // Fetch subjects for dropdown
    apiFetch('/subjects').then(setSubjects).catch(console.error);
  }, [topicParam, subjectIdParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch('/quizzes/generate', {
        method: 'POST',
        body: JSON.stringify({ topic, subjectId: subjectId || undefined })
      });
      toast.success('Quiz generated successfully!');
      router.push(`/quiz/${data._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to generate quiz. Try a simpler topic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner border border-blue-100">
            <FaGraduationCap />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Generate a Quiz</h1>
          <p className="text-gray-500 text-lg max-w-sm leading-relaxed">Enter any topic and our AI will create a quick multiple-choice quiz to test your knowledge.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject (Optional)</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white text-gray-800 transition-all font-medium"
            >
              <option value="">-- Let AI choose or general topic --</option>
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="What do you want to be tested on?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, Fractions, World War II..."
            required
            className="mb-0 [&>label]:font-semibold [&>input]:py-4 [&>input]:rounded-2xl [&>input]:bg-gray-50 focus:[&>input]:bg-white"
          />

          <Button type="submit" className="w-full py-4 text-xl font-bold mt-6 shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-2xl" disabled={loading}>
            {loading ? <span className="flex items-center justify-center gap-3"><Spinner size="sm" /> <span>Consulting AI...</span></span> : 'Generate Quiz ✨'}
          </Button>
        </form>
      </div>
    </div>
  );
}

GenerateQuiz.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}
