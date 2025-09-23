import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import TopListCard from './TopListCard';
import BannerAd from './BannerAd';
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
          
          {/* Compact Banner Ad - Centered */}
          <div className="flex justify-center transform scale-110">
            <BannerAd 
              imageSrc="/stLINK.jpg"
              imageAlt="Stake your $LINK today - stake.link"
              ctaLink="https://stake.link/"
              variant="primary"
              compact={true}
            />
          </div>
          
          {/* Date Selector - Calendar Picker */}
          <div className="flex items-center space-x-3">
            <input
              type="date"
              className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm sm:text-base"
              value={selectedDate ? formatDateForInput(selectedDate) : ''}
              min={availableDates.length > 0 ? formatDateForInput(availableDates[availableDates.length - 1]) : ''}
              max={availableDates.length > 0 ? formatDateForInput(availableDates[0]) : ''}
              onChange={(e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value + 'T00:00:00.000Z');
                  setSelectedDate(date);
                }
              }}
            />
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