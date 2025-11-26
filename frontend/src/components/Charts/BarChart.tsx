import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface BarChartProps {
  data: DataPoint[];
  width?: number | string;
  height?: number;
  bars?: Array<{
    dataKey: string;
    fill?: string;
    name?: string;
    radius?: [number, number, number, number];
  }>;
  xAxis?: {
    dataKey?: string;
    stroke?: string;
    fontSize?: number;
    angle?: number;
    textAnchor?: 'start' | 'middle' | 'end';
  };
  yAxis?: {
    stroke?: string;
    fontSize?: number;
    domain?: [number | string, number | string];
  };
  grid?: {
    strokeDasharray?: string;
    stroke?: string;
  };
  tooltip?: {
    enabled?: boolean;
    formatter?: (value: any, name: string) => [string, string];
    labelFormatter?: (label: any) => string;
  };
  legend?: {
    enabled?: boolean;
    verticalAlign?: 'top' | 'middle' | 'bottom';
    align?: 'left' | 'center' | 'right';
  };
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  title?: string;
  subtitle?: string;
  layout?: 'horizontal' | 'vertical';
  stackId?: string;
  colors?: string[];
  showDataLabels?: boolean;
  dataLabelPosition?: 'top' | 'center' | 'bottom';
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = '100%',
  height = 300,
  bars = [{ dataKey: 'value', fill: '#3b82f6' }],
  xAxis = { dataKey: 'name' },
  yAxis = {},
  grid = { strokeDasharray: '3 3' },
  tooltip = { enabled: true },
  legend = { enabled: true },
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  title,
  subtitle,
  layout = 'vertical',
  stackId,
  colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
  showDataLabels = false,
  dataLabelPosition = 'top',
  ...props
}) => {
  // Validate and sanitize data
  const sanitizedData = (data || []).map(item => {
    const sanitizedItem = { ...item };
    // Ensure all numeric values are finite numbers
    Object.keys(sanitizedItem).forEach(key => {
      const value = sanitizedItem[key];
      if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
        sanitizedItem[key] = 0;
      }
    });
    return sanitizedItem;
  });

  const defaultMargin = {
    top: title ? 40 : margin.top,
    right: margin.right,
    bottom: margin.bottom,
    left: margin.left,
  };

  // Custom label component
  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value } = props;

    if (!showDataLabels) return null;

    // Validate coordinates
    const safeX = isNaN(x) || !isFinite(x) ? 0 : x;
    const safeY = isNaN(y) || !isFinite(y) ? 0 : y;
    const safeWidth = isNaN(width) || !isFinite(width) ? 0 : width;
    const safeHeight = isNaN(height) || !isFinite(height) ? 0 : height;

    const textAnchor = dataLabelPosition === 'center' ? 'middle' : 'middle';
    const dominantBaseline = dataLabelPosition === 'top' ? 'auto' :
                           dataLabelPosition === 'center' ? 'middle' : 'hanging';

    let yPos = safeY;
    if (dataLabelPosition === 'top') {
      yPos = safeY - 5;
    } else if (dataLabelPosition === 'center') {
      yPos = safeY + safeHeight / 2;
    } else {
      yPos = safeY + safeHeight + 15;
    }

    return (
      <text
        x={safeX + safeWidth / 2}
        y={yPos}
        fill="#374151"
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fontSize={12}
        fontWeight={600}
      >
        {value}
      </text>
    );
  };

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <ResponsiveContainer width={width} height={height}>
        <RechartsBarChart
          data={sanitizedData}
          margin={defaultMargin}
          layout={layout}
          {...props}
        >
          {/* Grid */}
          <CartesianGrid
            strokeDasharray={grid.strokeDasharray}
            stroke={grid.stroke || '#e5e7eb'}
          />

          {/* X Axis */}
          <XAxis
            dataKey={xAxis.dataKey || 'name'}
            stroke={xAxis.stroke || '#6b7280'}
            fontSize={xAxis.fontSize || 12}
            angle={xAxis.angle}
            textAnchor={xAxis.textAnchor}
          />

          {/* Y Axis */}
          <YAxis
            stroke={yAxis.stroke || '#6b7280'}
            fontSize={yAxis.fontSize || 12}
            domain={yAxis.domain}
          />

          {/* Tooltip */}
          {tooltip.enabled && (
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={tooltip.formatter}
              labelFormatter={tooltip.labelFormatter}
            />
          )}

          {/* Legend */}
          {legend.enabled && (
            <Legend
              verticalAlign={legend.verticalAlign}
              align={legend.align}
              iconType="rect"
              wrapperStyle={{
                paddingTop: '10px',
              }}
            />
          )}

          {/* Bars */}
          {bars.map((bar, index) => (
            <Bar
              key={`bar-${index}`}
              dataKey={bar.dataKey}
              fill={bar.fill || colors[index % colors.length]}
              name={bar.name}
              radius={bar.radius}
              stackId={stackId}
              label={renderCustomizedLabel}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Predefined chart configurations for common use cases
export const ComparisonBarChart: React.FC<Omit<BarChartProps, 'bars'>> = (props) => (
  <BarChart
    {...props}
    bars={[
      { dataKey: 'series1', fill: '#3b82f6', name: '系列 1' },
      { dataKey: 'series2', fill: '#ef4444', name: '系列 2' }
    ]}
  />
);

export const RankingChart: React.FC<Omit<BarChartProps, 'bars' | 'layout'>> = (props) => (
  <BarChart
    {...props}
    layout="horizontal"
    bars={[{ dataKey: 'value', fill: '#3b82f6', radius: [0, 8, 8, 0] }]}
    dataLabelPosition="center"
  />
);

export const StackedBarChart: React.FC<Omit<BarChartProps, 'bars' | 'stackId'>> = (props) => (
  <BarChart
    {...props}
    stackId="stack"
    bars={[
      { dataKey: 'category1', fill: '#3b82f6', name: '类别 1' },
      { dataKey: 'category2', fill: '#ef4444', name: '类别 2' },
      { dataKey: 'category3', fill: '#10b981', name: '类别 3' }
    ]}
  />
);

export const DistributionChart: React.FC<Omit<BarChartProps, 'bars' | 'colors'>> = (props) => (
  <BarChart
    {...props}
    colors={['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe']}
    bars={[{ dataKey: 'count', fill: '#3b82f6', radius: [4, 4, 0, 0] }]}
    showDataLabels
  />
);