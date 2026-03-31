import Link from 'next/link';

export default function SubjectCard({ subject }) {
  return (
    <Link href={`/subjects/${subject._id}`} className="group block h-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all transform hover:-translate-y-1 h-full flex flex-col">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          📘
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
        <p className="text-gray-600 mb-6 line-clamp-2">{subject.description}</p>
        <div className="flex items-center text-blue-600 font-semibold mt-auto pt-4 border-t border-gray-50">
          Explore Topics <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
