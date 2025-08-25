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
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Visibility,
  Edit,
  Delete,
  AccountBalance,
  Business,
  Nature,
  SwapHoriz,
  TrendingUp,
  Remove,
} from '@mui/icons-material';
import { bondService, Bond, CreateBondRequest } from '../../services/bondService';

const Bonds: React.FC = () => {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [addBondDialog, setAddBondDialog] = useState(false);
  const [editBondDialog, setEditBondDialog] = useState(false);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [newBond, setNewBond] = useState<CreateBondRequest>({
    isin: '',
    name: '',
    issuer: '',
    type: 'corporate',
    currency: 'EUR',
    faceValue: 1000,
    couponRate: 0,
    couponFrequency: 'annual',
    maturityDate: new Date(),
    issueDate: new Date(),
    currentPrice: 1000,
    creditRating: 'BBB',
    description: '',
    country: '',
    sector: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBonds();
  }, []);

  const loadBonds = async () => {
    try {
      setLoading(true);
      const data = await bondService.getBonds();
      setBonds(data);
    } catch (err) {
      setError('Errore nel caricamento delle obbligazioni');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBond = () => {
    setAddBondDialog(true);
    setNewBond({
      isin: '',
      name: '',
      issuer: '',
      type: 'corporate',
      currency: 'EUR',
      faceValue: 1000,
      couponRate: 0,
      couponFrequency: 'annual',
      maturityDate: new Date(),
      issueDate: new Date(),
      currentPrice: 1000,
      creditRating: 'BBB',
      description: '',
      country: '',
      sector: '',
    });
  };

  const handleCreateBond = async () => {
    try {
      const createdBond = await bondService.createBond(newBond);
      
      // Salva nel localStorage per persistenza locale
      const existingBonds = JSON.parse(localStorage.getItem('bonds') || '[]');
      const updatedBonds = [...existingBonds, createdBond];
      localStorage.setItem('bonds', JSON.stringify(updatedBonds));

      // Aggiorna lo stato locale
      setBonds([...bonds, createdBond]);
      setAddBondDialog(false);
      setNewBond({
        isin: '',
        name: '',
        issuer: '',
        type: 'corporate',
        currency: 'EUR',
        faceValue: 1000,
        couponRate: 0,
        couponFrequency: 'annual',
        maturityDate: new Date(),
        issueDate: new Date(),
        currentPrice: 1000,
        creditRating: 'BBB',
        description: '',
        country: '',
        sector: '',
      });
      
      // Mostra messaggio di successo
      setSuccessMessage('Obbligazione creata e salvata permanentemente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Errore nella creazione dell\'obbligazione');
    }
  };

  const handleCancelAddBond = () => {
    setAddBondDialog(false);
    setNewBond({
      isin: '',
      name: '',
      issuer: '',
      type: 'corporate',
      currency: 'EUR',
      faceValue: 1000,
      couponRate: 0,
      couponFrequency: 'annual',
      maturityDate: new Date(),
      issueDate: new Date(),
      currentPrice: 1000,
      creditRating: 'BBB',
      description: '',
      country: '',
      sector: '',
    });
  };

  const handleEditBond = (bond: Bond) => {
    setSelectedBond(bond);
    setNewBond({
      isin: bond.isin,
      name: bond.name,
      issuer: bond.issuer,
      type: bond.type,
      currency: bond.currency,
      faceValue: bond.faceValue,
      couponRate: bond.couponRate,
      couponFrequency: bond.couponFrequency,
      maturityDate: bond.maturityDate,
      issueDate: bond.issueDate,
      currentPrice: bond.currentPrice,
      creditRating: bond.creditRating,
      description: bond.description,
      country: bond.country,
      sector: bond.sector,
    });
    setEditBondDialog(true);
  };

  const handleUpdateBond = async () => {
    if (!selectedBond) return;
    try {
      const updatedBond = await bondService.updateBond(selectedBond.id, newBond);
      
      // Salva nel localStorage per persistenza locale
      const existingBonds = JSON.parse(localStorage.getItem('bonds') || '[]');
      const updatedBonds = existingBonds.map((b: Bond) =>
        b.id === selectedBond.id ? updatedBond : b
      );
      localStorage.setItem('bonds', JSON.stringify(updatedBonds));

      // Aggiorna lo stato locale
      setBonds(bonds.map(b => b.id === selectedBond.id ? updatedBond : b));
      setEditBondDialog(false);
      setSelectedBond(null);
      
      // Mostra messaggio di successo
      setSuccessMessage('Obbligazione aggiornata e salvata permanentemente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Errore nell\'aggiornamento dell\'obbligazione');
    }
  };

  const handleDeleteBond = async (id: string) => {
    try {
      await bondService.deleteBond(id);
      
      // Rimuovi dal localStorage
      const existingBonds = JSON.parse(localStorage.getItem('bonds') || '[]');
      const updatedBonds = existingBonds.filter((b: Bond) => b.id !== id);
      localStorage.setItem('bonds', JSON.stringify(updatedBonds));

      // Aggiorna lo stato locale
      setBonds(bonds.filter(b => b.id !== id));
      
      // Mostra messaggio di successo
      setSuccessMessage('Obbligazione eliminata permanentemente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Errore nella cancellazione dell\'obbligazione');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'corporate':
        return <Business color="primary" />;
      case 'government':
        return <AccountBalance color="info" />;
      case 'green':
        return <Nature color="success" />;
      case 'convertible':
        return <SwapHoriz color="secondary" />;
      case 'high_yield':
        return <TrendingUp color="warning" />;
      case 'zero_coupon':
        return <Remove color="error" />;
      default:
        return <Business color="action" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'corporate':
        return 'primary';
      case 'government':
        return 'info';
      case 'green':
        return 'success';
      case 'convertible':
        return 'secondary';
      case 'high_yield':
        return 'warning';
      case 'zero_coupon':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'corporate':
        return 'Corporate';
      case 'government':
        return 'Governativo';
      case 'green':
        return 'Green';
      case 'convertible':
        return 'Convertibile';
      case 'high_yield':
        return 'High Yield';
      case 'zero_coupon':
        return 'Zero Coupon';
      default:
        return type;
    }
  };

  const getCreditRatingColor = (rating: string) => {
    if (rating.startsWith('AAA') || rating.startsWith('AA')) return 'success';
    if (rating.startsWith('A') || rating.startsWith('BBB')) return 'info';
    if (rating.startsWith('BB') || rating.startsWith('B')) return 'warning';
    return 'error';
  };

  const filteredBonds = bonds.filter(bond => {
    const matchesSearch = bond.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bond.isin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bond.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || bond.type === typeFilter;
    const matchesCountry = !countryFilter || bond.country === countryFilter;
    
    return matchesSearch && matchesType && matchesCountry;
  });

  const getDaysToMaturity = (maturityDate: Date) => {
    const today = new Date();
    const diffTime = maturityDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Caricamento obbligazioni...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        💰 Obbligazioni (Bonds)
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
              label="Cerca obbligazioni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Tipo"
              >
                <MenuItem value="">Tutti</MenuItem>
                <MenuItem value="corporate">Corporate</MenuItem>
                <MenuItem value="government">Governativo</MenuItem>
                <MenuItem value="green">Green</MenuItem>
                <MenuItem value="convertible">Convertibile</MenuItem>
                <MenuItem value="high_yield">High Yield</MenuItem>
                <MenuItem value="zero_coupon">Zero Coupon</MenuItem>
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
                <MenuItem value="Germany">Germania</MenuItem>
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
                setTypeFilter('');
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
              onClick={handleAddBond}
            >
              Nuova Obbligazione
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
                Totale Obbligazioni
              </Typography>
              <Typography variant="h4">
                {bonds.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valore Nominale Totale
              </Typography>
              <Typography variant="h4">
                €{bonds.reduce((sum, b) => sum + b.faceValue, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rendimento Medio
              </Typography>
              <Typography variant="h4" color="success.main">
                {bonds.reduce((sum, b) => sum + b.yieldToMaturity, 0) / bonds.length}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Scadenza Media
              </Typography>
              <Typography variant="h4" color="info.main">
                {Math.round(bonds.reduce((sum, b) => sum + getDaysToMaturity(b.maturityDate), 0) / bonds.length)} giorni
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabella Obbligazioni */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Lista Obbligazioni ({filteredBonds.length})
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ISIN</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Emittente</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Valuta</TableCell>
                <TableCell>Prezzo</TableCell>
                <TableCell>Rendimento</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Scadenza</TableCell>
                <TableCell>Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBonds.map((bond) => (
                <TableRow key={bond.id}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {bond.isin}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {bond.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {bond.sector}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {bond.issuer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(bond.type)}
                      label={getTypeLabel(bond.type)}
                      color={getTypeColor(bond.type) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {bond.currency}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {bond.currency} {bond.currentPrice.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main" fontWeight="medium">
                      {bond.yieldToMaturity.toFixed(2)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bond.creditRating}
                      color={getCreditRatingColor(bond.creditRating) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {bond.maturityDate.toLocaleDateString('it-IT')}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {getDaysToMaturity(bond.maturityDate)} giorni
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
                        <IconButton size="small" color="secondary" onClick={() => handleEditBond(bond)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina">
                        <IconButton size="small" color="error" onClick={() => handleDeleteBond(bond.id)}>
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

      {/* Dialog Aggiungi Obbligazione */}
      <Dialog open={addBondDialog} onClose={handleCancelAddBond} maxWidth="md" fullWidth>
        <DialogTitle>Aggiungi Nuova Obbligazione</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ISIN"
                  value={newBond.isin}
                  onChange={(e) => setNewBond({ ...newBond, isin: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome Obbligazione"
                  value={newBond.name}
                  onChange={(e) => setNewBond({ ...newBond, name: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Emittente"
                  value={newBond.issuer}
                  onChange={(e) => setNewBond({ ...newBond, issuer: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={newBond.type}
                    onChange={(e) => setNewBond({ ...newBond, type: e.target.value as any })}
                    label="Tipo"
                  >
                    <MenuItem value="corporate">Corporate</MenuItem>
                    <MenuItem value="government">Governativo</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                    <MenuItem value="convertible">Convertibile</MenuItem>
                    <MenuItem value="high_yield">High Yield</MenuItem>
                    <MenuItem value="zero_coupon">Zero Coupon</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Valuta</InputLabel>
                  <Select
                    value={newBond.currency}
                    onChange={(e) => setNewBond({ ...newBond, currency: e.target.value })}
                    label="Valuta"
                  >
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Valore Nominale"
                  type="number"
                  value={newBond.faceValue}
                  onChange={(e) => setNewBond({ ...newBond, faceValue: parseInt(e.target.value) })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Tasso Cedolare (%)"
                  type="number"
                  value={newBond.couponRate}
                  onChange={(e) => setNewBond({ ...newBond, couponRate: parseFloat(e.target.value) })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Frequenza Cedola</InputLabel>
                  <Select
                    value={newBond.couponFrequency}
                    onChange={(e) => setNewBond({ ...newBond, couponFrequency: e.target.value as any })}
                    label="Frequenza Cedola"
                  >
                    <MenuItem value="annual">Annuale</MenuItem>
                    <MenuItem value="semi_annual">Semestrale</MenuItem>
                    <MenuItem value="quarterly">Trimestrale</MenuItem>
                    <MenuItem value="monthly">Mensile</MenuItem>
                    <MenuItem value="zero">Zero</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Data Scadenza"
                  type="date"
                  value={newBond.maturityDate.toISOString().split('T')[0]}
                  onChange={(e) => setNewBond({ ...newBond, maturityDate: new Date(e.target.value) })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Data Emissione"
                  type="date"
                  value={newBond.issueDate.toISOString().split('T')[0]}
                  onChange={(e) => setNewBond({ ...newBond, issueDate: new Date(e.target.value) })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Prezzo Corrente"
                  type="number"
                  value={newBond.currentPrice}
                  onChange={(e) => setNewBond({ ...newBond, currentPrice: parseFloat(e.target.value) })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Rating Creditizio</InputLabel>
                  <Select
                    value={newBond.creditRating}
                    onChange={(e) => setNewBond({ ...newBond, creditRating: e.target.value as any })}
                    label="Rating Creditizio"
                  >
                    <MenuItem value="AAA">AAA</MenuItem>
                    <MenuItem value="AA">AA</MenuItem>
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="BBB">BBB</MenuItem>
                    <MenuItem value="BB">BB</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="CCC">CCC</MenuItem>
                    <MenuItem value="CC">CC</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Paese"
                  value={newBond.country}
                  onChange={(e) => setNewBond({ ...newBond, country: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Settore"
                  value={newBond.sector}
                  onChange={(e) => setNewBond({ ...newBond, sector: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrizione"
                  value={newBond.description}
                  onChange={(e) => setNewBond({ ...newBond, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAddBond}>Annulla</Button>
          <Button onClick={handleCreateBond} variant="contained" disabled={!newBond.isin || !newBond.name}>
            Aggiungi Obbligazione
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Modifica Obbligazione */}
      <Dialog open={editBondDialog} onClose={() => setEditBondDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifica Obbligazione</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ISIN"
                  value={newBond.isin}
                  onChange={(e) => setNewBond({ ...newBond, isin: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome Obbligazione"
                  value={newBond.name}
                  onChange={(e) => setNewBond({ ...newBond, name: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Emittente"
                  value={newBond.issuer}
                  onChange={(e) => setNewBond({ ...newBond, issuer: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={newBond.type}
                    onChange={(e) => setNewBond({ ...newBond, type: e.target.value as any })}
                    label="Tipo"
                  >
                    <MenuItem value="corporate">Corporate</MenuItem>
                    <MenuItem value="government">Governativo</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                    <MenuItem value="convertible">Convertibile</MenuItem>
                    <MenuItem value="high_yield">High Yield</MenuItem>
                    <MenuItem value="zero_coupon">Zero Coupon</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Valuta</InputLabel>
                  <Select
                    value={newBond.currency}
                    onChange={(e) => setNewBond({ ...newBond, currency: e.target.value })}
                    label="Valuta"
                  >
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Valore Nominale"
                  type="number"
                  value={newBond.faceValue}
                  onChange={(e) => setNewBond({ ...newBond, faceValue: parseInt(e.target.value) })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Tasso Cedolare (%)"
                  type="number"
                  value={newBond.couponRate}
                  onChange={(e) => setNewBond({ ...newBond, couponRate: parseFloat(e.target.value) })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Frequenza Cedola</InputLabel>
                  <Select
                    value={newBond.couponFrequency}
                    onChange={(e) => setNewBond({ ...newBond, couponFrequency: e.target.value as any })}
                    label="Frequenza Cedola"
                  >
                    <MenuItem value="annual">Annuale</MenuItem>
                    <MenuItem value="semi_annual">Semestrale</MenuItem>
                    <MenuItem value="quarterly">Trimestrale</MenuItem>
                    <MenuItem value="monthly">Mensile</MenuItem>
                    <MenuItem value="zero">Zero</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Data Scadenza"
                  type="date"
                  value={newBond.maturityDate.toISOString().split('T')[0]}
                  onChange={(e) => setNewBond({ ...newBond, maturityDate: new Date(e.target.value) })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Data Emissione"
                  type="date"
                  value={newBond.issueDate.toISOString().split('T')[0]}
                  onChange={(e) => setNewBond({ ...newBond, issueDate: new Date(e.target.value) })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Prezzo Corrente"
                  type="number"
                  value={newBond.currentPrice}
                  onChange={(e) => setNewBond({ ...newBond, currentPrice: parseFloat(e.target.value) })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Rating Creditizio</InputLabel>
                  <Select
                    value={newBond.creditRating}
                    onChange={(e) => setNewBond({ ...newBond, creditRating: e.target.value as any })}
                    label="Rating Creditizio"
                  >
                    <MenuItem value="AAA">AAA</MenuItem>
                    <MenuItem value="AA">AA</MenuItem>
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="BBB">BBB</MenuItem>
                    <MenuItem value="BB">BB</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="CCC">CCC</MenuItem>
                    <MenuItem value="CC">CC</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Paese"
                  value={newBond.country}
                  onChange={(e) => setNewBond({ ...newBond, country: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Settore"
                  value={newBond.sector}
                  onChange={(e) => setNewBond({ ...newBond, sector: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrizione"
                  value={newBond.description}
                  onChange={(e) => setNewBond({ ...newBond, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditBondDialog(false)}>Annulla</Button>
          <Button onClick={handleUpdateBond} variant="contained" disabled={!newBond.isin || !newBond.name}>
            Aggiorna Obbligazione
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bonds;
