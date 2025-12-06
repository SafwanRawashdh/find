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
  color = '#a855f7',
  showAxes = false,
  className = ''
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<IPricePoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{x: number, y: number} | null>(null);

  if (!data || data.length < 2) return (
    <div className="text-xs text-gray-600 font-mono">No history</div>
  );

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  const paddingY = showAxes ? 20 : 5;
  const paddingX = showAxes ? 45 : 5;
  
  const chartHeight = height - (showAxes ? 30 : 0);
  const range = maxPrice - minPrice || 1;

  const points = useMemo(() => {
    return data.map((point, index) => {
      const x = (index / (data.length - 1)) * (width - (showAxes ? paddingX : 0)) + (showAxes ? paddingX : 0);
      const normalizedPrice = (point.price - minPrice) / range;
      const y = chartHeight - (normalizedPrice * (chartHeight - paddingY * 2)) - paddingY;
      return { x, y, ...point };
    });
  }, [data, width, chartHeight, minPrice, range, showAxes]);

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

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
          <linearGradient id={`chartGradient-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Axes */}
        {showAxes && (
          <g className="text-[10px] select-none font-mono">
            {/* Y Axis Lines & Labels */}
            {[0, 0.5, 1].map(tick => {
              const y = chartHeight - (tick * (chartHeight - paddingY * 2)) - paddingY;
              const priceLabel = (minPrice + (tick * range)).toFixed(0);
              return (
                <g key={tick}>
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={width} 
                    y2={y} 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={paddingX - 8} 
                    y={y + 3} 
                    textAnchor="end" 
                    fill="rgba(255,255,255,0.4)"
                    className="text-[10px]"
                  >
                    ${priceLabel}
                  </text>
                </g>
              );
            })}
            
            {/* X Axis Labels */}
            <text 
              x={paddingX} 
              y={height - 8} 
              textAnchor="start" 
              fill="rgba(255,255,255,0.4)"
              className="text-[10px]"
            >
              {data[0].date.substring(5)}
            </text>
            <text 
              x={width} 
              y={height - 8} 
              textAnchor="end" 
              fill="rgba(255,255,255,0.4)"
              className="text-[10px]"
            >
              {data[data.length - 1].date.substring(5)}
            </text>
          </g>
        )}

        {/* Chart Area Fill */}
        <path d={areaPath} fill={`url(#chartGradient-${color.replace('#', '')})`} />

        {/* Chart Line */}
        <polyline 
          points={polylinePoints} 
          fill="none" 
          stroke={color} 
          strokeWidth={2.5} 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Interactive Points */}
        {points.map((p, i) => (
          <circle 
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredPoint?.date === p.date ? 5 : 3}
            fill={hoveredPoint?.date === p.date ? color : 'transparent'}
            stroke={color}
            strokeWidth={2}
            className="cursor-crosshair transition-all"
            style={{ opacity: hoveredPoint?.date === p.date ? 1 : 0 }}
            onMouseEnter={() => {
              setHoveredPoint({ date: p.date, price: p.price });
              setHoverPos({ x: p.x, y: p.y });
            }}
          />
        ))}

        {/* Hover Indicator */}
        {hoverPos && (
          <circle 
            cx={hoverPos.x}
            cy={hoverPos.y}
            r={6}
            fill="transparent"
            stroke={color}
            strokeWidth={2}
            className="animate-ping"
            style={{ opacity: 0.5 }}
          />
        )}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && hoverPos && (
        <div 
          className="absolute z-20 glass rounded-lg py-2 px-3 pointer-events-none transform -translate-x-1/2 shadow-xl"
          style={{ left: hoverPos.x, top: hoverPos.y - 50 }}
        >
          <div className="font-bold text-white text-sm">${hoveredPoint.price.toFixed(2)}</div>
          <div className="text-gray-400 text-[10px] font-mono">{hoveredPoint.date}</div>
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2"
            style={{ backgroundColor: 'rgba(26, 26, 37, 0.9)' }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default PriceHistoryChart;
