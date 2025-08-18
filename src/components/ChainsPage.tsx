import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ChartCard from './ChartCard';
import { ccipDataService, NetworkStats } from '../services/ccipDataService';
import { getDisplayChainName, getChainInfo } from '../utils/chainMapping';
import ChainLogo from './ChainLogo';

interface ChainDetailViewProps {
  chain: NetworkStats;
  onClose: () => void;
}

const ChainDetailView: React.FC<ChainDetailViewProps> = ({ chain, onClose }) => {
  const [timeSeriesData, setTimeSeriesData] = useState<{
    transactions: Array<{ time: string; value: number }>;
    fees: Array<{ time: string; value: number }>;
    volume: Array<{ time: string; value: number }>;
  }>({
    transactions: [],
    fees: [],
    volume: []
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
        
        // Generate realistic data based on chain stats
        const baseTransactions = chain.transactions / 7;
        const baseFees = chain.fees / 7;
        const baseVolume = chain.volume / 7;
        
        const variation = 0.3; // 30% variation
        const randomFactor = 1 + (Math.random() - 0.5) * variation;
        
        data.push({
          time: dayName,
          transactions: Math.round(baseTransactions * randomFactor),
          fees: baseFees * randomFactor,
          volume: baseVolume * randomFactor
        });
      }
      
      return data;
    };

    const data = generateTimeSeriesData();
    setTimeSeriesData({
      transactions: data.map(d => ({ time: d.time, value: d.transactions })),
      fees: data.map(d => ({ time: d.time, value: d.fees })),
      volume: data.map(d => ({ time: d.time, value: d.volume }))
    });
  }, [chain]);

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
            <ChainLogo chainName={chain.originalName} size="lg" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{chain.displayName}</h2>
              <p className="text-gray-600">{chain.shortName} • Cross-chain Network</p>
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
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(chain.transactions)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(chain.volume)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Fees</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(chain.fees)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Unique Tokens</p>
              <p className="text-2xl font-bold text-gray-900">{chain.tokenCount}</p>
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
              title="Fees (7 Days)"
              type="area"
              data={timeSeriesData.fees}
            />
            <ChartCard
              title="Volume (7 Days)"
              type="area"
              data={timeSeriesData.volume}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChainsPage: React.FC = () => {
  const [chains, setChains] = useState<NetworkStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChainDetail, setSelectedChainDetail] = useState<NetworkStats | null>(null);

  useEffect(() => {
    // Data is already loaded by App component, just get the data
    try {
      setLoading(true);
      const networkStats = ccipDataService.getNetworkStats();
      setChains(networkStats);
    } catch (err) {
      setError('Failed to load chains data');
      console.error('Chains data loading error:', err);
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

  const handleChainClick = (chain: NetworkStats) => {
    setSelectedChainDetail(chain);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chains Analytics</h1>
          <p className="text-gray-600">Loading blockchain network metrics...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !chains.length) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chains Analytics</h1>
          <p className="text-gray-600">Error loading chains data</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error || 'No chains data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chain Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Chains</h3>
        </div>
        
        {/* Table Headers */}
        <div className="grid grid-cols-[2fr_1.5fr_0.7fr_0.8fr] gap-3 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="text-left">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chain</span>
          </div>
          <div className="text-left">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Value</span>
          </div>
          <div className="text-left">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Txs</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fees</span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {chains.map((chain, index) => (
            <div 
              key={chain.name} 
              className="grid grid-cols-[2fr_1.5fr_0.7fr_0.8fr] gap-3 px-6 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              onClick={() => handleChainClick(chain)}
            >
              <div className="flex items-center">
                <div className="w-5 text-xs text-gray-400 font-medium">
                  {index + 1}
                </div>
                <div className="flex items-center space-x-2">
                  <ChainLogo chainName={chain.originalName} size="sm" />
                  <span className="font-semibold text-gray-900 text-sm">{chain.displayName}</span>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">{formatCurrency(chain.volume)}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-700 text-xs">{formatNumber(chain.transactions)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-700 text-xs">{formatCurrency(chain.fees)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chain Detail Modal */}
      {selectedChainDetail && (
        <ChainDetailView
          chain={selectedChainDetail}
          onClose={() => setSelectedChainDetail(null)}
        />
      )}
    </div>
  );
};

export default ChainsPage;