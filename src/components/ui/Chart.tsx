import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface ChartDataPoint {
  time: string;
  value: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  type?: 'line' | 'area';
  height?: number;
}

const Chart: React.FC<ChartProps> = ({ 
  data, 
  title, 
  type = 'area',
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  // Format the data for Recharts
  const chartData = data.map((point, index) => ({
    name: point.time,
    value: point.value,
    index
  }));

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  
  // Calculate ticks for debugging
  const tickCount = Math.ceil(maxValue / 1000) + 1;
  const calculatedTicks = Array.from({ length: tickCount }, (_, i) => i * 1000);
  
  console.log('Chart calculations:', {
    maxValue,
    minValue,
    tickCount,
    calculatedTicks,
    data: data.map(d => ({ time: d.time, value: d.value }))
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      )}
      
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#516ad6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#516ad6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                domain={[0, 12000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#516ad6"
                strokeWidth={3}
                fill="url(#colorValue)"
                fillOpacity={0.6}
                dot={false}
                activeDot={{ r: 6, stroke: '#516ad6', strokeWidth: 2, fill: '#516ad6' }}
              />
            </AreaChart>
          ) : (
            <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                domain={[0, 12000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#516ad6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, stroke: '#516ad6', strokeWidth: 2, fill: '#516ad6' }}
              />
            </RechartsLineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#516ad6' }}></div>
            <span>Daily Fees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
