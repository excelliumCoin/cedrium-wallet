// components/Logo.tsx
import Image from 'next/image';
import flameLogo from '../public/cedrium-flame-logo.png';

export default function Logo() {
  return (
    <div className="flex justify-center mb-6">
      <Image
        src={flameLogo}
        alt="Cedrium Logo"
        width={150}
        height={150}
        priority
        className="animate-pulse"
      />
    </div>
  );
}
