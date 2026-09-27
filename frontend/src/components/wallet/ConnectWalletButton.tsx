import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

export function ConnectWalletButton() {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect,
    shortenAddress 
  } = useWallet();

  if (isConnecting) {
    return (
      <Button variant="glass" className="gap-2" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <Button 
        variant="glass" 
        className="gap-2"
        onClick={() => disconnect()}
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-mono">{shortenAddress(address)}</span>
        <LogOut className="w-4 h-4 ml-1 opacity-60" />
      </Button>
    );
  }

  return (
    <Button 
      variant="glow" 
      className="gap-2"
      onClick={() => connect(0)}
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </Button>
  );
}
