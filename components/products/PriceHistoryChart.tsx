import React, { useMemo, useState } from 'react';
import { IPricePoint } from '../../types';

interface PriceHistoryChartProps {
  data: IPricePoint[];
  width?: number;
  height?: number;
  color?: string;
  showAxes?: boolean;
  className?: string;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ 
  data, 
  width = 200, 
  height = 50, 
  color = '#0ea5e9', // Brand blue
  showAxes = false,
  className = ''
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<IPricePoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{x: number, y: number} | null>(null);

  // If no data, return nothing or a placeholder
  if (!data || data.length < 2) return <div className="text-xs text-gray-400">No history available</div>;

  // 1. Calculate Min/Max for scaling
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  // Add some padding to the Y axis so the line isn't touching the edges
  const paddingY = showAxes ? 20 : 5;
  const paddingX = showAxes ? 40 : 5;
  
  const chartHeight = height - (showAxes ? 30 : 0); // Reserve bottom space for dates
  const range = maxPrice - minPrice || 1; // avoid divide by zero

  // 2. Generate Points
  const points = useMemo(() => {
    return data.map((point, index) => {
      const x = (index / (data.length - 1)) * (width - (showAxes ? paddingX : 0)) + (showAxes ? paddingX : 0);
      // Invert Y because SVG 0 is at top
      const normalizedPrice = (point.price - minPrice) / range;
      const y = chartHeight - (normalizedPrice * (chartHeight - paddingY * 2)) - paddingY;
      return { x, y, ...point };
    });
  }, [data, width, chartHeight, minPrice, range, showAxes]);

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Area Path (close the loop for fill)
  const areaPath = `
    ${points[0].x},${chartHeight} 
    ${polylinePoints} 
    ${points[points.length - 1].x},${chartHeight}
  `;

  return (
    <div className={`relative ${className}`} onMouseLeave={() => { setHoveredPoint(null); setHoverPos(null); }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        
        {/* Gradients */}
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Axes (Optional) */}
        {showAxes && (
          <g className="text-[10px] text-gray-400 select-none font-sans">
            {/* Y Axis Lines & Labels */}
            {[0, 0.5, 1].map(tick => {
              const y = chartHeight - (tick * (chartHeight - paddingY * 2)) - paddingY;
              const priceLabel = (minPrice + (tick * range)).toFixed(0);
              return (
                <g key={tick}>
                  <line x1={paddingX} y1={y} x2={width} y2={y} stroke="#f3f4f6" strokeDasharray="4 4" />
                  <text x={paddingX - 5} y={y + 3} textAnchor="end" fill="currentColor">${priceLabel}</text>
                </g>
              );
            })}
            
            {/* X Axis Labels (Start and End) */}
            <text x={paddingX} y={height - 10} textAnchor="start" fill="currentColor">{data[0].date.substring(5)}</text>
            <text x={width} y={height - 10} textAnchor="end" fill="currentColor">{data[data.length - 1].date.substring(5)}</text>
          </g>
        )}

        {/* Chart Area Fill */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Chart Line */}
        <polyline 
          points={polylinePoints} 
          fill="none" 
          stroke={color} 
          strokeWidth={2} 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Interactive Points (for Hover) */}
        {points.map((p, i) => (
          <circle 
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredPoint?.date === p.date ? 4 : 2}
            fill="white"
            stroke={color}
            strokeWidth={2}
            className="cursor-crosshair transition-all opacity-0 hover:opacity-100"
            onMouseEnter={(e) => {
              setHoveredPoint({ date: p.date, price: p.price });
              setHoverPos({ x: p.x, y: p.y });
            }}
          />
        ))}

        {/* Highlight Active Point */}
        {hoverPos && (
             <circle 
             cx={hoverPos.x}
             cy={hoverPos.y}
             r={5}
             fill={color}
             pointerEvents="none"
           />
        )}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && hoverPos && (
        <div 
          className="absolute z-10 bg-gray-900 text-white text-xs rounded py-1 px-2 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 shadow-lg"
          style={{ left: hoverPos.x, top: hoverPos.y }}
        >
          <div className="font-bold">${hoveredPoint.price.toFixed(2)}</div>
          <div className="text-gray-300 text-[10px]">{hoveredPoint.date}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default PriceHistoryChart;