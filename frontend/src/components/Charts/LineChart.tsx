import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number | string;
  height?: number;
  lines?: Array<{
    dataKey: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: boolean | object;
    activeDot?: boolean | object;
    name?: string;
    type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter';
  }>;
  areas?: Array<{
    dataKey: string;
    fill?: string;
    stroke?: string;
    fillOpacity?: number;
    name?: string;
    type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter';
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
  showArea?: boolean;
  gradient?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = '100%',
  height = 300,
  lines = [{ dataKey: 'value', stroke: '#3b82f6' }],
  areas = [],
  xAxis = { dataKey: 'name' },
  yAxis = {},
  grid = { strokeDasharray: '3 3' },
  tooltip = { enabled: true },
  legend = { enabled: true },
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  title,
  subtitle,
  showArea = false,
  gradient = false,
  ...props
}) => {
  const defaultMargin = {
    top: title ? 40 : margin.top,
    right: margin.right,
    bottom: margin.bottom,
    left: margin.left,
  };

  const renderGradient = (color: string, id: string) => {
    if (!gradient) return null;

    return (
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
    );
  };

  const ChartComponent = showArea ? AreaChart : RechartsLineChart;

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <ResponsiveContainer width={width} height={height}>
        <ChartComponent
          data={data}
          margin={defaultMargin}
          {...props}
        >
          {/* Gradients */}
          {gradient && lines.map((line, index) => (
            renderGradient(line.stroke || '#3b82f6', `gradient-${index}`)
          ))}

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
              iconType="line"
              wrapperStyle={{
                paddingTop: '10px',
              }}
            />
          )}

          {/* Areas */}
          {showArea && areas.map((area, index) => (
            <Area
              key={`area-${index}`}
              type={area.type || 'monotone'}
              dataKey={area.dataKey}
              stroke={area.stroke}
              fill={gradient ? `url(#gradient-${index})` : (area.fill || '#3b82f6')}
              fillOpacity={area.fillOpacity || 0.3}
              name={area.name}
            />
          ))}

          {/* Lines */}
          {lines.map((line, index) => (
            <Line
              key={`line-${index}`}
              type={line.type || 'monotone'}
              dataKey={line.dataKey}
              stroke={line.stroke || '#3b82f6'}
              strokeWidth={line.strokeWidth || 2}
              dot={line.dot}
              activeDot={line.activeDot}
              name={line.name}
              fill={gradient ? `url(#gradient-${index})` : undefined}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

// Predefined chart configurations for common use cases
export const TrendChart: React.FC<Omit<LineChartProps, 'lines' | 'showArea'>> = (props) => (
  <LineChart
    {...props}
    lines={[
      { dataKey: 'value', stroke: '#3b82f6', strokeWidth: 2 },
      { dataKey: 'target', stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }
    ]}
    showArea
    gradient
  />
);

export const PerformanceChart: React.FC<Omit<LineChartProps, 'lines' | 'areas'>> = (props) => (
  <LineChart
    {...props}
    lines={[
      { dataKey: 'actual', stroke: '#3b82f6', name: '实际值' },
      { dataKey: 'average', stroke: '#f59e0b', name: '平均值' },
      { dataKey: 'target', stroke: '#10b981', name: '目标值' }
    ]}
  />
);

export const ComparisonChart: React.FC<Omit<LineChartProps, 'lines'>> = (props) => (
  <LineChart
    {...props}
    lines={[
      { dataKey: 'series1', stroke: '#3b82f6', name: '系列 1' },
      { dataKey: 'series2', stroke: '#ef4444', name: '系列 2' },
      { dataKey: 'series3', stroke: '#10b981', name: '系列 3' }
    ]}
  />
);