import { createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect project ID - you can get one at https://cloud.walletconnect.com
const projectId = 'demo-project-id';

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [polygonAmoy.id]: http(),
  },
});

// Biconomy configuration for gasless transactions
export const biconomyConfig = {
  bundlerUrl: `https://bundler.biconomy.io/api/v2/${polygonAmoy.id}/demo`,
  paymasterUrl: `https://paymaster.biconomy.io/api/v1/${polygonAmoy.id}/demo`,
};

export { polygonAmoy };
