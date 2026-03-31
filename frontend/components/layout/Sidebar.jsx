import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaTachometerAlt, FaBookOpen, FaRobot, FaTrophy } from 'react-icons/fa';

export default function Sidebar() {
  const router = useRouter();
  
  const menuItems = [
    { label: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { label: 'Subjects', icon: <FaBookOpen />, path: '/subjects' },
    { label: 'AI Tutor', icon: <FaRobot />, path: '/chat' },
    { label: 'Quizzes', icon: <FaTrophy />, path: '/quiz/history' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-68px)] flex flex-col hidden md:flex shadow-sm z-40">
      <div className="p-4 flex-1">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = router.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link href={item.path} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'}`}>
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
