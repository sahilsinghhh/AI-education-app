import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  const inner = (
    <>
      <Toaster position="top-right" />
      {getLayout(<Component {...pageProps} />)}
    </>
  );

  if (!googleClientId) {
    return inner;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {inner}
    </GoogleOAuthProvider>
  );
}
