// components/WalletUI.tsx
import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useWallet } from '../context/WalletContext';

export default function WalletUI() {
  const {
    account,
    addressHex,
    privateKeyHex,
    getBalance,
    transferTokens,
    walletCreated, // WalletContext içinde set edilen değer
  } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transferResult, setTransferResult] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [showPrivateKey, setShowPrivateKey] = useState(walletCreated);

  const handleGetBalance = async () => {
    const b = await getBalance();
    setBalance(b);
  };

  const handleTransfer = async () => {
    const txHash = await transferTokens(recipient, Number(amount));
    setTransferResult(txHash);
    handleGetBalance();
  };

  useEffect(() => {
    if (walletCreated) {
      // 15 saniye sonra private key gizlensin
      const timer = setTimeout(() => setShowPrivateKey(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [walletCreated]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Cedrium Wallet</h1>

      <section className="space-y-2 bg-white/10 p-4 rounded-xl shadow-md">
        <p><strong>Address:</strong> {addressHex}</p>
        {showPrivateKey ? (
          <p className="text-red-300">
            <strong>Private Key:</strong> {privateKeyHex}
            <br />
            <span className="text-sm">⚠️ Please save this key now. It will not be shown again.</span>
          </p>
        ) : (
          <p className="text-sm text-gray-300 italic">Private key is hidden for security.</p>
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
            Transfer complete. Tx Hash: {transferResult}
          </p>
        )}
      </section>

      <section className="space-y-2 bg-white/10 p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold">Receive Tokens</h2>
        <p className="text-sm">Share this QR code to receive CEDRA:</p>
        <div className="bg-white p-4 border border-gray-300 inline-block rounded">
<QRCodeCanvas value={addressHex || ''} size={180} />

        </div>
      </section>
    </main>
  );
}
