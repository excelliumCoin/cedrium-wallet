import { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { QRCodeCanvas } from 'qrcode.react';
import SplashScreen from '../components/SplashScreen';
import LoginView from '../components/LoginView';
import PinUnlock from '../components/PinUnlock';
import Logo from '../components/Logo'; 

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const {
    account,
    addressHex,
    privateKeyHex,
    walletCreated,
    getBalance,
    transferTokens,
  } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transferResult, setTransferResult] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (walletCreated) {
      setShowPrivateKey(true);
      setTimeout(() => setShowPrivateKey(false), 15000);
    }
  }, [walletCreated]);

  const handleGetBalance = async () => {
    const b = await getBalance();
    setBalance(b);
  };

  const handleTransfer = async () => {
    const txHash = await transferTokens(recipient, Number(amount));
    setTransferResult(txHash);
    handleGetBalance();
  };

  if (!loaded) {
    return <SplashScreen onFinish={() => setLoaded(true)} />;
  }

  // ✅ Eğer cüzdan yoksa Login ekranına git
  if (!addressHex) {
    return <LoginView />;
  }

  // ✅ Cüzdan varsa ama PIN doğrulanmamışsa kilit ekranı
  const hasPin = typeof window !== 'undefined' && !!localStorage.getItem('cedrium_pin');
  if (hasPin && !authenticated) {
    return <PinUnlock onSuccess={() => setAuthenticated(true)} />;
  }

  return (
<main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white p-6 space-y-6">
    <h1 className="text-3xl font-bold text-center">Cedrium Wallet</h1>
  <Logo />  {/* Logo burada */}


      <section className="space-y-2 bg-white/10 p-4 rounded-xl shadow-md">
        <p><strong>Address:</strong> {addressHex}</p>
        {showPrivateKey && privateKeyHex && (
          <p><strong>Private Key:</strong> {privateKeyHex}</p>
        )}
        <p><strong>Balance:</strong> {balance} CEDRA</p>
        <button
          onClick={handleGetBalance}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded"
        >
          Refresh Balance
        </button>
      </section>

      <section className="space-y-2 bg-white/10 p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold">Send Tokens</h2>
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border border-gray-300 text-black rounded"
        />
        <input
          type="number"
          placeholder="Amount (CEDRA)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 mt-2 text-black rounded"
        />
        <button
          onClick={handleTransfer}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded mt-2"
        >
          Send
        </button>
        {transferResult && (
          <p className="mt-2 text-sm text-green-300">
            Transfer completed. Tx Hash: {transferResult}
          </p>
        )}
      </section>

      <section className="space-y-2 bg-white/10 p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold">Receive Tokens</h2>
        <p className="text-sm">Scan this QR to receive CEDRA.</p>
        <div className="bg-white p-4 border border-gray-300 inline-block rounded">
          <QRCodeCanvas value={addressHex} size={120} />
        </div>
      </section>
    </main>
  );
}
