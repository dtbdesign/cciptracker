export interface ChainInfo {
  shortName: string;
  displayName: string;
  logo: string;
  color: string;
}

export const chainMapping: Record<string, ChainInfo> = {
  // Mainnet chains (with -mainnet suffix)
  'ethereum-mainnet': {
    shortName: 'ETH',
    displayName: 'Ethereum',
    logo: 'https://docs.chain.link/assets/chains/ethereum.svg',
    color: '#627EEA'
  },
  'ethereum-mainnet-arbitrum-1': {
    shortName: 'ARB',
    displayName: 'Arbitrum',
    logo: 'https://docs.chain.link/assets/chains/arbitrum.svg',
    color: '#2D3748'
  },
  'ethereum-mainnet-base-1': {
    shortName: 'BASE',
    displayName: 'Base',
    logo: 'https://docs.chain.link/assets/chains/base.svg',
    color: '#0052FF'
  },
  'avalanche-mainnet': {
    shortName: 'AVAX',
    displayName: 'Avalanche',
    logo: 'https://docs.chain.link/assets/chains/avalanche.svg',
    color: '#E84142'
  },
  'binance_smart_chain-mainnet': {
    shortName: 'BNB',
    displayName: 'BNB Chain',
    logo: 'https://docs.chain.link/assets/chains/bnb-chain.svg',
    color: '#F3BA2F'
  },
  'ronin-mainnet': {
    shortName: 'RONIN',
    displayName: 'Ronin',
    logo: 'https://docs.chain.link/assets/chains/ronin.svg',
    color: '#0195F7'
  },
  'polygon-mainnet-katana': {
    shortName: 'KATANA',
    displayName: 'Katana',
    logo: 'https://docs.chain.link/assets/chains/polygonkatana.svg',
    color: '#8247E5'
  },
  'gnosis_chain-mainnet': {
    shortName: 'GNO',
    displayName: 'Gnosis',
    logo: 'https://docs.chain.link/assets/chains/gnosis-chain.svg',
    color: '#00A6C4'
  },
  'berachain-mainnet': {
    shortName: 'BERA',
    displayName: 'Berachain',
    logo: 'https://docs.chain.link/assets/chains/berachain.svg',
    color: '#8B4513'
  },
  'sonic-mainnet': {
    shortName: 'SONIC',
    displayName: 'Sonic',
    logo: 'https://docs.chain.link/assets/chains/sonic.svg',
    color: '#8B4513'
  },
  'ethereum-mainnet-optimism-1': {
    shortName: 'OP',
    displayName: 'Optimism',
    logo: 'https://docs.chain.link/assets/chains/optimism.svg',
    color: '#8B4513'
  },
  'sei-mainnet': {
    shortName: 'SEI',
    displayName: 'Sei',
    logo: 'https://docs.chain.link/assets/chains/sei.svg',
    color: '#8B4513'
  },
  'polygon-mainnet': {
    shortName: 'POLY',
    displayName: 'Polygon',
    logo: 'https://docs.chain.link/assets/chains/polygon.svg',
    color: '#8B4513'
  },
  'ethereum-mainnet-unichain-1': {
    shortName: 'UNI',
    displayName: 'Unichain',
    logo: 'https://docs.chain.link/assets/chains/unichain.svg',
    color: '#8B4513'
  },
  'polkadot-mainnet-astar': {
    shortName: 'ASTAR',
    displayName: 'Astar',
    logo: 'https://docs.chain.link/assets/chains/astar.svg',
    color: '#8B4513'
  },
  'soneium-mainnet': {
    shortName: 'SONE',
    displayName: 'Soneium',
    logo: 'https://docs.chain.link/assets/chains/soneium.svg',
    color: '#8B4513'
  },
  'bitcoin-mainnet-bitlayer-1': {
    shortName: 'BIT',
    displayName: 'Bitlayer',
    logo: 'https://docs.chain.link/assets/chains/bitlayer.svg',
    color: '#8B4513'
  },
  'solana-mainnet': {
    shortName: 'SOL',
    displayName: 'Solana',
    logo: 'https://docs.chain.link/assets/chains/solana.svg',
    color: '#8B4513'
  }
};

export function getChainInfo(chainName: string): ChainInfo {
  // Try exact match first
  if (chainMapping[chainName]) {
    return chainMapping[chainName];
  }
  
  // Try with -mainnet suffix added
  const withMainnet = chainName.includes('-mainnet') ? chainName : `${chainName}-mainnet`;
  if (chainMapping[withMainnet]) {
    return chainMapping[withMainnet];
  }
  
  // Try without mainnet suffix
  const withoutMainnet = chainName.replace('-mainnet', '');
  if (chainMapping[withoutMainnet]) {
    return chainMapping[withoutMainnet];
  }
  
  // Default fallback
  return {
    shortName: chainName.slice(0, 3).toUpperCase(),
    displayName: chainName.replace('-mainnet', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    logo: 'https://docs.chain.link/assets/chains/ethereum.svg', // Default fallback image
    color: '#6B7280'
  };
}

export function getShortChainName(chainName: string): string {
  return getChainInfo(chainName).shortName;
}

export function getDisplayChainName(chainName: string): string {
  return getChainInfo(chainName).displayName;
}

export function getChainLogo(chainName: string): string {
  return getChainInfo(chainName).logo;
}

export function getChainColor(chainName: string): string {
  return getChainInfo(chainName).color;
}
