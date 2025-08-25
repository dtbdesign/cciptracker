import React from 'react';

interface ChartDataPoint {
  time: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  type: 'area' | 'bar';
  data: ChartDataPoint[];
  noBackground?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, type, data, noBackground = false }) => {
  // Handle empty data or all zero values
  if (!data || data.length === 0) {
    return (
      <div className={`${noBackground ? '' : 'bg-white rounded-xl p-4 lg:p-6'}`}>
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className="h-48 lg:h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  console.log('ChartCard - maxValue:', maxValue, 'data:', data);
  
  // If all values are 0, set a default height
  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 20; // 20px minimum height for zero values
    const height = Math.max((value / maxValue) * 100, 5); // Minimum 5% height
    console.log(`Bar height for ${value}: ${height}%`);
    return height;
  };
  
  return (
    <div className={`${noBackground ? '' : 'bg-white rounded-xl p-4 lg:p-6'}`}>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      
      <div className="h-48 lg:h-64 flex items-end justify-between space-x-1">
        {data.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            {type === 'bar' ? (
              <div
                className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                style={{ 
                  height: `${getBarHeight(point.value)}%`,
                  minHeight: '4px',
                  border: '1px solid #3b82f6'
                }}
                title={`${point.time}: ${point.value.toLocaleString()}`}
              />
            ) : (
              <div className="w-full relative">
                <div
                  className="w-full bg-gradient-to-t from-blue-500/30 to-blue-500/10 rounded-t-sm"
                  style={{ height: `${getBarHeight(point.value)}%` }}
                />
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-blue-500 rounded"
                  style={{ transform: `translateY(${100 - getBarHeight(point.value)}%)` }}
                />
              </div>
            )}
            <span className="text-xs text-gray-500 mt-2 text-center">{point.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartCard;