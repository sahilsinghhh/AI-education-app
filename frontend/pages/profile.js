import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { apiFetch } from '../services/api';
import toast from 'react-hot-toast';
import { FaUserCircle } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch('/users/profile');
        setUser({ name: data.name, email: data.email });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = { ...user };
      if (password) payload.password = password;
      
      const data = await apiFetch('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      // Update local storage user if needed
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Profile updated successfully');
      setPassword('');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in mt-6">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-7xl mb-5 shadow-inner border-4 border-white drop-shadow-md">
          <FaUserCircle />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{user.name}</h1>
        <p className="text-gray-500 font-medium mt-1">Student Account</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Account Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Full Name" 
            value={user.name} 
            onChange={(e) => setUser({ ...user, name: e.target.value })} 
            required 
            className="[&>label]:font-semibold [&>input]:bg-gray-50 focus:[&>input]:bg-white [&>input]:rounded-xl"
          />
          <Input 
            label="Email Address" 
            type="email" 
            value={user.email} 
            onChange={(e) => setUser({ ...user, email: e.target.value })} 
            required 
            className="[&>label]:font-semibold [&>input]:bg-gray-50 focus:[&>input]:bg-white [&>input]:rounded-xl"
          />
          
          <div className="pt-4 border-t border-gray-100 mt-6">
            <h3 className="text-md font-bold text-gray-700 mb-4">Change Password</h3>
            <Input 
              label="New Password (leave blank to keep current)" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="[&>label]:font-medium text-sm [&>input]:bg-gray-50 focus:[&>input]:bg-white xl [&>input]:rounded-xl"
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full py-4 text-lg font-bold shadow-md hover:shadow-lg rounded-xl mt-6 bg-blue-600 hover:bg-blue-700 transition-all active:scale-95">
            {saving ? 'Saving Changes...' : 'Save Profile Details'}
          </Button>
        </form>
      </div>
    </div>
  );
}

Profile.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}
