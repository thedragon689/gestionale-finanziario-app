import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  TrendingDown,
  Euro,
  AccountBalance,
  ShowChart,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

import { fundService, Fund, FundTransaction, FundPerformance } from '../../services/fundService';

const Funds: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [fundDetailsDialog, setFundDetailsDialog] = useState(false);
  const [addFundDialog, setAddFundDialog] = useState(false);
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [performance, setPerformance] = useState<FundPerformance[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [newFund, setNewFund] = useState({
    name: '',
    type: 'equity' as Fund['type'],
    category: 'domestic' as Fund['category'],
    isin: '',
    currency: 'EUR',
    minInvestment: 1000,
    manager: '',
    description: '',
    risk: 'medium' as Fund['risk'],
    expenseRatio: 0.5,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fundsData, statsData] = await Promise.all([
        fundService.getFunds(),
        fundService.getFundStats(),
      ]);
      setFunds(fundsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento dei fondi');
      console.error('Failed to load funds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFund = async (fund: Fund) => {
    try {
      const [transactionsData, performanceData] = await Promise.all([
        fundService.getFundTransactions(fund.id),
        fundService.getFundPerformance(fund.id, '1y'),
      ]);
      setSelectedFund(fund);
      setTransactions(transactionsData);
      setPerformance(performanceData);
      setFundDetailsDialog(true);
    } catch (err) {
      console.error('Failed to load fund details:', err);
    }
  };

  const handleAddFund = async () => {
    try {
      await fundService.createFund(newFund);
      setAddFundDialog(false);
      setNewFund({
        name: '',
        type: 'equity',
        category: 'domestic',
        isin: '',
        currency: 'EUR',
        minInvestment: 1000,
        manager: '',
        description: '',
        risk: 'medium',
        expenseRatio: 0.5,
      });
      await loadData();
    } catch (err) {
      console.error('Failed to add fund:', err);
    }
  };

  const getTypeLabel = (type: Fund['type']) => {
    const labels: Record<Fund['type'], string> = {
      equity: 'Azionario',
      bond: 'Obbligazionario',
      mixed: 'Misto',
      money_market: 'Monetario',
      index: 'Indice',
      sector: 'Settoriale',
    };
    return labels[type];
  };

  const getCategoryLabel = (category: Fund['category']) => {
    const labels: Record<Fund['category'], string> = {
      domestic: 'Nazionale',
      international: 'Internazionale',
      emerging_markets: 'Mercati Emergenti',
      developed_markets: 'Mercati Sviluppati',
    };
    return labels[category];
  };

  const getRiskLabel = (risk: Fund['risk']) => {
    const labels: Record<Fund['risk'], string> = {
      low: 'Basso',
      medium: 'Medio',
      high: 'Alto',
      very_high: 'Molto Alto',
    };
    return labels[risk];
  };

  const getRiskColor = (risk: Fund['risk']) => {
    const colors: Record<Fund['risk'], 'success' | 'warning' | 'error' | 'info'> = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      very_high: 'error',
    };
    return colors[risk];
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Gestione Fondi
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddFundDialog(true)}
          >
            Nuovo Fondo
          </Button>
        </Box>

        {/* Statistics Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Totale Fondi
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalFunds}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Valore Totale
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(stats.totalValue, 'EUR')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Performance Media
                  </Typography>
                  <Typography variant="h4" color={stats.averagePerformance >= 0 ? 'success.main' : 'error.main'}>
                    {formatPercentage(stats.averagePerformance)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Fondi Attivi
                  </Typography>
                  <Typography variant="h4">
                    {funds.filter(f => f.status === 'active').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Funds Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Fondi ({funds.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>NAV</TableCell>
                    <TableCell>Valore Totale</TableCell>
                    <TableCell>Performance YTD</TableCell>
                    <TableCell>Rischio</TableCell>
                    <TableCell>Stato</TableCell>
                    <TableCell>Azioni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {funds.map((fund) => (
                    <TableRow key={fund.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {fund.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {fund.manager}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTypeLabel(fund.type)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getCategoryLabel(fund.category)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatCurrency(fund.nav, fund.currency)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {fund.navDate.toLocaleDateString('it-IT')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(fund.totalValue, fund.currency)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {fund.units.toLocaleString()} unità
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {fund.performance.ytd >= 0 ? (
                            <TrendingUp color="success" fontSize="small" />
                          ) : (
                            <TrendingDown color="error" fontSize="small" />
                          )}
                          <Typography
                            variant="body2"
                            color={fund.performance.ytd >= 0 ? 'success.main' : 'error.main'}
                          >
                            {formatPercentage(fund.performance.ytd)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRiskLabel(fund.risk)}
                          color={getRiskColor(fund.risk)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={fund.status === 'active' ? 'Attivo' : 'Sospeso'}
                          color={fund.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Visualizza Dettagli">
                            <IconButton
                              size="small"
                              onClick={() => handleViewFund(fund)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifica">
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Elimina">
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Fund Details Dialog */}
        <Dialog
          open={fundDetailsDialog}
          onClose={() => setFundDetailsDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Dettagli Fondo: {selectedFund?.name}
          </DialogTitle>
          <DialogContent>
            {selectedFund && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informazioni Generali
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          ISIN: {selectedFund.isin}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Gestore: {selectedFund.manager}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Data Inizio: {selectedFund.inceptionDate.toLocaleDateString('it-IT')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Commissioni: {selectedFund.expenseRatio}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Investimento Minimo: {formatCurrency(selectedFund.minInvestment, selectedFund.currency)}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {selectedFund.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Performance
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Giornaliera</Typography>
                          <Typography
                            variant="body2"
                            color={selectedFund.performance.daily >= 0 ? 'success.main' : 'error.main'}
                          >
                            {formatPercentage(selectedFund.performance.daily)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Settimanale</Typography>
                          <Typography
                            variant="body2"
                            color={selectedFund.performance.weekly >= 0 ? 'success.main' : 'error.main'}
                          >
                            {formatPercentage(selectedFund.performance.weekly)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Mensile</Typography>
                          <Typography
                            variant="body2"
                            color={selectedFund.performance.monthly >= 0 ? 'success.main' : 'error.main'}
                          >
                            {formatPercentage(selectedFund.performance.monthly)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Annuale</Typography>
                          <Typography
                            variant="body2"
                            color={selectedFund.performance.yearly >= 0 ? 'success.main' : 'error.main'}
                          >
                            {formatPercentage(selectedFund.performance.yearly)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">YTD</Typography>
                          <Typography
                            variant="body2"
                            color={selectedFund.performance.ytd >= 0 ? 'success.main' : 'error.main'}
                          >
                            {formatPercentage(selectedFund.performance.ytd)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Andamento NAV
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip formatter={(value) => [formatCurrency(Number(value), selectedFund.currency), 'NAV']} />
                            <Line
                              type="monotone"
                              dataKey="nav"
                              stroke="#8884d8"
                              strokeWidth={2}
                              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Ultime Transazioni
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Data</TableCell>
                              <TableCell>Tipo</TableCell>
                              <TableCell>Importo</TableCell>
                              <TableCell>Unita</TableCell>
                              <TableCell>NAV</TableCell>
                              <TableCell>Commissioni</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {transactions.map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>
                                  {transaction.date.toLocaleDateString('it-IT')}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={transaction.type === 'purchase' ? 'Acquisto' : 
                                           transaction.type === 'sale' ? 'Vendita' :
                                           transaction.type === 'dividend' ? 'Dividendo' : 'Distribuzione'}
                                    color={transaction.type === 'purchase' ? 'success' : 
                                           transaction.type === 'sale' ? 'error' : 'info'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(transaction.amount, selectedFund.currency)}
                                </TableCell>
                                <TableCell>
                                  {transaction.units.toFixed(4)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(transaction.nav, selectedFund.currency)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(transaction.fees, selectedFund.currency)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFundDetailsDialog(false)}>Chiudi</Button>
          </DialogActions>
        </Dialog>

        {/* Add Fund Dialog */}
        <Dialog open={addFundDialog} onClose={() => setAddFundDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Aggiungi Nuovo Fondo</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Fondo"
                  value={newFund.name}
                  onChange={(e) => setNewFund(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={newFund.type}
                    onChange={(e) => setNewFund(prev => ({ ...prev, type: e.target.value as Fund['type'] }))}
                    label="Tipo"
                  >
                    <MenuItem value="equity">Azionario</MenuItem>
                    <MenuItem value="bond">Obbligazionario</MenuItem>
                    <MenuItem value="mixed">Misto</MenuItem>
                    <MenuItem value="money_market">Monetario</MenuItem>
                    <MenuItem value="index">Indice</MenuItem>
                    <MenuItem value="sector">Settoriale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={newFund.category}
                    onChange={(e) => setNewFund(prev => ({ ...prev, category: e.target.value as Fund['category'] }))}
                    label="Categoria"
                  >
                    <MenuItem value="domestic">Nazionale</MenuItem>
                    <MenuItem value="international">Internazionale</MenuItem>
                    <MenuItem value="emerging_markets">Mercati Emergenti</MenuItem>
                    <MenuItem value="developed_markets">Mercati Sviluppati</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ISIN"
                  value={newFund.isin}
                  onChange={(e) => setNewFund(prev => ({ ...prev, isin: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Valuta</InputLabel>
                  <Select
                    value={newFund.currency}
                    onChange={(e) => setNewFund(prev => ({ ...prev, currency: e.target.value }))}
                    label="Valuta"
                  >
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Investimento Minimo"
                  type="number"
                  value={newFund.minInvestment}
                  onChange={(e) => setNewFund(prev => ({ ...prev, minInvestment: Number(e.target.value) }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Commissioni (%)"
                  type="number"
                  value={newFund.expenseRatio}
                  onChange={(e) => setNewFund(prev => ({ ...prev, expenseRatio: Number(e.target.value) }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Gestore"
                  value={newFund.manager}
                  onChange={(e) => setNewFund(prev => ({ ...prev, manager: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Rischio</InputLabel>
                  <Select
                    value={newFund.risk}
                    onChange={(e) => setNewFund(prev => ({ ...prev, risk: e.target.value as Fund['risk'] }))}
                    label="Rischio"
                  >
                    <MenuItem value="low">Basso</MenuItem>
                    <MenuItem value="medium">Medio</MenuItem>
                    <MenuItem value="high">Alto</MenuItem>
                    <MenuItem value="very_high">Molto Alto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrizione"
                  multiline
                  rows={3}
                  value={newFund.description}
                  onChange={(e) => setNewFund(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddFundDialog(false)}>Annulla</Button>
            <Button onClick={handleAddFund} variant="contained">Aggiungi</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Funds;
