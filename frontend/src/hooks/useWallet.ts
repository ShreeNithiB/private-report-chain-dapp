import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { polygonAmoy } from '@/config/web3';
import { formatUnits } from 'viem';

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: polygonAmoy.id,
  });

  const connectWallet = (connectorIndex = 0) => {
    const connector = connectors[connectorIndex];
    if (connector) {
      connect({ connector });
    }
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formattedBalance = balance 
    ? formatUnits(balance.value, balance.decimals) 
    : undefined;

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isPending,
    balance: formattedBalance,
    balanceSymbol: balance?.symbol,
    connectors,
    connect: connectWallet,
    disconnect,
    shortenAddress,
  };
}
