import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import ChainLogo from './ChainLogo';
import { getChainInfo } from '../utils/chainMapping';

interface TopListItem {
  name: string;
  value: string;
  percentage: number;
  trend: 'up' | 'down';
  chainName?: string; // Optional chain name for logo display
  transactions?: number; // Optional transaction count for tokens and chains
  fees?: number; // Optional fees for tokens and chains
}

interface TopListCardProps {
  title: string;
  data: TopListItem[];
  icon: LucideIcon;
}

type SortField = 'value' | 'transactions' | 'fees';

const TopListCard: React.FC<TopListCardProps> = ({ title, data, icon: Icon }) => {
  const isChainList = title.toLowerCase().includes('chain');
  const [sortField, setSortField] = useState<SortField>('value');

  // Debug logging
  console.log('TopListCard render:', { title, sortField, dataLength: data.length });

  // Sort data based on selected field
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      switch (sortField) {
        case 'transactions':
          return (b.transactions || 0) - (a.transactions || 0);
        case 'fees':
          return (b.fees || 0) - (a.fees || 0);
        case 'value':
        default:
          // Parse the value string to get numeric value for sorting
          // Handle various currency formats: "$1,234.56", "1,234.56", "1234.56"
          const aValue = parseFloat(a.value.replace(/[$,]/g, '')) || 0;
          const bValue = parseFloat(b.value.replace(/[$,]/g, '')) || 0;
          return bValue - aValue;
      }
    });
    return sorted;
  }, [data, sortField]);

  const handleSort = (field: SortField) => {
    console.log('Sort clicked:', field, 'previous sortField:', sortField);
    setSortField(field);
  };

  const getHeaderStyle = (field: SortField, align: 'left' | 'center' | 'right' = 'center') => {
    const isActive = sortField === field;
    const justifyClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';
    return `text-xs font-medium uppercase tracking-wide cursor-pointer transition-all duration-200 flex items-center ${justifyClass} space-x-1 select-none px-2 py-1 rounded ${
      isActive 
        ? 'text-gray-900' 
        : 'text-gray-500'
    }`;
  };

  const getHeaderInlineStyle = (field: SortField) => {
    const isActive = sortField === field;
    return {
      fontWeight: isActive ? 'bold' : 'normal' as const
    };
  };

  const getSortIndicator = (field: SortField) => {
    return null; // No more arrow indicator
  };

  return (
    <div className="bg-white rounded-xl p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {/* Table Headers */}
        {!isChainList && (
          <div className="grid grid-cols-4 gap-4 px-2 py-2 border-b border-gray-200">
            <div className="text-left">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Token</span>
            </div>
            <div className="text-center">
              <span 
                className={getHeaderStyle('value')}
                style={getHeaderInlineStyle('value')}
                onClick={() => handleSort('value')}
                title="Click to sort by value"
              >
                Value
                {getSortIndicator('value')}
              </span>
            </div>
            <div className="text-center">
              <span 
                className={getHeaderStyle('transactions', 'center')}
                style={getHeaderInlineStyle('transactions')}
                onClick={() => handleSort('transactions')}
                title="Click to sort by transactions"
              >
                Transactions
                {getSortIndicator('transactions')}
              </span>
            </div>
            <div className="text-center">
              <span 
                className={getHeaderStyle('fees', 'center')}
                style={getHeaderInlineStyle('fees')}
                onClick={() => handleSort('fees')}
                title="Click to sort by fees"
              >
                Fees
                {getSortIndicator('fees')}
              </span>
            </div>
          </div>
        )}
        
        {isChainList && (
          <div className="grid grid-cols-[2fr_1.5fr_0.7fr_0.8fr] gap-3 px-2 py-2 border-b border-gray-200">
            <div className="text-left">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chain</span>
            </div>
            <div className="text-left">
              <span 
                className={getHeaderStyle('value', 'left')}
                style={getHeaderInlineStyle('value')}
                onClick={() => handleSort('value')}
                title="Click to sort by value"
              >
                Value
                {getSortIndicator('value')}
              </span>
            </div>
            <div className="text-center">
              <span 
                className={getHeaderStyle('transactions', 'center')}
                style={getHeaderInlineStyle('transactions')}
                onClick={() => handleSort('transactions')}
                title="Click to sort by transactions"
              >
                Txs
                {getSortIndicator('transactions')}
              </span>
            </div>
            <div className="text-right">
              <span 
                className={getHeaderStyle('fees', 'right')}
                style={getHeaderInlineStyle('fees')}
                onClick={() => handleSort('fees')}
                title="Click to sort by fees"
              >
                Fees
                {getSortIndicator('fees')}
              </span>
            </div>
          </div>
        )}
        
        {/* Table Rows */}
        {sortedData.map((item, index) => (
          <div key={index} className={`group hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors duration-200 ${
            !isChainList ? 'grid grid-cols-4 gap-4 items-center' : 'grid grid-cols-[2fr_1.5fr_0.7fr_0.8fr] gap-3 items-center'
          }`}>
            {!isChainList ? (
              // Token table layout
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-gray-400 font-medium">
                    {index + 1}
                  </div>
                  <span className="font-semibold text-gray-900 text-sm lg:text-base">{item.name}</span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-sm lg:text-base">{item.value}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 text-sm" style={{ fontWeight: sortField === 'transactions' ? 'bold' : 'normal' }}>{item.transactions?.toLocaleString() || '-'}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 text-sm" style={{ fontWeight: sortField === 'fees' ? 'bold' : 'normal' }}>${item.fees?.toFixed(2) || '-'}</p>
                </div>
              </>
            ) : (
              // Chain table layout - more compact
              <>
                <div className="flex items-center">
                  <div className="w-5 text-xs text-gray-400 font-medium">
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChainLogo chainName={item.chainName || item.name} size="sm" />
                    <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm" style={{ fontWeight: sortField === 'value' ? 'bold' : 'normal' }}>{item.value}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 text-xs" style={{ fontWeight: sortField === 'transactions' ? 'bold' : 'normal' }}>{item.transactions?.toLocaleString() || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 text-xs" style={{ paddingRight: '8px', fontWeight: sortField === 'fees' ? 'bold' : 'normal' }}>${item.fees?.toFixed(2) || '-'}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopListCard;