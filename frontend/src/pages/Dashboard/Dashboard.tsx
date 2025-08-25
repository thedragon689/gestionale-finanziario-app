import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  Alert,
  Button,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  People,
  AccountBalanceWallet,
  Refresh,
  SwapHoriz as TransactionIcon,
  Assessment as ReportIcon,
  Business as EnterpriseIcon,
  Settings as SettingsIcon,
  SmartToy,
  Psychology,
  Security,
  AutoMode,
  Assessment,
  Euro,
  ShowChart,
  Logout,
  ShowChart as EquitiesIcon,
  AccountBalance as BondsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import logo
import logo from '../../assets/logo.png';

// Services
import { dashboardService } from '../../services/dashboardService';

// Components
import StatCard from '../../components/Dashboard/StatCard';
import ChartCard, { ChartType } from '../../components/Dashboard/ChartCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import CryptoPriceWidget from '../../components/Dashboard/CryptoPriceWidget';
import SystemStatus from '../../components/Dashboard/SystemStatus';
import { AINewsWidget, EnhancedBalanceChart, EnhancedPortfolioChart, EnhancedTransactionChart } from '../../components/Dashboard';

// Enhanced Chart components
import {
  BalanceData,
  TransactionData,
  PortfolioData
} from '../../components/Dashboard/EnhancedCharts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Chart type states
  const [balanceChartType, setBalanceChartType] = useState<ChartType>('line');
  const [transactionChartType, setTransactionChartType] = useState<ChartType>('bar');
  const [portfolioChartType, setPortfolioChartType] = useState<ChartType>('pie');

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

  const handleNavigation = (path: string) => {
    if (path === '/login') {
      // Logout: pulisci i dati di autenticazione
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate(path);
    }
  };

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
      <Box sx={{ py: 4 }}>
        {/* Header principale con logo e titolo */}
        <Paper
          elevation={3}
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            p: 3,
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={logo}
                alt="Logo Gestionale Finanziario"
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              />
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Dashboard Gestionale Finanziario
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Sistema AI Avanzato - Controllo Completo delle Operazioni
                </Typography>
              </Box>
            </Box>
            <Box>
              <Tooltip title="Logout">
                <IconButton onClick={() => handleNavigation('/login')} sx={{ color: 'white', mr: 2 }}>
                  <Logout />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                Aggiorna
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Statistiche principali */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3} xl={2.4}>
            <StatCard
              title="Saldo Totale"
              value="€ 125.430,50"
              icon={<AccountBalance />}
              color="primary.main"
              trend="+2.5%"
              trendDirection="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} xl={2.4}>
            <StatCard
              title="Transazioni Oggi"
              value="47"
              icon={<TransactionIcon />}
              color="success.main"
              trend="+12%"
              trendDirection="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} xl={2.4}>
            <StatCard
              title="Clienti Attivi"
              value="1.247"
              icon={<People />}
              color="info.main"
              trend="+5.2%"
              trendDirection="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} xl={2.4}>
            <StatCard
              title="Crypto Assets"
              value="€ 23.450,00"
              icon={<AccountBalanceWallet />}
              color="warning.main"
              trend="-1.8%"
              trendDirection="down"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} xl={2.4}>
            <StatCard
              title="Fondi Gestiti"
              value="€ 2.1M"
              icon={<Euro />}
              color="secondary.main"
              trend="+8.3%"
              trendDirection="up"
            />
          </Grid>
        </Grid>

        {/* Navigazione rapida organizzata per categorie */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            🧭 Navigazione Rapida
          </Typography>
          
          {/* Categoria: Operazioni Bancarie */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalance /> Operazioni Bancarie
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3} xl={2.4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AccountBalance />}
                  onClick={() => handleNavigation('/accounts')}
                  sx={{ 
                    justifyContent: 'flex-start', 
                    p: { xs: 3, md: 2 }, 
                    height: { xs: 80, md: 60 },
                    fontSize: { xs: '1rem', md: '0.875rem' }
                  }}
                >
                  Conti Bancari
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3} xl={2.4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TransactionIcon />}
                  onClick={() => handleNavigation('/transactions')}
                  sx={{ 
                    justifyContent: 'flex-start', 
                    p: { xs: 3, md: 2 }, 
                    height: { xs: 80, md: 60 },
                    fontSize: { xs: '1rem', md: '0.875rem' }
                  }}
                >
                  Transazioni
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3} xl={2.4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<People />}
                  onClick={() => handleNavigation('/customers')}
                  sx={{ 
                    justifyContent: 'flex-start', 
                    p: { xs: 3, md: 2 }, 
                    height: { xs: 80, md: 60 },
                    fontSize: { xs: '1rem', md: '0.875rem' }
                  }}
                >
                  Clienti
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3} xl={2.4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ReportIcon />}
                  onClick={() => handleNavigation('/reports')}
                  sx={{ 
                    justifyContent: 'flex-start', 
                    p: { xs: 3, md: 2 }, 
                    height: { xs: 80, md: 60 },
                    fontSize: { xs: '1rem', md: '0.875rem' }
                  }}
                >
                  Report
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3} xl={2.4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assessment />}
                  onClick={() => handleNavigation('/rss')}
                  sx={{ 
                    justifyContent: 'flex-start', 
                    p: { xs: 3, md: 2 }, 
                    height: { xs: 80, md: 60 },
                    fontSize: { xs: '1rem', md: '0.875rem' }
                  }}
                >
                  RSS Feed
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Categoria: Investimenti e Crypto */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShowChart /> Investimenti e Crypto
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AccountBalanceWallet />}
                  onClick={() => handleNavigation('/crypto')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: 60 }}
                >
                  Crypto Wallets
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Euro />}
                  onClick={() => handleNavigation('/funds')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: 60 }}
                >
                  Fondi
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EquitiesIcon />}
                  onClick={() => handleNavigation('/equities')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: 60 }}
                >
                  Azioni
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BondsIcon />}
                  onClick={() => handleNavigation('/bonds')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: 60 }}
                >
                  Obbligazioni
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Security />}
                  onClick={() => handleNavigation('/insurance')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: 60 }}
                >
                  Assicurazioni
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Categoria: AI e Impostazioni */}
          <Box>
            <Typography variant="h6" color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Psychology /> Intelligenza Artificiale
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EnterpriseIcon />}
                  onClick={() => handleNavigation('/ai-enterprise')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: 60 }}
                >
                  AI Enterprise
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AutoMode />}
                  onClick={() => handleNavigation('/ai-agent')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: 60 }}
                >
                  AI Agent
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SmartToy />}
                  onClick={() => handleNavigation('/ai-advanced')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: 60 }}
                >
                  AI Avanzato
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={() => handleNavigation('/settings')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: 60 }}
                >
                  Impostazioni
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Grafici e Widget organizzati in griglia */}
        <Grid container spacing={3}>
          {/* Grafico principale - Trend Saldo */}
          <Grid item xs={12} lg={8} xl={9}>
            <ChartCard 
              title="📈 Trend Saldo - Analisi Evoluzione Patrimoniale" 
              loading={isLoading}
              chartTypes={['line', 'area', 'bar', 'scatter', 'ecg']}
              onChartTypeChange={setBalanceChartType}
              currentChartType={balanceChartType}
            >
              <EnhancedBalanceChart data={balanceData} chartType={balanceChartType} />
            </ChartCard>
          </Grid>
          
          {/* Widget Crypto in evidenza */}
          <Grid item xs={12} lg={4} xl={3}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🪙 Prezzi Crypto
              </Typography>
              <CryptoPriceWidget
                prices={dashboardData?.cryptoPrices || []}
                loading={isLoading}
              />
            </Paper>
          </Grid>
          
          {/* Grafici secondari in riga */}
          <Grid item xs={12} lg={6} xl={4}>
            <ChartCard 
              title="💳 Tipi di Transazione - Distribuzione Operazioni" 
              loading={isLoading}
              chartTypes={['bar', 'line', 'area', 'pie', 'ecg']}
              onChartTypeChange={setTransactionChartType}
              currentChartType={transactionChartType}
            >
              <EnhancedTransactionChart data={transactionData} chartType={transactionChartType} />
            </ChartCard>
          </Grid>
          
          <Grid item xs={12} lg={6} xl={4}>
            <ChartCard 
              title="🎯 Distribuzione Portfolio - Asset Allocation" 
              loading={isLoading}
              chartTypes={['pie', 'bar', 'line', 'area', 'ecg']}
              onChartTypeChange={setPortfolioChartType}
              currentChartType={portfolioChartType}
            >
              <EnhancedPortfolioChart data={portfolioData} chartType={portfolioChartType} />
            </ChartCard>
          </Grid>
          
          {/* Widget News AI e Transazioni Recenti */}
          <Grid item xs={12} lg={4} xl={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📰 News AI
              </Typography>
              <AINewsWidget maxNews={3} showAlerts={true} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} lg={8} xl={8}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                💸 Transazioni Recenti
              </Typography>
              <RecentTransactions
                transactions={dashboardData?.transactions || []}
                loading={isLoading}
              />
            </Paper>
          </Grid>
          
          {/* Status Sistema */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🔍 Status Sistema
              </Typography>
              <SystemStatus
                alerts={dashboardData?.systemAlerts || []}
                loading={isLoading}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
