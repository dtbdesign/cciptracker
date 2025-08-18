import React from 'react';
import { getChainLogo, getChainColor, getShortChainName } from '../utils/chainMapping';

interface ChainLogoProps {
  chainName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ChainLogo: React.FC<ChainLogoProps> = ({ chainName, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const containerClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  return (
    <div className={`${containerClasses[size]} flex items-center justify-center ${className}`}>
      <img 
        src={getChainLogo(chainName)} 
        alt={getShortChainName(chainName)}
        className={`${sizeClasses[size]} object-contain p-1`}
        onError={(e) => {
          // Fallback to colored background if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement!;
          parent.style.backgroundColor = getChainColor(chainName);
          parent.innerHTML = `<span class="text-white font-bold ${textSizes[size]}">${getShortChainName(chainName).slice(0, 2)}</span>`;
        }}
      />
    </div>
  );
};

export default ChainLogo;
