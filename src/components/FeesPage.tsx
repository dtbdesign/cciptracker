import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, TrendingUpIcon, PieChart } from 'lucide-react';
import Chart from './ui/Chart';
import MetricCard from './MetricCard';
import { ccipDataService } from '../services/ccipDataService';
import { getChainInfo } from '../utils/chainMapping';

const FeesPage: React.FC = () => {
  const [feeData, setFeeData] = useState<Array<{ time: string; value: number }>>([]);
  const [chainStats, setChainStats] = useState<Array<{
    name: string;
    originalName: string;
    shortName: string;
    displayName: string;
    logo: string;
    color: string;
    fees: number;
    transactions: number;
    averageFee: number;
    percentage: number;
  }>>([]);
  const [metrics, setMetrics] = useState({
    totalFees: 0,
    averageFeePerTx: 0,
    totalTransactions: 0,
    feeChange: 0
  });
  const [chainViewMode, setChainViewMode] = useState<'source' | 'destination'>('source');

  useEffect(() => {
    const loadFeeData = () => {
      try {
        console.log('Loading fee data...');
        
        // Clear cache to ensure fresh data
        ccipDataService.clearCache();
        
        // Get fee data for the last 7 days
        const data = ccipDataService.getFeeData('7d');
        console.log('Fee data loaded:', data);
        setFeeData(data);

        // Get metrics for the last 7 days
        const availableDates = ccipDataService.getAvailableDates();
        console.log('Available dates:', availableDates);
        
        if (availableDates.length >= 7) {
          const last7Days = availableDates.slice(0, 7);
          
          // Calculate totals for last 7 days
          let totalFees7Days = 0;
          let totalTransactions7Days = 0;
          
          last7Days.forEach(date => {
            const dailyData = ccipDataService.getDailyData(date);
            if (dailyData) {
              totalFees7Days += dailyData.totalFees;
              totalTransactions7Days += dailyData.totalTransactions;
            }
          });
          
          // Calculate average fee per transaction for last 7 days
          const avgFeePerTx = totalTransactions7Days > 0 
            ? totalFees7Days / totalTransactions7Days 
            : 0;

          // Get previous 7 days for change calculation
          const previous7Days = availableDates.length >= 14 
            ? availableDates.slice(7, 14)
            : [];
          
          let totalFeesPrevious7Days = 0;
          previous7Days.forEach(date => {
            const dailyData = ccipDataService.getDailyData(date);
            if (dailyData) {
              totalFeesPrevious7Days += dailyData.totalFees;
            }
          });

          const feeChange = totalFeesPrevious7Days > 0
            ? ((totalFees7Days - totalFeesPrevious7Days) / totalFeesPrevious7Days) * 100
            : 0;

          setMetrics({
            totalFees: totalFees7Days,
            averageFeePerTx: avgFeePerTx,
            totalTransactions: totalTransactions7Days,
            feeChange
          });
          
          // Calculate chain stats for last 7 days
          const chainMap = new Map<string, { fees: number; transactions: number }>();
          
          last7Days.forEach(date => {
            const dailyData = ccipDataService.getDailyData(date);
            if (dailyData) {
              dailyData.transactions.forEach(tx => {
                // Track both source and destination chains
                const sourceChain = tx.sourceNetworkName;
                const destChain = tx.destNetworkName;
                
                // Source chain stats
                const existingSource = chainMap.get(`source:${sourceChain}`) || { fees: 0, transactions: 0 };
                existingSource.fees += tx.feeInUSD;
                existingSource.transactions += 1;
                chainMap.set(`source:${sourceChain}`, existingSource);
                
                // Destination chain stats
                const existingDest = chainMap.get(`dest:${destChain}`) || { fees: 0, transactions: 0 };
                existingDest.fees += tx.feeInUSD;
                existingDest.transactions += 1;
                chainMap.set(`dest:${destChain}`, existingDest);
              });
            }
          });
          
          // Convert to array and filter by view mode, then sort by fees
          const chainStatsArray = Array.from(chainMap.entries())
            .filter(([chainKey]) => chainKey.startsWith(chainViewMode === 'source' ? 'source:' : 'dest:'))
            .map(([chainKey, stats]) => {
              const chainName = chainKey.replace('source:', '').replace('dest:', '');
              const chainInfo = getChainInfo(chainName);
              return {
                name: chainName.replace('-mainnet', ''),
                originalName: chainName,
                shortName: chainInfo.shortName,
                displayName: chainInfo.displayName,
                logo: chainInfo.logo,
                color: chainInfo.color,
                fees: stats.fees,
                transactions: stats.transactions,
                averageFee: stats.transactions > 0 ? stats.fees / stats.transactions : 0,
                percentage: totalFees7Days > 0 ? (stats.fees / totalFees7Days) * 100 : 0
              };
            })
            .sort((a, b) => b.fees - a.fees)
            .slice(0, 8); // Top 8 chains
          
          setChainStats(chainStatsArray);
        }
      } catch (error) {
        console.error('Error loading fee data:', error);
      }
    };

    loadFeeData();
  }, [chainViewMode]);



  const formatCurrency = (value: number, showCents: boolean = false) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Analytics</h1>
          </div>
          
          {/* Time Range Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              className="px-3 py-1 text-sm font-medium rounded-md bg-white text-gray-900 shadow-sm"
            >
              7d
            </button>
            <button
              disabled
              className="px-3 py-1 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed"
            >
              30d
            </button>
          </div>
        </div>
      </div>



      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Fees"
          value={formatCurrency(metrics.totalFees)}
          change=""
          trend=""
        />
        <MetricCard
          title="Average Fee per Transaction"
          value={formatCurrency(metrics.averageFeePerTx, true)}
          change=""
          trend=""
        />
        <MetricCard
          title="Total Transactions"
          value={metrics.totalTransactions.toLocaleString()}
          change=""
          trend=""
        />
      </div>

      {/* Fee Line Chart */}
      <div className="bg-white rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Daily Fees</h2>
        </div>
        
        {feeData.length > 0 ? (
          <>
            <Chart 
              data={feeData}
              title=""
              type="area"
              height={300}
            />
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Loading fee data...</p>
            <p className="text-sm mt-2">Data points: {feeData.length}</p>
          </div>
        )}
      </div>

      {/* Chain Fee Stats */}
      {chainStats.length > 0 && (
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Fee Distribution</h2>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChainViewMode('source')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chainViewMode === 'source'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Source
              </button>
              <button
                onClick={() => setChainViewMode('destination')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chainViewMode === 'destination'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Destination
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {chainStats.map((chain, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={chain.logo} 
                      alt={chain.displayName}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <h3 className="font-medium text-gray-900">{chain.displayName}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{chain.percentage.toFixed(1)}%</span>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(chain.fees)}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {chain.transactions.toLocaleString()} transactions
                    </p>
                    <p className="text-sm text-gray-500">
                      Avg: {formatCurrency(chain.averageFee, true)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default FeesPage;