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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Refresh,
  Bookmark,
  BookmarkBorder,
  Add,
  Edit,
  Delete,
  OpenInNew,
  RssFeed,
  FilterList,
  Search,
} from '@mui/icons-material';

import { rssService, RSSFeed, RSSItem, RSSFilters } from '../../services/rssService';

const RSS: React.FC = () => {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RSSFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFeed, setSelectedFeed] = useState<string>('');
  const [addFeedDialog, setAddFeedDialog] = useState(false);
  const [newFeed, setNewFeed] = useState({
    name: '',
    url: '',
    category: 'finance' as const,
    isActive: true,
  });

  // Load feeds and items
  useEffect(() => {
    loadData();
  }, []);

  // Load items when filters change
  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feedsData, itemsData] = await Promise.all([
        rssService.getFeeds(),
        rssService.getItems(),
      ]);
      setFeeds(feedsData);
      setItems(itemsData);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento dei dati RSS');
      console.error('Failed to load RSS data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      const itemsData = await rssService.getItems(filters);
      setItems(itemsData);
    } catch (err) {
      console.error('Failed to load RSS items:', err);
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      searchTerm: searchTerm || undefined,
    }));
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setFilters(prev => ({
      ...prev,
      category: category || undefined,
    }));
  };

  const handleFeedFilter = (feedId: string) => {
    setSelectedFeed(feedId);
    setFilters(prev => ({
      ...prev,
      feedId: feedId || undefined,
    }));
  };

  const handleMarkAsRead = async (itemId: string) => {
    try {
      await rssService.markAsRead(itemId);
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, isRead: true } : item
      ));
    } catch (err) {
      console.error('Failed to mark item as read:', err);
    }
  };

  const handleToggleBookmark = async (itemId: string) => {
    try {
      await rssService.toggleBookmark(itemId);
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, isBookmarked: !item.isBookmarked } : item
      ));
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleAddFeed = async () => {
    try {
      await rssService.addFeed(newFeed);
      setAddFeedDialog(false);
      setNewFeed({ name: '', url: '', category: 'finance', isActive: true });
      await loadData();
    } catch (err) {
      console.error('Failed to add feed:', err);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
      finance: 'primary',
      stocks: 'secondary',
      crypto: 'warning',
      economy: 'success',
    };
    return colors[category] || 'default';
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
            RSS Borsa
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setAddFeedDialog(true)}
              sx={{ mr: 1 }}
            >
              Aggiungi Feed
            </Button>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleRefresh}
            >
              Aggiorna
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Cerca notizie"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleSearch}>
                        <Search />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                    label="Categoria"
                  >
                    <MenuItem value="">Tutte</MenuItem>
                    <MenuItem value="finance">Finanza</MenuItem>
                    <MenuItem value="stocks">Azioni</MenuItem>
                    <MenuItem value="crypto">Criptovalute</MenuItem>
                    <MenuItem value="economy">Economia</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Feed</InputLabel>
                  <Select
                    value={selectedFeed}
                    onChange={(e) => handleFeedFilter(e.target.value)}
                    label="Feed"
                  >
                    <MenuItem value="">Tutti</MenuItem>
                    {feeds.map((feed) => (
                      <MenuItem key={feed.id} value={feed.id}>
                        {feed.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['finance', 'stocks', 'crypto', 'economy'].map((category) => (
                    <Chip
                      key={category}
                      label={category === 'finance' ? 'Finanza' : 
                             category === 'stocks' ? 'Azioni' :
                             category === 'crypto' ? 'Crypto' : 'Economia'}
                      color={getCategoryColor(category)}
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                      onClick={() => handleCategoryFilter(selectedCategory === category ? '' : category)}
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* RSS Items */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notizie ({items.length})
                </Typography>
                <List>
                  {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem
                        sx={{
                          backgroundColor: item.isRead ? 'transparent' : 'action.hover',
                          '&:hover': { backgroundColor: 'action.hover' },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: item.isRead ? 'normal' : 'bold',
                                  color: item.isRead ? 'text.secondary' : 'text.primary',
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Chip
                                label={item.category === 'finance' ? 'Finanza' : 
                                       item.category === 'stocks' ? 'Azioni' :
                                       item.category === 'crypto' ? 'Crypto' : 'Economia'}
                                color={getCategoryColor(item.category || 'finance')}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {item.description}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(item.pubDate)}
                                </Typography>
                                {item.author && (
                                  <Typography variant="caption" color="text.secondary">
                                    di {item.author}
                                  </Typography>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                  {feeds.find(f => f.id === item.feedId)?.name}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleToggleBookmark(item.id)}
                              color={item.isBookmarked ? 'primary' : 'default'}
                            >
                              {item.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                            </IconButton>
                            <IconButton
                              onClick={() => handleMarkAsRead(item.id)}
                              disabled={item.isRead}
                            >
                              <OpenInNew />
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Feed RSS ({feeds.length})
                </Typography>
                <List>
                  {feeds.map((feed) => (
                    <ListItem key={feed.id}>
                      <ListItemText
                        primary={feed.name}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {feed.url}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Ultimo aggiornamento: {formatDate(feed.lastUpdate)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={feed.isActive ? 'Attivo' : 'Inattivo'}
                            color={feed.isActive ? 'success' : 'default'}
                            size="small"
                          />
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Feed Dialog */}
        <Dialog open={addFeedDialog} onClose={() => setAddFeedDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Aggiungi Nuovo Feed RSS</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Nome Feed"
                value={newFeed.name}
                onChange={(e) => setNewFeed(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="URL Feed"
                value={newFeed.url}
                onChange={(e) => setNewFeed(prev => ({ ...prev, url: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={newFeed.category}
                  onChange={(e) => setNewFeed(prev => ({ ...prev, category: e.target.value as any }))}
                  label="Categoria"
                >
                  <MenuItem value="finance">Finanza</MenuItem>
                  <MenuItem value="stocks">Azioni</MenuItem>
                  <MenuItem value="crypto">Criptovalute</MenuItem>
                  <MenuItem value="economy">Economia</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={newFeed.isActive}
                    onChange={(e) => setNewFeed(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Feed Attivo"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddFeedDialog(false)}>Annulla</Button>
            <Button onClick={handleAddFeed} variant="contained">Aggiungi</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default RSS;
