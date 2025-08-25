import React from 'react';

interface ChartDataPoint {
  time: string;
  value: number;
}

interface LineChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  width?: number;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title, 
  height = 300, 
  width = 600 
}) => {
  console.log('LineChart received data:', data);
  
  if (!data || data.length === 0) {
    console.log('LineChart: No data available');
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  // Calculate dimensions and scales
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const valueRange = maxValue - minValue;
  
  console.log('LineChart calculations:', {
    maxValue,
    minValue,
    valueRange,
    chartWidth,
    chartHeight,
    margin
  });

  // Create SVG path for the line
  const createLinePath = () => {
    if (data.length < 2) return '';

    const points = data.map((point, index) => {
      const x = margin.left + (index / (data.length - 1)) * chartWidth;
      const y = margin.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Create area path for fill
  const createAreaPath = () => {
    if (data.length < 2) return '';

    const points = data.map((point, index) => {
      const x = margin.left + (index / (data.length - 1)) * chartWidth;
      const y = margin.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
      return `${x},${y}`;
    });

    const bottomY = margin.top + chartHeight;
    return `M ${margin.left},${bottomY} L ${points.join(' L ')} L ${margin.left + chartWidth},${bottomY} Z`;
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      )}
      
              <div className="relative w-full">
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Y-axis */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="#d1d5db"
            strokeWidth="2"
          />
          
          {/* X-axis */}
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="#d1d5db"
            strokeWidth="2"
          />
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, index) => {
            const value = minValue + tick * valueRange;
            const y = margin.top + chartHeight - tick * chartHeight;
            return (
              <g key={index}>
                <line
                  x1={margin.left - 5}
                  y1={y}
                  x2={margin.left}
                  y2={y}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
                <text
                  x={margin.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs text-gray-500"
                  fill="#6b7280"
                >
                  ${value.toLocaleString()}
                </text>
              </g>
            );
          })}
          
          {/* Area fill */}
          <path
            d={createAreaPath()}
            fill="url(#areaGradient)"
            opacity="0.3"
          />
          
          {/* Line */}
          <path
            d={createLinePath()}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = margin.left + (index / (data.length - 1)) * chartWidth;
            const y = margin.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  className="cursor-pointer hover:r-6 transition-all duration-200"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  opacity="0.3"
                  className="cursor-pointer"
                />
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = margin.left + (index / (data.length - 1)) * chartWidth;
            return (
              <text
                key={index}
                x={x}
                y={height - margin.bottom + 20}
                textAnchor="middle"
                className="text-xs text-gray-600"
                fill="#4b5563"
              >
                {point.time}
              </text>
            );
          })}
          
          {/* Gradients */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Daily Fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500/30 rounded"></div>
            <span>Trend Area</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
