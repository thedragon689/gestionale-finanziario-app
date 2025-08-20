import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Visibility,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  AccountBalance,
} from '@mui/icons-material';

// Services
import { transactionService, Transaction } from '../../services/transactionService';

const Transactions: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load transactions data
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getTransactions();
        setTransactions(data);
        setError(null);
      } catch (err) {
        setError('Errore nel caricamento delle transazioni');
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp color="success" />;
      case 'withdrawal':
        return <TrendingDown color="error" />;
      case 'transfer':
        return <SwapHoriz color="info" />;
      case 'payment':
        return <AccountBalance color="warning" />;
      default:
        return <AccountBalance />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    failed: transactions.filter(t => t.status === 'failed').length,
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography variant="h6">Caricamento transazioni...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Transazioni
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
          Transazioni
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Totale Transazioni
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completate
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.completed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Attesa
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {stats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Fallite
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {stats.failed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Cerca transazioni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Stato</InputLabel>
                <Select
                  value={statusFilter}
                  label="Stato"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tutti</MenuItem>
                  <MenuItem value="completed">Completate</MenuItem>
                  <MenuItem value="pending">In Attesa</MenuItem>
                  <MenuItem value="failed">Fallite</MenuItem>
                  <MenuItem value="cancelled">Cancellate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={typeFilter}
                  label="Tipo"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">Tutti</MenuItem>
                  <MenuItem value="deposit">Depositi</MenuItem>
                  <MenuItem value="withdrawal">Prelievi</MenuItem>
                  <MenuItem value="transfer">Bonifici</MenuItem>
                  <MenuItem value="payment">Pagamenti</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                sx={{ py: 1.5 }}
              >
                Nuova
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Transactions Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Descrizione</TableCell>
                  <TableCell>Importo</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Riferimento</TableCell>
                  <TableCell>Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTransactionIcon(transaction.type)}
                        <Typography variant="body2" textTransform="capitalize">
                          {transaction.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {transaction.description}
                      </Typography>
                      {transaction.counterparty && (
                        <Typography variant="caption" color="textSecondary">
                          {transaction.counterparty.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {transaction.amount.toLocaleString()} {transaction.currency}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        size="small"
                        color={getStatusColor(transaction.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.timestamp.toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {transaction.timestamp.toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {transaction.reference}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="secondary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Righe per pagina:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} di ${count !== -1 ? count : `più di ${to}`}`
            }
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default Transactions;
