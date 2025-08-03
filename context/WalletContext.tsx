// context/WalletContext.tsx
import {
  Cedra,
  CedraConfig,
  Network,
  Account,
  Ed25519PrivateKey,
} from '@cedra-labs/ts-sdk';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

const cedra = new Cedra(new CedraConfig({ network: Network.TESTNET }));

interface WalletContextType {
  account: Account | null;
  addressHex: string | null;
  privateKeyHex: string | null;
  walletCreated: boolean;
  createWallet: () => Promise<void>;
  importWallet: (privateKeyHex: string) => void;
  getBalance: () => Promise<string>;
  transferTokens: (recipient: string, amount: number) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  addressHex: null,
  privateKeyHex: null,
  walletCreated: false,
  createWallet: async () => {},
  importWallet: () => {},
  getBalance: async () => '0',
  transferTokens: async () => null,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [addressHex, setAddressHex] = useState<string | null>(null);
  const [privateKeyHex, setPrivateKeyHex] = useState<string | null>(null);
  const [walletCreated, setWalletCreated] = useState<boolean>(false);

  const createWallet = async () => {
    const acc = Account.generate();
    const privKeyHex = Buffer.from(acc.privateKey.toUint8Array()).toString('hex');
    const addrHex = '0x' + Buffer.from(acc.accountAddress.data).toString('hex');

    setAccount(acc);
    setAddressHex(addrHex);
    setPrivateKeyHex(privKeyHex);
    setWalletCreated(true);

    localStorage.setItem('cedrium_wallet', privKeyHex);

    await fetch('/api/faucet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey: addrHex.replace('0x', ''), amount: '100000000' }),
    });
  };

  const importWallet = (privateKeyHex: string) => {
    try {
      const privateKeyBytes = new Uint8Array(Buffer.from(privateKeyHex, 'hex'));
      const privateKey = new Ed25519PrivateKey(privateKeyBytes);
      const acc = Account.fromPrivateKey({ privateKey });

      const addrHex = Buffer.from(acc.accountAddress.data).toString('hex');
      setAccount(acc);
      setAddressHex(`0x${addrHex}`);
      setPrivateKeyHex(privateKeyHex);
      setWalletCreated(false);

      console.log('Cüzdan geri yüklendi:', addrHex);
    } catch (error) {
      console.error('Geçersiz private key:', error);
    }
  };

  // ✅ localStorage'dan otomatik cüzdan yükleme
  useEffect(() => {
    const savedKey = localStorage.getItem('cedrium_wallet');
    const savedPin = localStorage.getItem('cedrium_pin');

    if (savedKey && savedPin) {
      importWallet(savedKey);
    }
  }, []);

  const getBalance = async () => {
    if (!addressHex) return '0';
    try {
      const res = await fetch(
        `https://testnet.cedra.dev/v1/accounts/${addressHex}/balance/0x1::cedra_coin::CedraCoin`
      );
      const data = await res.json();
      return (parseInt(data, 10) / 100_000_000).toFixed(4);
    } catch (e) {
      console.error('Bakiye alınamadı:', e);
      return '0';
    }
  };

  const transferTokens = async (recipient: string, amount: number): Promise<string | null> => {
    if (!account) return null;
    try {
      const tx = await cedra.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: '0x1::cedra_account::transfer',
          functionArguments: [recipient, amount * 100_000_000],
        },
      });

      const signature = await cedra.transaction.sign({ signer: account, transaction: tx });

      const submitted = await cedra.transaction.submit.simple({
        transaction: tx,
        senderAuthenticator: signature,
      });

      return submitted.hash;
    } catch (err) {
      console.error('Transfer hatası:', err);
      return null;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        addressHex,
        privateKeyHex,
        walletCreated,
        createWallet,
        importWallet,
        getBalance,
        transferTokens,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
