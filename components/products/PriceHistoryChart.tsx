"use client";

import React, { useMemo } from "react";

interface PriceHistoryEntry {
  date: string;
  price: number;
}

interface PriceHistoryChartProps {
  data: PriceHistoryEntry[];
  width?: number;
  height?: number;
  color?: string;
  showAxes?: boolean;
}

export function PriceHistoryChart({
  data,
  width = 70,
  height = 30,
  color = "#22c55e",
  showAxes = false,
}: PriceHistoryChartProps) {
  const { pathD, areaD, minPrice, maxPrice } = useMemo(() => {
    if (!data || data.length < 2) {
      return { pathD: "", areaD: "", minPrice: 0, maxPrice: 0 };
    }

    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    const padding = showAxes ? 8 : 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.price - min) / range) * chartHeight;
      return { x, y };
    });

    const linePoints = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPoints = `${linePoints} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

    return {
      pathD: linePoints,
      areaD: areaPoints,
      minPrice: min,
      maxPrice: max,
    };
  }, [data, width, height, showAxes]);

  if (!data || data.length < 2) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center text-xs text-gray-500"
      >
        No data
      </div>
    );
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaD} fill={`url(#gradient-${color.replace("#", "")})`} />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Show price labels if axes enabled */}
      {showAxes && (
        <>
          <text x={4} y={12} className="text-[8px] fill-gray-500">
            ${maxPrice.toFixed(0)}
          </text>
          <text x={4} y={height - 4} className="text-[8px] fill-gray-500">
            ${minPrice.toFixed(0)}
          </text>
        </>
      )}
    </svg>
  );
}

export default PriceHistoryChart;
