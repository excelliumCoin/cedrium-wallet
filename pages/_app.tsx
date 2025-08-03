import '../styles/globals.css'; 
import type { AppProps } from 'next/app';
import { WalletProvider } from '../context/WalletContext';


export default function Index({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}