import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
  maxValue?: number;
  width?: number | string;
  height?: number;
  title?: string;
  subtitle?: string;
  unit?: string;
  thresholds?: {
    good: number;
    warning: number;
    critical: number;
  };
  colors?: {
    good: string;
    warning: string;
    critical: string;
    background: string;
  };
  showValue?: boolean;
  showScale?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  animationBegin?: number;
  animationDuration?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  maxValue = 100,
  width = '100%',
  height = 200,
  title,
  subtitle,
  unit = '',
  thresholds = {
    good: 80,
    warning: 60,
    critical: 40,
  },
  colors = {
    good: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    background: '#e5e7eb',
  },
  showValue = true,
  showScale = true,
  innerRadius = 60,
  outerRadius = 80,
  startAngle = 180,
  endAngle = 0,
  animationBegin = 0,
  animationDuration = 800,
}) => {
  // Validate and calculate percentage safely
  const safeValue = isNaN(value) || !isFinite(value) ? 0 : Number(value);
  const safeMaxValue = isNaN(maxValue) || !isFinite(maxValue) || maxValue === 0 ? 1 : Number(maxValue);
  const percentage = Math.min((safeValue / safeMaxValue) * 100, 100);
  const angle = startAngle + (endAngle - startAngle) * (percentage / 100);

  // Determine color based on value
  const getGaugeColor = (val: number) => {
    if (val >= thresholds.good) return colors.good;
    if (val >= thresholds.warning) return colors.warning;
    return colors.critical;
  };

  // Create data for the gauge
  const createGaugeData = () => {
    const data = [];

    // Background arc
    data.push({
      name: 'background',
      value: maxValue,
      fill: colors.background,
    });

    // Value arc
    if (value > 0) {
      data.push({
        name: 'value',
        value: value,
        fill: getGaugeColor(percentage),
      });
    }

    return data;
  };

  // Create scale markers
  const createScaleMarkers = () => {
    if (!showScale) return null;

    const markers = [];
    const steps = 5;

    for (let i = 0; i <= steps; i++) {
      const markerValue = (maxValue / steps) * i;
      const markerAngle = startAngle + (endAngle - startAngle) * (i / steps);
      const markerColor = getGaugeColor(markerValue);

      markers.push({
        value: markerValue,
        angle: markerAngle,
        color: markerColor,
      });
    }

    return markers;
  };

  const gaugeData = createGaugeData();
  const scaleMarkers = createScaleMarkers();

  // Render custom labels for scale markers
  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius } = props;

    // Only render labels for scale markers
    if (showScale && scaleMarkers) {
      return scaleMarkers.map((marker, index) => {
        const RADIAN = Math.PI / 180;
        const radius = (outerRadius || 80) + 10;
        const x = (cx || 0) + radius * Math.cos(-marker.angle * RADIAN);
        const y = (cy || 0) + radius * Math.sin(-marker.angle * RADIAN);

        // Skip if coordinates are invalid
        if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
          return null;
        }

        return (
          <text
            key={`scale-${index}`}
            x={x}
            y={y}
            fill="#6b7280"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fontWeight={500}
          >
            {Math.round(marker.value)}
          </text>
        );
      });
    }

    return null;
  };

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4 text-center">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="relative">
        <ResponsiveContainer width={width} height={height}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="70%"
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={0}
              dataKey="value"
              animationBegin={animationBegin}
              animationDuration={animationDuration}
            >
              {gaugeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  stroke={entry.name === 'background' ? 'none' : entry.fill}
                  strokeWidth={entry.name === 'value' ? 2 : 0}
                />
              ))}
            </Pie>

            {/* Custom scale markers */}
            {renderCustomLabel({
              cx: '50%',
              cy: '70%',
              midAngle: 0,
              innerRadius,
              outerRadius,
            })}
          </PieChart>
        </ResponsiveContainer>

        {/* Center value display */}
        {showValue && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ top: '45%' }}
          >
            <div className="text-3xl font-bold text-gray-900">
              {safeValue.toFixed(1)}
              {unit && <span className="text-lg text-gray-600 ml-1">{unit}</span>}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {percentage.toFixed(1)}%
            </div>
            <div
              className="mt-2 px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: getGaugeColor(percentage) }}
            >
              {percentage >= thresholds.good ? '优秀' :
               percentage >= thresholds.warning ? '良好' :
               percentage >= thresholds.critical ? '一般' : '需改进'}
            </div>
          </div>
        )}
      </div>

      {/* Legend/Threshold indicators */}
      {showScale && (
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.critical }}
            />
            <span className="text-xs text-gray-600">需改进 ({thresholds.critical}分以下)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.warning }}
            />
            <span className="text-xs text-gray-600">一般 ({thresholds.warning}-{thresholds.good}分)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.good }}
            />
            <span className="text-xs text-gray-600">优秀 ({thresholds.good}分以上)</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized gauge variants
export const PerformanceGauge: React.FC<Omit<GaugeChartProps, 'title' | 'thresholds'>> = (props) => (
  <GaugeChart
    {...props}
    title="教学表现评分"
    thresholds={{
      good: 85,
      warning: 70,
      critical: 50,
    }}
    unit="分"
  />
);

export const ParticipationGauge: React.FC<Omit<GaugeChartProps, 'title' | 'thresholds' | 'maxValue' | 'unit'>> = (props) => (
  <GaugeChart
    {...props}
    title="参与率"
    maxValue={100}
    thresholds={{
      good: 90,
      warning: 75,
      critical: 60,
    }}
    unit="%"
  />
);

export const SatisfactionGauge: React.FC<Omit<GaugeChartProps, 'title' | 'thresholds'>> = (props) => (
  <GaugeChart
    {...props}
    title="满意度评分"
    thresholds={{
      good: 4.0,
      warning: 3.0,
      critical: 2.0,
    }}
    maxValue={5.0}
    unit=""
  />
);