import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import { ChartType } from './ChartCard';

// Data interfaces
export interface BalanceData {
  month: string;
  balance: number;
}

export interface TransactionData {
  type: string;
  count: number;
}

export interface PortfolioData {
  currency: string;
  percentage: number;
}

// Enhanced Balance Chart Component
interface EnhancedBalanceChartProps {
  data: BalanceData[];
  chartType: ChartType;
}

export const EnhancedBalanceChart: React.FC<EnhancedBalanceChartProps> = ({ data, chartType }) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value?.toLocaleString()}`, 'Balance']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke={colors[0]} 
                name="Balance"
                strokeWidth={2}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value?.toLocaleString()}`, 'Balance']} />
              <Legend />
              <Area
                type="monotone"
                dataKey="balance"
                fill={colors[0]}
                stroke={colors[0]}
                fillOpacity={0.6}
                name="Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value?.toLocaleString()}`, 'Balance']} />
              <Legend />
              <Bar dataKey="balance" fill={colors[0]} name="Balance" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value?.toLocaleString()}`, 'Balance']} />
              <Legend />
              <Scatter
                dataKey="balance"
                fill={colors[0]}
                name="Balance"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'ecg':
        // ECG-like chart with multiple lines for balance trend
        const ecgData = data.map((item, index) => ({
          ...item,
          balance: item.balance + Math.sin(index * 0.5) * 1000,
          trend: item.balance + Math.cos(index * 0.3) * 800,
          baseline: item.balance
        }));
        
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ecgData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'baseline' ? `€${value?.toLocaleString()}` : `€${value?.toLocaleString()}`,
                name === 'baseline' ? 'Balance Base' : name === 'trend' ? 'Trend' : 'ECG Pattern'
              ]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke={colors[0]} 
                name="Balance Base"
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="trend" 
                stroke={colors[1]} 
                name="Trend"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colors[1], strokeWidth: 1, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke={colors[2]} 
                name="ECG Pattern"
                strokeWidth={1}
                dot={{ fill: colors[2], strokeWidth: 1, r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value?.toLocaleString()}`, 'Balance']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke={colors[0]} 
                name="Balance"
                strokeWidth={2}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return renderChart();
};

// Enhanced Transaction Chart Component
interface EnhancedTransactionChartProps {
  data: TransactionData[];
  chartType: ChartType;
}

export const EnhancedTransactionChart: React.FC<EnhancedTransactionChartProps> = ({ data, chartType }) => {
  const colors = ['#82ca9d', '#8884d8', '#ffc658', '#ff7300'];

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={colors[0]} name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={colors[0]} 
                name="Transactions"
                strokeWidth={2}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                fill={colors[0]}
                stroke={colors[0]}
                fillOpacity={0.6}
                name="Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, count }) => `${type} ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Scatter dataKey="count" fill={colors[0]} name="Transactions" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'ecg':
        // ECG-like chart for transaction patterns
        const ecgTransactionData = data.map((item, index) => ({
          ...item,
          count: item.count + Math.sin(index * 0.8) * 5,
          trend: item.count + Math.cos(index * 0.6) * 3,
          baseline: item.count
        }));
        
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ecgTransactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'baseline' ? value : value,
                name === 'baseline' ? 'Transazioni Base' : name === 'trend' ? 'Trend' : 'Pattern ECG'
              ]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke={colors[0]} 
                name="Transazioni Base"
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="trend" 
                stroke={colors[1]} 
                name="Trend"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colors[1], strokeWidth: 1, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={colors[2]} 
                name="Pattern ECG"
                strokeWidth={1}
                dot={{ fill: colors[2], strokeWidth: 1, r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={colors[0]} name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return renderChart();
};

// Enhanced Portfolio Chart Component
interface EnhancedPortfolioChartProps {
  data: PortfolioData[];
  chartType: ChartType;
}

export const EnhancedPortfolioChart: React.FC<EnhancedPortfolioChartProps> = ({ data, chartType }) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', '#00ff00'];

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ currency, percentage }) => `${currency} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="currency" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
              <Bar dataKey="percentage" fill={colors[0]} name="Percentage" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="currency" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke={colors[0]} 
                name="Percentage"
                strokeWidth={2}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="currency" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
              <Area
                type="monotone"
                dataKey="percentage"
                fill={colors[0]}
                stroke={colors[0]}
                fillOpacity={0.6}
                name="Percentage"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'ecg':
        // ECG-like chart for portfolio allocation trends
        const ecgPortfolioData = data.map((item, index) => ({
          ...item,
          percentage: item.percentage + Math.sin(index * 0.7) * 2,
          trend: item.percentage + Math.cos(index * 0.5) * 1.5,
          baseline: item.percentage
        }));
        
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ecgPortfolioData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="currency" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                `${value}%`,
                name === 'baseline' ? 'Allocazione Base' : name === 'trend' ? 'Trend' : 'Pattern ECG'
              ]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke={colors[0]} 
                name="Allocazione Base"
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="trend" 
                stroke={colors[1]} 
                name="Trend"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colors[1], strokeWidth: 1, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke={colors[2]} 
                name="Pattern ECG"
                strokeWidth={1}
                dot={{ fill: colors[2], strokeWidth: 1, r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ currency, percentage }) => `${currency} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return renderChart();
};
