// components/LoginView.tsx
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import Logo from './Logo';

export default function LoginView() {
  const { createWallet, importWallet } = useWallet();
  const [privateKey, setPrivateKey] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'options' | 'createPin' | 'importPin'>('options');

  const handleCreateWallet = async () => {
    if (pin.length !== 6) {
      alert('PIN must be 6 digits');
      return;
    }

    localStorage.setItem('cedrium_pin', pin);
    await createWallet(); // sayfa yenilemeden cüzdan oluştur
    // Not: reload kaldırıldı, artık walletCreated tetiklenecek.
  };

  const handleImport = () => {
    if (pin.length !== 6 || privateKey.length === 0) {
      alert('PIN and private key are required');
      return;
    }

    try {
      importWallet(privateKey);
      localStorage.setItem('cedrium_pin', pin);
    } catch (e) {
      alert('Invalid Private Key');
    }
  };

  return (
<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white p-4">
  <Logo />
  <h1 className="text-3xl font-bold mb-6">Welcome to Cedrium Wallet</h1>

      {step === 'options' && (
        <>
          <button
            onClick={() => setStep('createPin')}
            className="mb-4 px-6 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Create New Wallet
          </button>
          <button
            onClick={() => setStep('importPin')}
            className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Import Wallet with Private Key
          </button>
        </>
      )}

      {step === 'createPin' && (
        <div className="w-full max-w-xs space-y-4">
          <input
            type="password"
            maxLength={6}
            placeholder="Set a 6-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-2 border border-gray-300 text-black rounded"
          />
          <button
            disabled={pin.length !== 6}
            onClick={handleCreateWallet}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Confirm & Create Wallet
          </button>
        </div>
      )}

      {step === 'importPin' && (
        <div className="w-full max-w-xs space-y-4">
          <input
            type="text"
            placeholder="Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="w-full p-2 border border-gray-300 text-black rounded"
          />
          <input
            type="password"
            maxLength={6}
            placeholder="Set a 6-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-2 border border-gray-300 text-black rounded"
          />
          <button
            disabled={pin.length !== 6 || privateKey.length === 0}
            onClick={handleImport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Confirm & Import Wallet
          </button>
        </div>
      )}
    </div>
  );
}
