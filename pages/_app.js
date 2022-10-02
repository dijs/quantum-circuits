import { DataProvider } from '../components/DataContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  );
}

export default MyApp;
