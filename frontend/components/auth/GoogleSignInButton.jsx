import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { loginWithGoogle } from '../../services/authService';

export default function GoogleSignInButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <GoogleLogin
        text="continue_with"
        shape="pill"
        size="large"
        width="100%"
        locale="en"
        onSuccess={async (credentialResponse) => {
          const credential = credentialResponse.credential;
          if (!credential) {
            toast.error('No credential from Google');
            return;
          }
          setBusy(true);
          try {
            await loginWithGoogle(credential);
            toast.success('Signed in with Google');
            router.push('/dashboard');
          } catch (err) {
            toast.error(err.message || 'Google sign-in failed');
          } finally {
            setBusy(false);
          }
        }}
        onError={() => toast.error('Google sign-in was cancelled or failed')}
      />
      {busy && <p className="text-sm text-gray-500">Signing in...</p>}
    </div>
  );
}
