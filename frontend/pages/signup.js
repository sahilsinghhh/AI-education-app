import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { register } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-10 border border-white/40">
          <div className="text-center mb-8">
            <Link href="/">
              <h2 className="text-4xl font-extrabold text-blue-600 cursor-pointer mb-2">StudyBuddy AI</h2>
            </Link>
            <h3 className="text-2xl font-bold text-blue-900 mb-2">Get started free</h3>
            <p className="text-gray-600">Join thousands of students learning smarter</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input 
              label="Full Name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="John Doe"
            />
            <Input 
              label="Email address" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
            <Input 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
            
            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="agree" 
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 cursor-pointer mt-1" 
                required 
              />
              <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
                I agree to the <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Privacy Policy</a>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 tracking-wide text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">Or sign up with</span>
                </div>
              </div>
              <div className="mt-4 w-full [&>div]:w-full [&_iframe]:!w-full">
                <GoogleSignInButton />
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
