import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ChartCard from './ChartCard';
import { ccipDataService, TokenStats } from '../services/ccipDataService';

interface TokenDetailViewProps {
  token: TokenStats;
  onClose: () => void;
}

const TokenDetailView: React.FC<TokenDetailViewProps> = ({ token, onClose }) => {
  const [timeSeriesData, setTimeSeriesData] = useState<{
    transactions: Array<{ time: string; value: number }>;
    volume: Array<{ time: string; value: number }>;
    chains: Array<{ time: string; value: number }>;
  }>({
    transactions: [],
    volume: [],
    chains: []
  });

  useEffect(() => {
    // Generate sample time series data for the last 7 days
    const generateTimeSeriesData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Generate realistic data based on token stats
        const baseTransactions = token.transactions / 7;
        const baseVolume = token.volume / 7;
        const baseChains = token.chains.size / 7;
        
        const variation = 0.3; // 30% variation
        const randomFactor = 1 + (Math.random() - 0.5) * variation;
        
        data.push({
          time: dayName,
          transactions: Math.round(baseTransactions * randomFactor),
          volume: baseVolume * randomFactor,
          chains: Math.round(baseChains * randomFactor)
        });
      }
      
      return data;
    };

    const data = generateTimeSeriesData();
    setTimeSeriesData({
      transactions: data.map(d => ({ time: d.time, value: d.transactions })),
      volume: data.map(d => ({ time: d.time, value: d.volume })),
      chains: data.map(d => ({ time: d.time, value: d.chains }))
    });
  }, [token]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-800">
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{token.symbol}</h2>
              <p className="text-gray-600">{token.name} • Cross-chain Token</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(token.volume)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(token.transactions)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Active Chains</p>
              <p className="text-2xl font-bold text-gray-900">{token.chains.size}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Current Price</p>
              <p className="text-2xl font-bold text-gray-900">{token.price > 0 ? formatCurrency(token.price) : 'N/A'}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard
              title="Transactions (7 Days)"
              type="bar"
              data={timeSeriesData.transactions}
            />
            <ChartCard
              title="Volume (7 Days)"
              type="area"
              data={timeSeriesData.volume}
            />
            <ChartCard
              title="Active Chains (7 Days)"
              type="area"
              data={timeSeriesData.chains}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TokensPage: React.FC = () => {
  const [tokens, setTokens] = useState<TokenStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTokenDetail, setSelectedTokenDetail] = useState<TokenStats | null>(null);

  useEffect(() => {
    // Data is already loaded by App component, just get the data
    try {
      setLoading(true);
      const tokenStats = ccipDataService.getTokenStats();
      setTokens(tokenStats);
    } catch (err) {
      setError('Failed to load tokens data');
      console.error('Tokens data loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const handleTokenClick = (token: TokenStats) => {
    setSelectedTokenDetail(token);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !tokens.length) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error || 'No tokens data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Tokens</h3>
        </div>
        
        {/* Table Headers */}
        <div className="grid grid-cols-[2fr_1.5fr_0.7fr_0.8fr] gap-3 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="text-left">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Token</span>
          </div>
          <div className="text-left">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Volume</span>
          </div>
          <div className="text-left">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Txs</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chains</span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {tokens.map((token, index) => (
            <div 
              key={token.symbol} 
              className="grid grid-cols-[2fr_1.5fr_0.7fr_0.8fr] gap-3 px-6 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              onClick={() => handleTokenClick(token)}
            >
              <div className="flex items-center">
                <div className="w-5 text-xs text-gray-400 font-medium">
                  {index + 1}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{token.symbol}</span>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">{formatCurrency(token.volume)}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-700 text-xs">{formatNumber(token.transactions)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-700 text-xs">{token.chains.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Token Detail Modal */}
      {selectedTokenDetail && (
        <TokenDetailView
          token={selectedTokenDetail}
          onClose={() => setSelectedTokenDetail(null)}
        />
      )}
    </div>
  );
};

export default TokensPage;