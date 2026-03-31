import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ProtectedRoute from '../common/ProtectedRoute';

export default function Layout({ children, requireAuth = true }) {
  const content = (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );

  if (requireAuth) {
    return <ProtectedRoute>{content}</ProtectedRoute>;
  }

  return content;
}
