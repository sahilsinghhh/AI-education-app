import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import SubjectCard from '../../components/cards/SubjectCard';
import Spinner from '../../components/common/Spinner';
import { apiFetch } from '../../services/api';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await apiFetch('/subjects');
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Subjects</h1>
          <p className="text-gray-600">Choose a subject to explore topics or launch a quiz.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {subjects.map(subject => (
            <SubjectCard key={subject._id} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
          <p className="text-xl font-medium mb-2">No subjects available yet.</p>
          <p>Contact administrator to add data or run the seed script.</p>
        </div>
      )}
    </div>
  );
}

Subjects.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}
