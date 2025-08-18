import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';
import TopListCard from './TopListCard';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ccipDataService, DashboardMetrics } from '../services/ccipDataService';

const DailyDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    // Data is already loaded by App component, just get the data
    try {
      setLoading(true);
      
      const mostRecentDate = ccipDataService.getMostRecentDate();
      const dates = ccipDataService.getAvailableDates();
      
      console.log('Available dates from service:', dates);
      console.log('Most recent date:', mostRecentDate);
      console.log('Dates count:', dates.length);
      
      setSelectedDate(mostRecentDate);
      setAvailableDates(dates);
      
      if (mostRecentDate) {
        const dashboardMetrics = ccipDataService.getDashboardMetrics(mostRecentDate);
        setMetrics(dashboardMetrics);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dashboardMetrics = ccipDataService.getDashboardMetrics(selectedDate);
      setMetrics(dashboardMetrics);
    }
  }, [selectedDate]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Dashboard</h1>
          <p className="text-gray-600">Loading cross-chain interoperability metrics...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Dashboard</h1>
          <p className="text-gray-600">Error loading dashboard data</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error || 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toLocaleString();
    }
  };

  const formatTransactionCount = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Dashboard</h1>
          </div>
          
          {/* Date Selector */}
          <div className="flex items-center space-x-3">
            <select
              className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm sm:text-base"
              value={selectedDate ? formatDateForInput(selectedDate) : ''}
              onChange={(e) => {
                const date = new Date(e.target.value + 'T00:00:00.000Z');
                setSelectedDate(date);
              }}
            >
              {availableDates.length === 0 ? (
                <option value="">No dates available</option>
              ) : (
                availableDates.map((date) => (
                  <option key={date.toISOString()} value={formatDateForInput(date)}>
                    {formatDate(date)}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <MetricCard
          title="Total Value Transferred"
          value={formatCurrency(metrics.totalValueTransferred)}
          change={`${metrics.valueChange >= 0 ? '+' : ''}${metrics.valueChange.toFixed(1)}%`}
          trend={metrics.valueChange >= 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Total Transactions"
          value={formatTransactionCount(metrics.totalTransactions)}
          change={`${metrics.transactionChange >= 0 ? '+' : ''}${metrics.transactionChange.toFixed(1)}%`}
          trend={metrics.transactionChange >= 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Total Fees (USD)"
          value={formatCurrency(metrics.totalFees)}
          change={`${metrics.feeChange >= 0 ? '+' : ''}${metrics.feeChange.toFixed(1)}%`}
          trend={metrics.feeChange >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <TopListCard
          title="Top Source Chains"
          data={metrics.topSourceChains.map(item => ({
            name: item.displayName,
            chainName: item.originalName, // Use original name for logo lookup
            value: formatCurrency(item.value),
            percentage: item.percentage,
            trend: item.trend,
            transactions: item.transactions,
            fees: item.fees
          }))}
          icon={ArrowUpRight}
        />
        <TopListCard
          title="Top Destination Chains"
          data={metrics.topDestinationChains.map(item => ({
            name: item.displayName,
            chainName: item.originalName, // Use original name for logo lookup
            value: formatCurrency(item.value),
            percentage: item.percentage,
            trend: item.trend,
            transactions: item.transactions,
            fees: item.fees
          }))}
          icon={ArrowDownRight}
        />
      </div>

      {/* Top Tokens */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        <TopListCard
          title="Top Tokens Sent"
          data={metrics.topTokens.map(item => ({
            name: item.name,
            value: formatCurrency(item.value),
            percentage: item.percentage,
            trend: item.trend,
            transactions: item.transactions,
            fees: item.fees
          }))}
          icon={TrendingUp}
        />
      </div>
    </div>
  );
};

export default DailyDashboard;