import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface HeatMapDataPoint {
  x: string;
  y: string;
  value: number;
  label?: string;
}

interface HeatMapProps {
  data: HeatMapDataPoint[];
  width?: number | string;
  height?: number;
  cellSize?: number;
  colors?: {
    min: string;
    max: string;
    empty: string;
  };
  xLabels?: string[];
  yLabels?: string[];
  showGrid?: boolean;
  showValues?: boolean;
  tooltip?: {
    enabled?: boolean;
    formatter?: (value: number, x: string, y: string) => string;
  };
  title?: string;
  subtitle?: string;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  valueRange?: [number, number];
}

export const HeatMap: React.FC<HeatMapProps> = ({
  data,
  width = '100%',
  height = 400,
  cellSize = 40,
  colors = {
    min: '#dbeafe',
    max: '#1e40af',
    empty: '#f9fafb',
  },
  xLabels,
  yLabels,
  showGrid = true,
  showValues = false,
  tooltip = { enabled: true },
  title,
  subtitle,
  margin = { top: 20, right: 20, bottom: 40, left: 60 },
  valueRange,
}) => {
  // Get unique x and y values from data
  const getXValues = () => {
    if (xLabels) return xLabels;
    const xSet = new Set(data.map(d => d.x));
    return Array.from(xSet).sort();
  };

  const getYValues = () => {
    if (yLabels) return yLabels;
    const ySet = new Set(data.map(d => d.y));
    return Array.from(ySet).sort();
  };

  const xValues = getXValues();
  const yValues = getYValues();

  // Calculate value range
  const getValueRange = (): [number, number] => {
    if (valueRange) return valueRange;

    const values = data.map(d => d.value).filter(v => v !== null && v !== undefined);
    if (values.length === 0) return [0, 1];

    const min = Math.min(...values);
    const max = Math.max(...values);
    return [min, max];
  };

  const [minValue, maxValue] = getValueRange();

  // Interpolate color based on value
  const getColor = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return colors.empty;
    if (value === 0) return colors.empty;

    const normalizedValue = (value - minValue) / (maxValue - minValue);
    return interpolateColor(colors.min, colors.max, normalizedValue);
  };

  // Color interpolation function
  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    if (!c1 || !c2) return color1;

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Find data point for given x, y coordinates
  const findDataPoint = (x: string, y: string): HeatMapDataPoint | undefined => {
    return data.find(d => d.x === x && d.y === y);
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, x, y }: any) => {
    if (!active || !tooltip.enabled) return null;

    const dataPoint = findDataPoint(x, y);
    if (!dataPoint) return null;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">
          {dataPoint.label || `${dataPoint.y} - ${dataPoint.x}`}
        </p>
        <p className="text-sm text-gray-600">
          数值: {tooltip.formatter ? tooltip.formatter(dataPoint.value, x, y) : dataPoint.value}
        </p>
      </div>
    );
  };

  // Create grid data for visualization
  const createGridData = () => {
    const gridData = [];
    yValues.forEach((y, yIndex) => {
      xValues.forEach((x, xIndex) => {
        const dataPoint = findDataPoint(x, y);
        gridData.push({
          x,
          y,
          value: dataPoint?.value || null,
          xIndex,
          yIndex,
          color: getColor(dataPoint?.value),
        });
      });
    });
    return gridData;
  };

  const gridData = createGridData();

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="relative">
        {/* SVG-based HeatMap */}
        <svg width={width} height={height} className="overflow-visible">
          {/* Define gradient for legend */}
          <defs>
            <linearGradient id="heatMapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.min} />
              <stop offset="100%" stopColor={colors.max} />
            </linearGradient>
          </defs>

          {/* Grid */}
          {showGrid && (
            <g>
              {/* Vertical lines */}
              {xValues.map((_, index) => (
                <line
                  key={`vline-${index}`}
                  x1={margin.left + index * cellSize}
                  y1={margin.top}
                  x2={margin.left + index * cellSize}
                  y2={margin.top + yValues.length * cellSize}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              {/* Horizontal lines */}
              {yValues.map((_, index) => (
                <line
                  key={`hline-${index}`}
                  x1={margin.left}
                  y1={margin.top + index * cellSize}
                  x2={margin.left + xValues.length * cellSize}
                  y2={margin.top + index * cellSize}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}

          {/* Heatmap cells */}
          {gridData.map((cell, index) => (
            <g key={`cell-${index}`}>
              <rect
                x={margin.left + cell.xIndex * cellSize}
                y={margin.top + cell.yIndex * cellSize}
                width={cellSize}
                height={cellSize}
                fill={cell.color}
                stroke="#ffffff"
                strokeWidth="2"
                className="hover:stroke-blue-500 hover:stroke-width-3 cursor-pointer transition-all"
              />
              {showValues && cell.value !== null && cell.value !== undefined && (
                <text
                  x={margin.left + cell.xIndex * cellSize + cellSize / 2}
                  y={margin.top + cell.yIndex * cellSize + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill={cell.value > (maxValue + minValue) / 2 ? 'white' : '#374151'}
                >
                  {cell.value}
                </text>
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {xValues.map((label, index) => (
            <text
              key={`xlabel-${index}`}
              x={margin.left + index * cellSize + cellSize / 2}
              y={margin.top + yValues.length * cellSize + 20}
              textAnchor="middle"
              fontSize={12}
              fill="#6b7280"
            >
              {label}
            </text>
          ))}

          {/* Y-axis labels */}
          {yValues.map((label, index) => (
            <text
              key={`ylabel-${index}`}
              x={margin.left - 10}
              y={margin.top + index * cellSize + cellSize / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={12}
              fill="#6b7280"
            >
              {label}
            </text>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center mt-4 space-x-4">
          <span className="text-sm text-gray-600">低</span>
          <div className="w-32 h-4 rounded" style={{ background: `linear-gradient(to right, ${colors.min}, ${colors.max})` }}></div>
          <span className="text-sm text-gray-600">高</span>
        </div>

        {/* Custom tooltip overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Tooltip will be positioned here based on mouse events */}
        </div>
      </div>
    </div>
  );
};

// Specialized HeatMap variants
export const ActivityHeatMap: React.FC<Omit<HeatMapProps, 'title' | 'colors'>> = (props) => (
  <HeatMap
    {...props}
    title="活动热力图"
    colors={{
      min: '#fef3c7',
      max: '#f59e0b',
      empty: '#f9fafb',
    }}
  />
);

export const PerformanceHeatMap: React.FC<Omit<HeatMapProps, 'title' | 'colors'>> = (props) => (
  <HeatMap
    {...props}
    title="表现热力图"
    colors={{
      min: '#dcfce7',
      max: '#16a34a',
      empty: '#f9fafb',
    }}
  />
);

export const CorrelationHeatMap: React.FC<Omit<HeatMapProps, 'title' | 'colors' | 'showValues'>> = (props) => (
  <HeatMap
    {...props}
    title="相关性热力图"
    colors={{
      min: '#fee2e2',
      max: '#dc2626',
      empty: '#f9fafb',
    }}
    showValues
    valueRange={[-1, 1]}
  />
);