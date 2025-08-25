import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Badge,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import {
  Refresh,
  Bookmark,
  BookmarkBorder,
  Visibility,
  VisibilityOff,
  Add,
  Edit,
  Delete,
  Notifications,
  NotificationsOff,
  Search,
  FilterList,
  RssFeed,
  TrendingUp,
  TrendingDown,
  Schedule,
  Category,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentNeutral
} from '@mui/icons-material';
import { rssService, RSSFeed, RSSItem, RSSFilters } from '../../services/rssService';

const RSS: React.FC = () => {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [items, setItems] = useState<RSSItem[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<RSSFeed | null>(null);
  const [selectedItem, setSelectedItem] = useState<RSSItem | null>(null);
  const [filters, setFilters] = useState<RSSFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addFeedDialog, setAddFeedDialog] = useState(false);
  const [editFeedDialog, setEditFeedDialog] = useState(false);
  const [newFeed, setNewFeed] = useState<Omit<RSSFeed, 'id' | 'createdAt' | 'itemCount'>>({
    name: '',
    url: '',
    category: 'finance',
    autoRefresh: true,
    notifications: true,
    isActive: true
  });

  useEffect(() => {
    loadFeeds();
    loadItems();
  }, []);

  const loadFeeds = async () => {
    try {
      setLoading(true);
      const feedsData = await rssService.getFeeds();
      setFeeds(feedsData);
    } catch (err) {
      setError('Errore nel caricamento dei feed RSS');
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const itemsData = await rssService.getItems();
      setItems(itemsData);
    } catch (err) {
      setError('Errore nel caricamento degli articoli RSS');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeed = async () => {
    try {
      await rssService.addFeed(newFeed);
      setAddFeedDialog(false);
      setNewFeed({
        name: '',
        url: '',
        category: 'finance',
        autoRefresh: true,
        notifications: true,
        isActive: true
      });
      loadFeeds();
    } catch (err) {
      setError('Errore nell\'aggiunta del feed');
    }
  };

  const handleEditFeed = async () => {
    if (!selectedFeed) return;
    try {
      await rssService.updateFeed(selectedFeed.id, newFeed);
      setEditFeedDialog(false);
      loadFeeds();
    } catch (err) {
      setError('Errore nell\'aggiornamento del feed');
    }
  };

  const handleDeleteFeed = async (feedId: string) => {
    try {
      await rssService.deleteFeed(feedId);
      loadFeeds();
    } catch (err) {
      setError('Errore nella cancellazione del feed');
    }
  };

  const handleRefreshFeed = async (feedId: string) => {
    try {
      await rssService.refreshFeed(feedId);
      loadItems();
    } catch (err) {
      setError('Errore nell\'aggiornamento del feed');
    }
  };

  const handleMarkAsRead = async (itemId: string) => {
    try {
      await rssService.markAsRead(itemId);
      loadItems();
    } catch (err) {
      setError('Errore nell\'aggiornamento dell\'articolo');
    }
  };

  const handleToggleBookmark = async (itemId: string) => {
    try {
      await rssService.toggleBookmark(itemId);
      loadItems();
    } catch (err) {
      setError('Errore nell\'aggiornamento del bookmark');
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <SentimentSatisfied color="success" />;
      case 'negative':
        return <SentimentDissatisfied color="error" />;
      default:
        return <SentimentNeutral color="action" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'finance':
        return 'primary';
      case 'crypto':
        return 'warning';
      case 'technology':
        return 'secondary';
      case 'business':
        return 'success';
      case 'politics':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredItems = items.filter(item => {
    if (filters.searchTerm && !item.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.sentiment && item.sentiment !== filters.sentiment) return false;
    if (filters.feedId && item.feedId !== filters.feedId) return false;
    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          📰 RSS Feed Intelligence
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Monitora e analizza feed RSS finanziari e tecnologici in tempo reale
          </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Controlli e Filtri */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                label="Cerca articoli"
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                  value={filters.category || ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    label="Categoria"
                  >
                    <MenuItem value="">Tutte</MenuItem>
                    <MenuItem value="finance">Finanza</MenuItem>
                    <MenuItem value="crypto">Criptovalute</MenuItem>
                  <MenuItem value="technology">Tecnologia</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="politics">Politica</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sentiment</InputLabel>
                <Select
                  value={filters.sentiment || ''}
                  onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
                  label="Sentiment"
                >
                  <MenuItem value="">Tutti</MenuItem>
                  <MenuItem value="positive">Positivo</MenuItem>
                  <MenuItem value="neutral">Neutro</MenuItem>
                  <MenuItem value="negative">Negativo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Feed</InputLabel>
                  <Select
                  value={filters.feedId || ''}
                  onChange={(e) => setFilters({ ...filters, feedId: e.target.value })}
                    label="Feed"
                  >
                    <MenuItem value="">Tutti</MenuItem>
                  {feeds.map(feed => (
                    <MenuItem key={feed.id} value={feed.id}>{feed.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilters({})}
              >
                Reset Filtri
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Gestione Feed */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              📡 Feed RSS ({feeds.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddFeedDialog(true)}
            >
              Nuovo Feed
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {feeds.map(feed => (
              <Grid item xs={12} md={6} lg={4} key={feed.id}>
            <Card>
              <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                <Typography variant="h6" gutterBottom>
                          {feed.name}
                </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {feed.url}
                              </Typography>
                        <Box display="flex" gap={1} mb={1}>
                          <Chip
                            label={feed.category}
                            color={getCategoryColor(feed.category) as any}
                            size="small"
                          />
                              <Chip
                            label={`${feed.itemCount} articoli`}
                            variant="outlined"
                                size="small"
                              />
                            </Box>
                        <Typography variant="caption" color="textSecondary">
                          Ultimo aggiornamento: {feed.lastUpdate?.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={feed.isActive}
                              onChange={() => handleEditFeed()}
                              size="small"
                            />
                          }
                          label="Attivo"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={feed.notifications}
                              onChange={() => handleEditFeed()}
                              size="small"
                            />
                          }
                          label="Notifiche"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Refresh />}
                      onClick={() => handleRefreshFeed(feed.id)}
                    >
                      Aggiorna
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => {
                        setSelectedFeed(feed);
                        setNewFeed(feed);
                        setEditFeedDialog(true);
                      }}
                    >
                      Modifica
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteFeed(feed.id)}
                    >
                      Elimina
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Lista Articoli */}
        <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
            📄 Articoli ({filteredItems.length})
                </Typography>
                
          <List>
            {filteredItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem>
                          <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" component="span">
                          {item.title}
                                </Typography>
                        {getSentimentIcon(item.sentiment)}
                              <Chip
                          label={item.category}
                          color={getCategoryColor(item.category) as any}
                                size="small"
                              />
                        {!item.isRead && (
                              <Chip
                            label="Nuovo"
                            color="error"
                                size="small"
                          />
                        )}
                              </Box>
                            }
                            secondary={
                              <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {item.description}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center">
                          <Typography variant="caption" color="textSecondary">
                            📅 {item.publishedAt.toLocaleDateString()}
                                </Typography>
                          <Typography variant="caption" color="textSecondary">
                            📰 {item.source}
                                </Typography>
                              </Box>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                    <Box display="flex" gap={1}>
                      <Tooltip title={item.isRead ? "Segna come non letto" : "Segna come letto"}>
                        <IconButton
                          onClick={() => handleMarkAsRead(item.id)}
                          color={item.isRead ? "default" : "primary"}
                        >
                          {item.isRead ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                      </Tooltip>
                      <Tooltip title={item.isBookmarked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}>
                        <IconButton
                          onClick={() => handleToggleBookmark(item.id)}
                          color={item.isBookmarked ? "primary" : "default"}
                        >
                          {item.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                              </IconButton>
                      </Tooltip>
                      <Button
                        size="small"
                        variant="outlined"
                        component="a"
                        href={item.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={!item.link}
                        onClick={() => {
                          if (item.link) {
                            // Marca come letto quando si apre l'articolo
                            handleMarkAsRead(item.id);
                          }
                        }}
                      >
                        Leggi Articolo Completo
                      </Button>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                {index < filteredItems.length - 1 && <Divider />}
              </React.Fragment>
                      ))}
                    </List>
        </Paper>

        {/* Dialog Aggiungi Feed */}
        <Dialog open={addFeedDialog} onClose={() => setAddFeedDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Aggiungi Nuovo Feed RSS</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nome Feed"
                value={newFeed.name}
                onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="URL Feed"
                value={newFeed.url}
                onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                fullWidth
                required
                placeholder="https://example.com/feed.xml"
              />
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={newFeed.category}
                  onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })}
                  label="Categoria"
                >
                  <MenuItem value="finance">Finanza</MenuItem>
                  <MenuItem value="crypto">Criptovalute</MenuItem>
                  <MenuItem value="technology">Tecnologia</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="politics">Politica</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={newFeed.autoRefresh}
                    onChange={(e) => setNewFeed({ ...newFeed, autoRefresh: e.target.checked })}
                  />
                }
                label="Aggiornamento automatico"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newFeed.notifications}
                    onChange={(e) => setNewFeed({ ...newFeed, notifications: e.target.checked })}
                  />
                }
                label="Notifiche"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddFeedDialog(false)}>Annulla</Button>
            <Button onClick={handleAddFeed} variant="contained" disabled={!newFeed.name || !newFeed.url}>
              Aggiungi Feed
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Modifica Feed */}
        <Dialog open={editFeedDialog} onClose={() => setEditFeedDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Modifica Feed RSS</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nome Feed"
                value={newFeed.name}
                onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="URL Feed"
                value={newFeed.url}
                onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={newFeed.category}
                  onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })}
                  label="Categoria"
                >
                  <MenuItem value="finance">Finanza</MenuItem>
                  <MenuItem value="crypto">Criptovalute</MenuItem>
                  <MenuItem value="technology">Tecnologia</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="politics">Politica</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={newFeed.autoRefresh}
                    onChange={(e) => setNewFeed({ ...newFeed, autoRefresh: e.target.checked })}
                  />
                }
                label="Aggiornamento automatico"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newFeed.notifications}
                    onChange={(e) => setNewFeed({ ...newFeed, notifications: e.target.checked })}
                  />
                }
                label="Notifiche"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditFeedDialog(false)}>Annulla</Button>
            <Button onClick={handleEditFeed} variant="contained" disabled={!newFeed.name || !newFeed.url}>
              Salva Modifiche
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Visualizza Articolo */}
        <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)} maxWidth="md" fullWidth>
          {selectedItem && (
            <>
              <DialogTitle>{selectedItem.title}</DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    {selectedItem.description}
                  </Typography>
                  {selectedItem.content && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      {selectedItem.content}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={selectedItem.category}
                      color={getCategoryColor(selectedItem.category) as any}
                    />
                    <Chip
                      label={selectedItem.sentiment}
                      icon={getSentimentIcon(selectedItem.sentiment)}
                      variant="outlined"
                    />
                    <Chip
                      label={selectedItem.source}
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                    Pubblicato il: {selectedItem.publishedAt.toLocaleString()}
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedItem(null)}>Chiudi</Button>
                <Button
                  component="a"
                  href={selectedItem.link}
                  target="_blank"
                  variant="contained"
                  disabled={!selectedItem.link}
                >
                  Leggi Articolo Completo
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default RSS;
