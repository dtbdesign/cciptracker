import React from 'react';

const TokensPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Token Analytics</h1>
        <p className="text-gray-600">Comprehensive token tracking and analysis</p>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white rounded-xl p-12 lg:p-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We're working hard to bring you comprehensive token analytics. This feature will include detailed token volumes, cross-chain activity tracking, and performance insights.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            In Development
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokensPage;