import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';
import { ccipDataService } from '../services/ccipDataService';
import { getDisplayChainName } from '../utils/chainMapping';

const FeesPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Data is already loaded by App component, just get the data
    try {
      setLoading(true);
      
      const mostRecentDate = ccipDataService.getMostRecentDate();
      const dates = ccipDataService.getAvailableDates();
      
      setSelectedDate(mostRecentDate);
      setAvailableDates(dates);
    } catch (err) {
      setError('Failed to load fees data');
      console.error('Fees data loading error:', err);
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

  const getFeeData = () => {
    if (!selectedDate) return [];
    
    switch (timeRange) {
      case '24h':
        return ccipDataService.getTimeSeriesData(selectedDate, 24, 4);
      case '7d':
        // Show daily fee totals for the past 7 days
        const dailyData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(selectedDate.getTime() - i * 24 * 60 * 60 * 1000);
          const transactions = ccipDataService.getTransactionsByDate(date);
          const totalFees = transactions.reduce((sum, tx) => sum + (tx.feeInUSD || 0), 0);
          const dayName = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            timeZone: 'UTC' 
          });
          dailyData.push({ time: dayName, value: totalFees });
        }
        return dailyData;
      case '30d':
        // Show weekly fee totals for the past 30 days (4 weeks)
        const weeklyData = [];
        for (let week = 3; week >= 0; week--) {
          const weekStart = new Date(selectedDate.getTime() - week * 7 * 24 * 60 * 60 * 1000);
          const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
          
          // Get all transactions within the week
          let weekFees = 0;
          for (let day = 0; day < 7; day++) {
            const dayDate = new Date(weekStart.getTime() + day * 24 * 60 * 60 * 1000);
            const dayTransactions = ccipDataService.getTransactionsByDate(dayDate);
            weekFees += dayTransactions.reduce((sum, tx) => sum + (tx.feeInUSD || 0), 0);
          }
          
          const weekLabel = `Week ${4 - week}`;
          weeklyData.push({ time: weekLabel, value: weekFees });
        }
        return weeklyData;
      default:
        return [];
    }
  };

  const getFeeBreakdown = () => {
    if (!selectedDate) return [];
    return ccipDataService.getFeeBreakdown(selectedDate);
  };

  const getTotalFees = () => {
    if (!selectedDate) return 0;
    const transactions = ccipDataService.getTransactionsByDate(selectedDate);
    return transactions.reduce((sum, tx) => sum + (tx.feeInUSD || 0), 0);
  };

  const getAverageFee = () => {
    if (!selectedDate) return 0;
    const transactions = ccipDataService.getTransactionsByDate(selectedDate);
    const totalFees = transactions.reduce((sum, tx) => sum + (tx.feeInUSD || 0), 0);
    return transactions.length > 0 ? totalFees / transactions.length : 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Analytics</h1>
          <p className="text-gray-600">Loading fee data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !selectedDate) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Analytics</h1>
          <p className="text-gray-600">Error loading fees data</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error || 'No fees data available'}</p>
        </div>
      </div>
    );
  }

  const totalFees = getTotalFees();
  const averageFee = getAverageFee();
  const feeBreakdown = getFeeBreakdown();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Analytics</h1>
            <p className="text-gray-600">
              Comprehensive fee tracking and analysis for {formatDate(selectedDate)}
            </p>
          </div>
          
          {/* Date Selector */}
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-600" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              value={formatDateForInput(selectedDate)}
              onChange={(e) => {
                const date = new Date(e.target.value + 'T00:00:00.000Z');
                setSelectedDate(date);
              }}
            >
              {availableDates.map((date) => (
                <option key={date.toISOString()} value={formatDateForInput(date)}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-xl p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-900">Time Range</span>
          </div>
          <div className="flex items-center space-x-2">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`flex-1 sm:flex-none px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          {timeRange === '24h' && 'Hourly fee breakdown for the selected date'}
          {timeRange === '7d' && 'Daily fee totals for the past 7 days'}
          {timeRange === '30d' && 'Weekly fee totals for the past 30 days'}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Total Fees"
          value={formatCurrency(totalFees)}
          change="+8.3%"
          trend="up"
        />
        <MetricCard
          title="Average Fee"
          value={formatCurrency(averageFee)}
          change="-12.1%"
          trend="down"
        />
        <MetricCard
          title="Gas Optimization"
          value="23.4%"
          change="+4.2%"
          trend="up"
        />
        <MetricCard
          title="Fee Efficiency"
          value="87.3%"
          change="+2.1%"
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <ChartCard
          title={`Fees Over Time (${timeRange})`}
          type="area"
          data={getFeeData()}
        />
        
        {/* Fee Breakdown */}
        <div className="bg-white rounded-xl p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Breakdown</h3>
          <div className="space-y-4">
            {feeBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{item.percentage.toFixed(1)}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesPage;