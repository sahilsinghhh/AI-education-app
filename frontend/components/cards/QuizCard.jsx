import Link from 'next/link';

export default function QuizCard({ quiz }) {
  const percentage = Math.round((quiz.score / quiz.total) * 100) || 0;
  
  let colorClass = "text-green-600 bg-green-50 border-green-200";
  if (percentage < 50) colorClass = "text-red-600 bg-red-50 border-red-200";
  else if (percentage < 80) colorClass = "text-yellow-600 bg-yellow-50 border-yellow-200";

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{quiz.topic}</h3>
          <p className="text-sm text-gray-500 font-medium">{quiz.subject?.name || 'General Knowledge'}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-sm font-bold border ${colorClass} shadow-sm`}>
          {percentage}%
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          {quiz.score} / {quiz.total} correct
        </span>
        <Link href={`/quiz/${quiz._id}`} className="text-blue-600 font-bold text-sm hover:text-white transition-colors hover:bg-blue-600 bg-blue-50 px-4 py-2.5 rounded-xl">
          Review Quiz
        </Link>
      </div>
    </div>
  );
}
