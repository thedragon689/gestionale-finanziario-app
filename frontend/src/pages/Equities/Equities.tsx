import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add,
  Search,
  FilterList,
  Visibility,
  Edit,
  Delete,
  ShowChart,
  AccountBalance,
  Business,
  Science,
  ElectricBolt,
  Flight,
  ShoppingCart,
  Code,
} from '@mui/icons-material';
import { equityService, Equity, CreateEquityRequest } from '../../services/equityService';

const Equities: React.FC = () => {
  const [equities, setEquities] = useState<Equity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [addEquityDialog, setAddEquityDialog] = useState(false);
  const [editEquityDialog, setEditEquityDialog] = useState(false);
  const [selectedEquity, setSelectedEquity] = useState<Equity | null>(null);
  const [newEquity, setNewEquity] = useState<CreateEquityRequest>({
    symbol: '',
    name: '',
    sector: 'technology',
    exchange: '',
    currency: 'EUR',
    currentPrice: 0,
    description: '',
    country: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadEquities();
  }, []);

  const loadEquities = async () => {
    try {
      setLoading(true);
      const data = await equityService.getEquities();
      setEquities(data);
    } catch (err) {
      setError('Errore nel caricamento delle azioni');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquity = () => {
    setAddEquityDialog(true);
    setNewEquity({
      symbol: '',
      name: '',
      sector: 'technology',
      exchange: '',
      currency: 'EUR',
      currentPrice: 0,
      description: '',
      country: '',
    });
  };

  const handleCreateEquity = async () => {
    try {
      const createdEquity = await equityService.createEquity(newEquity);
      
      // Salva nel localStorage per persistenza locale
      const existingEquities = JSON.parse(localStorage.getItem('equities') || '[]');
      const updatedEquities = [...existingEquities, createdEquity];
      localStorage.setItem('equities', JSON.stringify(updatedEquities));

      // Aggiorna lo stato locale
      setEquities([...equities, createdEquity]);
      setAddEquityDialog(false);
      setNewEquity({
        symbol: '',
        name: '',
        sector: 'technology',
        exchange: '',
        currency: 'EUR',
        currentPrice: 0,
        description: '',
        country: '',
      });
      
      // Mostra messaggio di successo
      setSuccessMessage('Azione creata e salvata permanentemente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Errore nella creazione dell\'azione');
    }
  };

  const handleCancelAddEquity = () => {
    setAddEquityDialog(false);
    setNewEquity({
      symbol: '',
      name: '',
      sector: 'technology',
      exchange: '',
      currency: 'EUR',
      currentPrice: 0,
      description: '',
      country: '',
    });
  };

  const handleEditEquity = (equity: Equity) => {
    setSelectedEquity(equity);
    setNewEquity({
      symbol: equity.symbol,
      name: equity.name,
      sector: equity.sector,
      exchange: equity.exchange,
      currency: equity.currency,
      currentPrice: equity.currentPrice,
      description: equity.description,
      country: equity.country,
    });
    setEditEquityDialog(true);
  };

  const handleUpdateEquity = async () => {
    if (!selectedEquity) return;
    try {
      const updatedEquity = await equityService.updateEquity(selectedEquity.id, newEquity);
      
      // Salva nel localStorage per persistenza locale
      const existingEquities = JSON.parse(localStorage.getItem('equities') || '[]');
      const updatedEquities = existingEquities.map((eq: Equity) =>
        eq.id === selectedEquity.id ? updatedEquity : eq
      );
      localStorage.setItem('equities', JSON.stringify(updatedEquities));

      // Aggiorna lo stato locale
      setEquities(equities.map(eq => eq.id === selectedEquity.id ? updatedEquity : eq));
      setEditEquityDialog(false);
      setSelectedEquity(null);
      
      // Mostra messaggio di successo
      setSuccessMessage('Azione aggiornata e salvata permanentemente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Errore nell\'aggiornamento dell\'azione');
    }
  };

  const handleDeleteEquity = async (id: string) => {
    try {
      await equityService.deleteEquity(id);
      
      // Rimuovi dal localStorage
      const existingEquities = JSON.parse(localStorage.getItem('equities') || '[]');
      const updatedEquities = existingEquities.filter((eq: Equity) => eq.id !== id);
      localStorage.setItem('equities', JSON.stringify(updatedEquities));

      // Aggiorna lo stato locale
      setEquities(equities.filter(eq => eq.id !== id));
      
      // Mostra messaggio di successo
      setSuccessMessage('Azione eliminata permanentemente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Errore nella cancellazione dell\'azione');
    }
  };

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'technology':
        return <Code color="primary" />;
      case 'healthcare':
        return <Science color="error" />;
      case 'energy':
        return <ElectricBolt color="warning" />;
      case 'financials':
        return <AccountBalance color="info" />;
      case 'aerospace':
        return <Flight color="secondary" />;
      case 'retail':
        return <ShoppingCart color="success" />;
      case 'software':
        return <Code color="primary" />;
      default:
        return <Business color="action" />;
    }
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case 'technology':
        return 'primary';
      case 'healthcare':
        return 'error';
      case 'energy':
        return 'warning';
      case 'financials':
        return 'info';
      case 'aerospace':
        return 'secondary';
      case 'retail':
        return 'success';
      case 'software':
        return 'primary';
      default:
        return 'default';
    }
  };

  const filteredEquities = equities.filter(equity => {
    const matchesSearch = equity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equity.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = !sectorFilter || equity.sector === sectorFilter;
    const matchesCountry = !countryFilter || equity.country === countryFilter;
    
    return matchesSearch && matchesSector && matchesCountry;
  });

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'success' : 'error';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Caricamento azioni...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📈 Azioni (Equity)
      </Typography>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filtri e Ricerca */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Cerca azioni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Settore</InputLabel>
              <Select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                label="Settore"
              >
                <MenuItem value="">Tutti</MenuItem>
                <MenuItem value="technology">Tecnologia</MenuItem>
                <MenuItem value="healthcare">Healthcare</MenuItem>
                <MenuItem value="energy">Energia</MenuItem>
                <MenuItem value="financials">Finanziario</MenuItem>
                <MenuItem value="aerospace">Aerospaziale</MenuItem>
                <MenuItem value="retail">Retail</MenuItem>
                <MenuItem value="software">Software</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Paese</InputLabel>
              <Select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                label="Paese"
              >
                <MenuItem value="">Tutti</MenuItem>
                <MenuItem value="Italy">Italia</MenuItem>
                <MenuItem value="United States">Stati Uniti</MenuItem>
                <MenuItem value="United Kingdom">Regno Unito</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="Germany">Germania</MenuItem>
                <MenuItem value="Australia">Australia</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setSectorFilter('');
                setCountryFilter('');
              }}
            >
              Reset Filtri
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddEquity}
            >
              Nuova Azione
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistiche Generali */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Totale Azioni
              </Typography>
              <Typography variant="h4">
                {equities.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valore Totale
              </Typography>
              <Typography variant="h4">
                €{equities.reduce((sum, eq) => sum + eq.currentPrice, 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Azioni in Salita
              </Typography>
              <Typography variant="h4" color="success.main">
                {equities.filter(eq => eq.change >= 0).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Azioni in Discesa
              </Typography>
              <Typography variant="h4" color="error.main">
                {equities.filter(eq => eq.change < 0).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabella Azioni */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Lista Azioni ({filteredEquities.length})
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Simbolo</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Settore</TableCell>
                <TableCell>Borsa</TableCell>
                <TableCell>Prezzo</TableCell>
                <TableCell>Variazione</TableCell>
                <TableCell>Market Cap</TableCell>
                <TableCell>P/E Ratio</TableCell>
                <TableCell>Dividend Yield</TableCell>
                <TableCell>Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEquities.map((equity) => (
                <TableRow key={equity.id}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {equity.symbol}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {equity.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {equity.country}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getSectorIcon(equity.sector)}
                      label={equity.sector}
                      color={getSectorColor(equity.sector) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {equity.exchange}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {equity.currency} {equity.currentPrice.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getChangeIcon(equity.change)}
                      <Typography
                        variant="body2"
                        color={getChangeColor(equity.change)}
                        fontWeight="medium"
                      >
                        {equity.change >= 0 ? '+' : ''}{equity.change.toFixed(2)} ({equity.changePercent.toFixed(2)}%)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {equity.currency} {(equity.marketCap / 1000000).toFixed(0)}M
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {equity.peRatio.toFixed(1)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {equity.dividendYield.toFixed(1)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Visualizza Dettagli">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifica">
                        <IconButton size="small" color="secondary" onClick={() => handleEditEquity(equity)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina">
                        <IconButton size="small" color="error" onClick={() => handleDeleteEquity(equity.id)}>
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
      </Paper>

      {/* Dialog Aggiungi Azione */}
      <Dialog open={addEquityDialog} onClose={handleCancelAddEquity} maxWidth="md" fullWidth>
        <DialogTitle>Aggiungi Nuova Azione</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Simbolo"
                  value={newEquity.symbol}
                  onChange={(e) => setNewEquity({ ...newEquity, symbol: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome Azienda"
                  value={newEquity.name}
                  onChange={(e) => setNewEquity({ ...newEquity, name: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Settore</InputLabel>
                  <Select
                    value={newEquity.sector}
                    onChange={(e) => setNewEquity({ ...newEquity, sector: e.target.value as any })}
                    label="Settore"
                  >
                    <MenuItem value="technology">Tecnologia</MenuItem>
                    <MenuItem value="healthcare">Healthcare</MenuItem>
                    <MenuItem value="energy">Energia</MenuItem>
                    <MenuItem value="financials">Finanziario</MenuItem>
                    <MenuItem value="aerospace">Aerospaziale</MenuItem>
                    <MenuItem value="retail">Retail</MenuItem>
                    <MenuItem value="software">Software</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Borsa"
                  value={newEquity.exchange}
                  onChange={(e) => setNewEquity({ ...newEquity, exchange: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Valuta</InputLabel>
                  <Select
                    value={newEquity.currency}
                    onChange={(e) => setNewEquity({ ...newEquity, currency: e.target.value })}
                    label="Valuta"
                  >
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                    <MenuItem value="CAD">CAD</MenuItem>
                    <MenuItem value="AUD">AUD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Prezzo Corrente"
                  type="number"
                  value={newEquity.currentPrice}
                  onChange={(e) => setNewEquity({ ...newEquity, currentPrice: parseFloat(e.target.value) })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Paese"
                  value={newEquity.country}
                  onChange={(e) => setNewEquity({ ...newEquity, country: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrizione"
                  value={newEquity.description}
                  onChange={(e) => setNewEquity({ ...newEquity, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAddEquity}>Annulla</Button>
          <Button onClick={handleCreateEquity} variant="contained" disabled={!newEquity.symbol || !newEquity.name}>
            Aggiungi Azione
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Modifica Azione */}
      <Dialog open={editEquityDialog} onClose={() => setEditEquityDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifica Azione</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Simbolo"
                  value={newEquity.symbol}
                  onChange={(e) => setNewEquity({ ...newEquity, symbol: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome Azienda"
                  value={newEquity.name}
                  onChange={(e) => setNewEquity({ ...newEquity, name: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Settore</InputLabel>
                  <Select
                    value={newEquity.sector}
                    onChange={(e) => setNewEquity({ ...newEquity, sector: e.target.value as any })}
                    label="Settore"
                  >
                    <MenuItem value="technology">Tecnologia</MenuItem>
                    <MenuItem value="healthcare">Healthcare</MenuItem>
                    <MenuItem value="energy">Energia</MenuItem>
                    <MenuItem value="financials">Finanziario</MenuItem>
                    <MenuItem value="aerospace">Aerospaziale</MenuItem>
                    <MenuItem value="retail">Retail</MenuItem>
                    <MenuItem value="software">Software</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Borsa"
                  value={newEquity.exchange}
                  onChange={(e) => setNewEquity({ ...newEquity, exchange: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Valuta</InputLabel>
                  <Select
                    value={newEquity.currency}
                    onChange={(e) => setNewEquity({ ...newEquity, currency: e.target.value })}
                    label="Valuta"
                  >
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                    <MenuItem value="CAD">CAD</MenuItem>
                    <MenuItem value="AUD">AUD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Prezzo Corrente"
                  type="number"
                  value={newEquity.currentPrice}
                  onChange={(e) => setNewEquity({ ...newEquity, currentPrice: parseFloat(e.target.value) })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Paese"
                  value={newEquity.country}
                  onChange={(e) => setNewEquity({ ...newEquity, country: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrizione"
                  value={newEquity.description}
                  onChange={(e) => setNewEquity({ ...newEquity, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditEquityDialog(false)}>Annulla</Button>
          <Button onClick={handleUpdateEquity} variant="contained" disabled={!newEquity.symbol || !newEquity.name}>
            Aggiorna Azione
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Equities;
