import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | '';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend }) => {
  return (
    <div className="bg-white rounded-xl p-4 lg:p-6 hover:bg-gray-50 transition-colors duration-300">
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-2xl lg:text-3xl font-bold metric-value" style={{ color: '#4A6BDD' }}>{value}</p>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;