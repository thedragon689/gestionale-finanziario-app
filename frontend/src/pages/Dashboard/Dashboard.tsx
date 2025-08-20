import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  People,
  AccountBalanceWallet,
} from '@mui/icons-material';

// Charts
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Services
import { dashboardService } from '../../services/dashboardService';

// Components
import StatCard from '../../components/Dashboard/StatCard';
import ChartCard from '../../components/Dashboard/ChartCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import CryptoPriceWidget from '../../components/Dashboard/CryptoPriceWidget';
import SystemStatus from '../../components/Dashboard/SystemStatus';
// Chart components
interface BalanceData {
  month: string;
  balance: number;
}

interface TransactionData {
  type: string;
  count: number;
}

interface PortfolioData {
  currency: string;
  percentage: number;
}

const BalanceLineChart = ({ data }: { data: BalanceData[] }) => (
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
        stroke="#8884d8" 
        name="Balance"
        strokeWidth={2}
        dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

const TransactionBarChart = ({ data }: { data: TransactionData[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="type" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#82ca9d" name="Transactions" />
    </BarChart>
  </ResponsiveContainer>
);

const PortfolioPieChart = ({ data }: { data: PortfolioData[] }) => (
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
          <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][index % 4]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);
// Mock data - replace with actual API calls

// Chart.js registration placeholder

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Errore nel caricamento dei dati del dashboard');
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load dashboard data
        </Alert>
      </Container>
    );
  }



  // Chart data in Recharts format
  const balanceData: BalanceData[] = [
    { month: 'Jan', balance: 100000 },
    { month: 'Feb', balance: 105000 },
    { month: 'Mar', balance: 110000 },
    { month: 'Apr', balance: 115000 },
    { month: 'May', balance: 120000 },
    { month: 'Jun', balance: 125000 },
  ];

  const transactionData: TransactionData[] = [
    { type: 'Deposits', count: 65 },
    { type: 'Withdrawals', count: 45 },
    { type: 'Transfers', count: 30 },
    { type: 'Payments', count: 25 },
  ];

  const portfolioData: PortfolioData[] = [
    { currency: 'EUR', percentage: 70 },
    { currency: 'USD', percentage: 20 },
    { currency: 'BTC', percentage: 7 },
    { currency: 'ETH', percentage: 3 },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Balance"
              value={`€${dashboardData?.stats?.totalBalance?.toLocaleString() || '0'}`}
              icon={<AccountBalance />}
              color="primary.main"
              trend={{ value: dashboardData?.stats?.monthlyGrowth || 0, isPositive: true }}
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Monthly Growth"
              value={`${dashboardData?.stats?.monthlyGrowth || 0}%`}
              icon={<TrendingUp />}
              color="success.main"
              trend={{ value: 2.1, isPositive: true }}
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Accounts"
              value={dashboardData?.stats?.activeAccounts || 0}
              icon={<People />}
              color="info.main"
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Transactions"
              value={dashboardData?.stats?.totalTransactions || 0}
              icon={<AccountBalanceWallet />}
              color="warning.main"
              loading={isLoading}
            />
          </Grid>
        </Grid>

        {/* Charts and Widgets */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <ChartCard title="Balance Trend" loading={isLoading}>
              <BalanceLineChart data={balanceData} />
            </ChartCard>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <CryptoPriceWidget
              prices={dashboardData?.cryptoPrices || []}
              loading={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <ChartCard title="Transaction Types" loading={isLoading}>
              <TransactionBarChart data={transactionData} />
            </ChartCard>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <ChartCard title="Portfolio Distribution" loading={isLoading}>
              <PortfolioPieChart data={portfolioData} />
            </ChartCard>
          </Grid>
          
          <Grid item xs={12} lg={8}>
            <RecentTransactions
              transactions={dashboardData?.transactions || []}
              loading={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <SystemStatus
              alerts={dashboardData?.systemAlerts || []}
              loading={isLoading}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
