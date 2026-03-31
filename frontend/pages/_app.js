import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Toaster position="top-right" />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}
