import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  Download,
  FilterList,
  DateRange,
  AccountBalance,
  Payment,
  People,
  Euro,
} from '@mui/icons-material';

// Charts
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Services
import { reportService } from '../../services/reportService';
// Chart components
interface ChartDataPoint {
  month: string;
  transactions: number;
  amount: number;
}

interface CustomerDataPoint {
  type: string;
  count: number;
  percentage: number;
}

const TransactionLineChart = ({ title, data }: { title: string; data: ChartDataPoint[] }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="transactions" stroke="#8884d8" name="Transazioni" />
          <Line type="monotone" dataKey="amount" stroke="#82ca9d" name="Importo (€)" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const CustomerPieChart = ({ title, data }: { title: string; data: CustomerDataPoint[] }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const TransactionBarChart = ({ title, data }: { title: string; data: ChartDataPoint[] }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="transactions" fill="#8884d8" name="Transazioni" />
          <Bar dataKey="amount" fill="#82ca9d" name="Importo (€)" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('financial');
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-31');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [financialData, setFinancialData] = useState<any>(null);
  const [transactionData, setTransactionData] = useState<ChartDataPoint[]>([]);
  const [customerData, setCustomerData] = useState<CustomerDataPoint[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);

  // Load report data
  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        const [financial, transactions, customers, top] = await Promise.all([
          reportService.getFinancialData(),
          reportService.getTransactionData(),
          reportService.getCustomerData(),
          reportService.getTopCustomers(),
        ]);
        
        setFinancialData(financial);
        setTransactionData(transactions);
        setCustomerData(customers);
        setTopCustomers(top);
        setError(null);
      } catch (err) {
        setError('Errore nel caricamento dei dati del report');
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography variant="h6">Caricamento report...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Report e Analytics
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Report e Analytics
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo Report</InputLabel>
                <Select
                  value={reportType}
                  label="Tipo Report"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="financial">Report Finanziario</MenuItem>
                  <MenuItem value="transactions">Report Transazioni</MenuItem>
                  <MenuItem value="customers">Report Clienti</MenuItem>
                  <MenuItem value="risk">Report Rischio</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Periodo</InputLabel>
                <Select
                  value={period}
                  label="Periodo"
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <MenuItem value="week">Settimana</MenuItem>
                  <MenuItem value="month">Mese</MenuItem>
                  <MenuItem value="quarter">Trimestre</MenuItem>
                  <MenuItem value="year">Anno</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Data Inizio"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Data Fine"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  sx={{ flex: 1 }}
                >
                  Genera Report
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                >
                  Esporta
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Financial Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AccountBalance color="primary" />
                  <Typography color="textSecondary">Ricavi Totali</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  €{financialData?.revenue?.toLocaleString() || '0'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    +{financialData?.growth || 0}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Payment color="warning" />
                  <Typography color="textSecondary">Spese Totali</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  €{financialData?.expenses?.toLocaleString() || '0'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TrendingDown color="error" fontSize="small" />
                  <Typography variant="body2" color="error.main">
                    -8.2%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp color="success" />
                  <Typography color="textSecondary">Profitto Netto</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  €{financialData?.profit?.toLocaleString() || '0'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    +15.3%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <People color="info" />
                  <Typography color="textSecondary">Clienti Attivi</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {financialData?.customers || 0}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    +5.7%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <TransactionLineChart 
              title="Andamento Transazioni Mensili" 
              data={transactionData}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <CustomerPieChart 
              title="Distribuzione Clienti" 
              data={customerData}
            />
          </Grid>
        </Grid>

        {/* Top Customers Table */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Top 5 Clienti per Saldo
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Saldo</TableCell>
                  <TableCell>Transazioni</TableCell>
                  <TableCell>Stato</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCustomers.map((customer, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {customer.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        €{customer.balance.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.transactions}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Attivo"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Transaction Summary */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Riepilogo Transazioni
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Transazioni Totali:</Typography>
                  <Typography fontWeight="bold">{financialData?.transactions || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Volume Medio:</Typography>
                  <Typography fontWeight="bold">€62.50</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Transazioni/Giorno:</Typography>
                  <Typography fontWeight="bold">1,523</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tasso di Successo:</Typography>
                  <Typography fontWeight="bold" color="success.main">98.5%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Metriche di Performance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>ROI Medio:</Typography>
                  <Typography fontWeight="bold" color="success.main">+12.3%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Customer Satisfaction:</Typography>
                  <Typography fontWeight="bold" color="success.main">4.8/5</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tempo di Risposta:</Typography>
                  <Typography fontWeight="bold">2.3s</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Uptime Sistema:</Typography>
                  <Typography fontWeight="bold" color="success.main">99.9%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Reports;
