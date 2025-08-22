import React from 'react';
import { track } from '@vercel/analytics';

interface BannerAdProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  compact?: boolean;
  imageSrc?: string;
  imageAlt?: string;
}

const BannerAd: React.FC<BannerAdProps> = ({ 
  title = "🚀 Boost Your CCIP Analytics",
  description = "Get real-time insights and advanced metrics for cross-chain transactions",
  ctaText = "Learn More",
  ctaLink = "#",
  variant = "primary",
  compact = false,
  imageSrc,
  imageAlt
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-green-700 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white';
      default:
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white';
    }
  };

  return (
    <>
            {imageSrc ? (
        // Image-based banner - no borders, just the image
        <div className="relative inline-block">
          <a 
            href={ctaLink} 
            className="block"
            onClick={() => track('Banner Ad Click', { 
              adSource: 'stake.link',
              location: compact ? 'dashboard-header' : 'full-banner'
            })}
          >
            <img 
              src={imageSrc} 
              alt={imageAlt || "Banner advertisement"} 
              className={`${compact ? 'h-16' : 'h-32'} object-contain`}
            />
          </a>
          {/* Small AD tag */}
          <div className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded-tl-md opacity-75">
            AD
          </div>
        </div>
      ) : (
        // Text-based banner with full styling
        <div className={`${getVariantStyles()} rounded-lg shadow-md ${compact ? 'p-3' : 'p-6'}`}>
          <div className={`flex ${compact ? 'flex-row items-center space-x-3' : 'flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0'}`}>
            <div className="flex-1">
              <h2 className={`font-bold ${compact ? 'text-sm mb-1' : 'text-xl mb-2'}`}>{title}</h2>
              <p className={`text-blue-100 opacity-90 ${compact ? 'text-xs' : ''}`}>{description}</p>
            </div>
            <div className="flex-shrink-0">
              <a
                href={ctaLink}
                className={`inline-flex items-center bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg ${
                  compact ? 'px-3 py-1.5 text-xs' : 'px-6 py-3'
                }`}
              >
                {ctaText}
                <svg className={`${compact ? 'ml-1 w-3 h-3' : 'ml-2 w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BannerAd;
