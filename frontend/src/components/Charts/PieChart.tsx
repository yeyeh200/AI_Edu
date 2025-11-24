import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  width?: number | string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
  cx?: string | number;
  cy?: string | number;
  startAngle?: number;
  endAngle?: number;
  paddingAngle?: number;
  tooltip?: {
    enabled?: boolean;
    formatter?: (value: any, name: string) => [string, string];
  };
  legend?: {
    enabled?: boolean;
    verticalAlign?: 'top' | 'middle' | 'bottom';
    align?: 'left' | 'center' | 'right';
    layout?: 'horizontal' | 'vertical';
  };
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  title?: string;
  subtitle?: string;
  showLabels?: boolean;
  labelLine?: boolean;
  labelPosition?: 'inside' | 'outside' | 'center';
  animationBegin?: number;
  animationDuration?: number;
}

const COLORS = [
  '#3b82f6', // primary
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#6366f1', // indigo
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = '100%',
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
  colors = COLORS,
  cx = '50%',
  cy = '50%',
  startAngle = 0,
  endAngle = 360,
  paddingAngle = 0,
  tooltip = { enabled: true },
  legend = { enabled: true },
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  title,
  subtitle,
  showLabels = false,
  labelLine = true,
  labelPosition = 'outside',
  animationBegin = 0,
  animationDuration = 400,
  ...props
}) => {
  const defaultMargin = {
    top: title ? 40 : margin.top,
    right: margin.right,
    bottom: margin.bottom,
    left: margin.left,
  };

  // Custom label renderer
  const renderCustomizedLabel = (props: any) => {
    if (!showLabels) return null;

    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (labelPosition === 'center') {
      return (
        <text
          x={cx}
          y={cy}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
          fontWeight={600}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Prepare data with colors
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length],
  }));

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <ResponsiveContainer width={width} height={height}>
        <RechartsPieChart margin={defaultMargin} {...props}>
          <Pie
            data={chartData}
            cx={cx}
            cy={cy}
            labelLine={labelLine}
            label={renderCustomizedLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            startAngle={startAngle}
            endAngle={endAngle}
            paddingAngle={paddingAngle}
            animationBegin={animationBegin}
            animationDuration={animationDuration}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {/* Tooltip */}
          {tooltip.enabled && (
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number, name: string) => {
                const percentage = ((value / total) * 100).toFixed(1);
                return [`${value} (${percentage}%)`, name];
              }}
            />
          )}

          {/* Legend */}
          {legend.enabled && (
            <Legend
              verticalAlign={legend.verticalAlign}
              align={legend.align}
              layout={legend.layout}
              iconType="circle"
              wrapperStyle={{
                paddingTop: '10px',
              }}
              formatter={(value: string, entry: any) => (
                <span style={{ color: entry.color }}>
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      {showLabels && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {chartData.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-xs font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Predefined chart configurations for common use cases
export const DonutChart: React.FC<Omit<PieChartProps, 'innerRadius' | 'showLabels' | 'labelPosition'>> = (props) => (
  <PieChart
    {...props}
    innerRadius={60}
    showLabels
    labelPosition="center"
  />
);

export const SemiCircleChart: React.FC<Omit<PieChartProps, 'startAngle' | 'endAngle' | 'cx' | 'cy'>> = (props) => (
  <PieChart
    {...props}
    startAngle={180}
    endAngle={0}
    cx="50%"
    cy="80%"
    height={200}
  />
);

export const DistributionPieChart: React.FC<Omit<PieChartProps, 'showLabels' | 'colors'>> = (props) => (
  <PieChart
    {...props}
    showLabels
    colors={['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']}
    labelPosition="outside"
  />
);