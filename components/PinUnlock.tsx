// components/PinUnlock.tsx
import { useState } from 'react';
import Logo from './Logo';

export default function PinUnlock({ onSuccess }: { onSuccess: () => void }) {
  const [inputPin, setInputPin] = useState('');

  const handleUnlock = () => {
    const savedPin = localStorage.getItem('cedrium_pin');
    if (inputPin === savedPin) {
      onSuccess();
    } else {
      alert('Incorrect PIN');
    }
  };

  return (
<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white p-6">
  <Logo />
  <h2 className="text-xl font-bold mb-4">Enter Your 6-digit PIN</h2>
      <input
        type="password"
        maxLength={6}
        value={inputPin}
        onChange={(e) => setInputPin(e.target.value)}
        className="w-full max-w-xs p-2 border border-gray-300 text-black rounded mb-4"
      />
      <button
        onClick={handleUnlock}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Unlock
      </button>
    </div>
  );
}
