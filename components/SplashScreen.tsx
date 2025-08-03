// components/SplashScreen.tsx
import { useEffect } from 'react';
import Image from 'next/image';
import flameLogo from '../public/cedrium-flame-logo.png';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // Splash 2.5s

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
      <Image
        src={flameLogo}
        alt="Cedrium Flame Logo"
        width={180} // Büyütüldü
        height={180}
        className="animate-pulse drop-shadow-xl"
      />
      <h1 className="mt-4 text-3xl font-bold">Cedrium Wallet</h1>
    </div>
  );
}
