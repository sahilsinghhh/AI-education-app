import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { apiFetch, uploadFile } from '../../services/api';
import toast from 'react-hot-toast';
import { FaGraduationCap, FaFileUpload } from 'react-icons/fa';

export default function GenerateQuiz() {
  const router = useRouter();
  const { subject: subjectIdParam, topic: topicParam } = router.query;
  
  const [mode, setMode] = useState('text'); // 'text' or 'file'
  const [topic, setTopic] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (topicParam) setTopic(decodeURIComponent(topicParam));
    if (subjectIdParam) setSubjectId(subjectIdParam);
    
    // Fetch subjects for dropdown
    apiFetch('/subjects').then(setSubjects).catch(console.error);
  }, [topicParam, subjectIdParam]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const allowedExtensions = ['.txt', '.pdf', '.docx'];
      
      const isValidType = allowedTypes.includes(file.type) || 
                          allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!isValidType) {
        toast.error('Please upload a TXT, PDF, or DOCX file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'text') {
      if (!topic.trim()) {
        toast.error('Please enter a topic');
        return;
      }
      await generateQuizFromTopic();
    } else {
      if (!uploadedFile) {
        toast.error('Please upload a file');
        return;
      }
      await generateQuizFromFile();
    }
  };

  const generateQuizFromTopic = async () => {
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

  const generateQuizFromFile = async () => {
    setLoading(true);
    try {
      const data = await uploadFile('/quizzes/generate-from-file', uploadedFile, {
        subjectId: subjectId || undefined
      });
      toast.success('Quiz generated successfully from file!');
      router.push(`/quiz/${data._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to generate quiz from file.');
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
          <p className="text-gray-500 text-lg max-w-sm leading-relaxed">Choose how you want to create your quiz: enter a topic or upload a file.</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              mode === 'text'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📝 Topic
          </button>
          <button
            onClick={() => setMode('file')}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              mode === 'file'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaFileUpload className="inline mr-2" />
            Upload File
          </button>
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

          {mode === 'text' ? (
            <Input
              label="What do you want to be tested on?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, Fractions, World War II..."
              required
              className="mb-0 [&>label]:font-semibold [&>input]:py-4 [&>input]:rounded-2xl [&>input]:bg-gray-50 focus:[&>input]:bg-white"
            />
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File (TXT, PDF, or DOCX)</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.docx"
                  className="w-full px-5 py-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700 cursor-pointer bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-green-600 text-2xl">✓</div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">{uploadedFile.name}</p>
                      <p className="text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full py-4 text-xl font-bold mt-6 shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-2xl" disabled={loading}>
            {loading ? <span className="flex items-center justify-center gap-3"><Spinner size="sm" /> <span>Generating...</span></span> : 'Generate Quiz ✨'}
          </Button>
        </form>
      </div>
    </div>
  );
}

GenerateQuiz.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}
