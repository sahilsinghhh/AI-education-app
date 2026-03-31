import Link from 'next/link';
import { useRouter } from 'next/router';
import { logout } from '../../services/authService';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        <Link href="/dashboard" className="text-2xl font-extrabold tracking-tight text-blue-600 flex items-center gap-2">
          StudyBuddy <span className="text-gray-800 font-black">AI</span>
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <Link href="/profile" className="text-gray-500 hover:text-blue-600 transition-colors">
          <FaUserCircle size={28} />
        </Link>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors" title="Logout">
          <FaSignOutAlt size={24} />
        </button>
      </div>
    </nav>
  );
}
