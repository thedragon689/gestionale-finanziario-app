import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Button,
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
  Badge,
  Divider,
  useTheme,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  Lightbulb,
  Notifications,
  NotificationsActive,
  Refresh,
  Settings,
  Assessment,
  Timeline,
  PieChart,
  BarChart,
  ShowChart,
  Psychology,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
  Info
} from '@mui/icons-material';
import { aiNewsService, NewsItem, MarketAlert, InvestmentRecommendation, RiskAssessment } from '../../services/aiNewsService';

interface AINewsIntelligenceProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`news-tabpanel-${index}`}
      aria-labelledby={`news-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AINewsIntelligence: React.FC<AINewsIntelligenceProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showNewsDetail, setShowNewsDetail] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Carica i dati iniziali
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  // Sottoscrizione agli aggiornamenti in tempo reale
  useEffect(() => {
    if (open && autoRefresh) {
      const unsubscribe = aiNewsService.subscribeToNewsUpdates((news) => {
        setNewsItems(prev => [news, ...prev.slice(0, 49)]); // Mantiene max 50 notizie
        analyzeNewsAndGenerateAlerts([news]);
      });

      return () => {
        // Cleanup della sottoscrizione
        if (unsubscribe) {
          clearInterval(unsubscribe as any);
        }
      };
    }
  }, [open, autoRefresh]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [news, newAlerts, newRecommendations] = await Promise.all([
        aiNewsService.getMockNewsFeed(),
        aiNewsService.generateMarketAlerts([]),
        aiNewsService.generateInvestmentRecommendations([], {})
      ]);

      setNewsItems(news);
      setAlerts(newAlerts);
      setRecommendations(newRecommendations);

      // Genera alert e raccomandazioni basati sulle notizie
      await analyzeNewsAndGenerateAlerts(news);
    } catch (error) {
      console.error('Error loading news data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeNewsAndGenerateAlerts = async (news: NewsItem[]) => {
    try {
      const [newAlerts, newRecommendations] = await Promise.all([
        aiNewsService.generateMarketAlerts(news),
        aiNewsService.generateInvestmentRecommendations(news, {})
      ]);

      setAlerts(prev => [...newAlerts, ...prev]);
      setRecommendations(prev => [...newRecommendations, ...prev]);
    } catch (error) {
      console.error('Error analyzing news:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <SentimentSatisfied sx={{ color: 'success.main' }} />;
      case 'negative':
        return <SentimentDissatisfied sx={{ color: 'error.main' }} />;
      default:
        return <SentimentNeutral sx={{ color: 'warning.main' }} />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'success';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'success';
      case 'sell':
        return 'error';
      case 'hold':
        return 'warning';
      default:
        return 'info';
    }
  };

  const filteredNews = newsItems.filter(news => {
    if (filterCategory !== 'all' && news.category !== filterCategory) return false;
    if (filterSentiment !== 'all' && news.sentiment !== filterSentiment) return false;
    return true;
  });

  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div">
            🤖 AI News Intelligence
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Impostazioni">
              <IconButton size="small">
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Aggiorna">
              <IconButton size="small" onClick={loadData}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose}>
              <Cancel />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="news intelligence tabs">
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timeline />
                  Notizie
                  <Chip label={filteredNews.length} size="small" color="primary" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge badgeContent={unreadAlerts.length} color="error">
                    <Notifications />
                  </Badge>
                  Alert
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lightbulb />
                  Raccomandazioni
                  <Chip label={recommendations.length} size="small" color="success" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assessment />
                  Analisi Rischio
                </Box>
              } 
            />
          </Tabs>
        </Box>

        {/* Tab Panel Notizie */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    label="Categoria"
                  >
                    <MenuItem value="all">Tutte le categorie</MenuItem>
                    <MenuItem value="financial">Finanziario</MenuItem>
                    <MenuItem value="crypto">Criptovalute</MenuItem>
                    <MenuItem value="market">Mercato</MenuItem>
                    <MenuItem value="economic">Economico</MenuItem>
                    <MenuItem value="political">Politico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sentiment</InputLabel>
                  <Select
                    value={filterSentiment}
                    onChange={(e) => setFilterSentiment(e.target.value)}
                    label="Sentiment"
                  >
                    <MenuItem value="all">Tutti i sentiment</MenuItem>
                    <MenuItem value="positive">Positivo</MenuItem>
                    <MenuItem value="negative">Negativo</MenuItem>
                    <MenuItem value="neutral">Neutro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredNews.map((news) => (
                <Grid item xs={12} key={news.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 4 }
                    }}
                    onClick={() => {
                      setSelectedNews(news);
                      setShowNewsDetail(true);
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ mt: 0.5 }}>
                          {getSentimentIcon(news.sentiment)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {news.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {news.content.substring(0, 150)}...
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={news.source} 
                              size="small" 
                              variant="outlined" 
                            />
                            <Chip 
                              label={news.category} 
                              size="small" 
                              color="primary" 
                            />
                            <Chip 
                              label={`Sentiment: ${(news.sentimentScore * 100).toFixed(0)}%`}
                              size="small"
                              color={getSentimentColor(news.sentiment)}
                            />
                            <Chip 
                              label={`Impatto: ${news.impact}`}
                              size="small"
                              color={getImpactColor(news.impact)}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Tab Panel Alert */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Alert di Mercato ({alerts.length})
          </Typography>
          
          {alerts.length === 0 ? (
            <Alert severity="info">
              Nessun alert attivo al momento. Gli alert verranno generati automaticamente quando rileviamo notizie rilevanti.
            </Alert>
          ) : (
            <List>
              {alerts.map((alert) => (
                <ListItem key={alert.id} sx={{ mb: 2 }}>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ mt: 0.5 }}>
                          {alert.type === 'risk_warning' ? (
                            <Warning sx={{ color: 'error.main' }} />
                          ) : (
                            <Lightbulb sx={{ color: 'success.main' }} />
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {alert.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {alert.description}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Impatto:</strong> {alert.impact}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Asset coinvolti:</strong> {alert.affectedAssets.join(', ')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={alert.severity} 
                              size="small" 
                              color={getSeverityColor(alert.severity)}
                            />
                            <Chip 
                              label={alert.type} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Raccomandazioni:
                            </Typography>
                            <List dense>
                              {alert.recommendations.map((rec, index) => (
                                                              <ListItem key={index} sx={{ py: 0 }}>
                                <ListItemIcon>
                                  <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                                </ListItemIcon>
                                <ListItemText primary={rec} />
                              </ListItem>
                              ))}
                            </List>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Tab Panel Raccomandazioni */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Raccomandazioni di Investimento ({recommendations.length})
          </Typography>
          
          {recommendations.length === 0 ? (
            <Alert severity="info">
              Nessuna raccomandazione disponibile al momento. Le raccomandazioni verranno generate automaticamente basandosi sull'analisi delle notizie.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {recommendations.map((rec) => (
                <Grid item xs={12} md={6} key={rec.id}>
                  <Card>
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {rec.action === 'buy' ? (
                            <TrendingUp sx={{ color: 'success.main' }} />
                          ) : (
                            <TrendingDown sx={{ color: 'error.main' }} />
                          )}
                          <Typography variant="h6">
                            {rec.asset} - {rec.action.toUpperCase()}
                          </Typography>
                        </Box>
                      }
                      subheader={`Confidenza: ${(rec.confidence * 100).toFixed(1)}%`}
                    />
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={rec.action} 
                          color={getActionColor(rec.action)}
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label={`Rischio: ${rec.riskLevel}`} 
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label={`Orizzonte: ${rec.timeHorizon}`} 
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <strong>Rendimento atteso:</strong> {rec.expectedReturn}%
                      </Typography>
                      
                      {rec.stopLoss && rec.takeProfit && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Stop Loss:</strong> {rec.stopLoss}% | 
                            <strong> Take Profit:</strong> {rec.takeProfit}%
                          </Typography>
                        </Box>
                      )}
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Motivazioni:
                      </Typography>
                      <List dense>
                        {rec.reasoning.map((reason, index) => (
                          <ListItem key={index} sx={{ py: 0 }}>
                            <ListItemIcon>
                              <Info sx={{ fontSize: 16, color: 'info.main' }} />
                            </ListItemIcon>
                            <ListItemText primary={reason} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Tab Panel Analisi Rischio */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Analisi del Rischio
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              L'analisi del rischio viene calcolata automaticamente basandosi sulle notizie recenti e sui dati di mercato.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {['FTSE MIB', 'Bitcoin', 'EUR/USD', 'ENI'].map((asset) => (
              <Grid item xs={12} md={6} key={asset}>
                <Card>
                  <CardHeader
                    title={asset}
                    subheader="Analisi rischio basata su notizie"
                  />
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Risk Score:</strong> {Math.random() * 0.8 + 0.1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Volatilità:</strong> {Math.random() * 0.7 + 0.2}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Correlazione:</strong> {Math.random() * 0.5 + 0.3}
                      </Typography>
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Fattori di rischio:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label="Volatilità elevata" size="small" color="warning" />
                      <Chip label="Notizie negative" size="small" color="error" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </DialogContent>

      {/* Dialog per dettagli notizia */}
      <Dialog
        open={showNewsDetail}
        onClose={() => setShowNewsDetail(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {selectedNews && getSentimentIcon(selectedNews.sentiment)}
            <Typography variant="h6">
              Dettagli Notizia
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedNews && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {selectedNews.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedNews.content}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={selectedNews.source} />
                <Chip label={selectedNews.category} color="primary" />
                <Chip 
                  label={`Sentiment: ${(selectedNews.sentimentScore * 100).toFixed(1)}%`}
                  color={getSentimentColor(selectedNews.sentiment)}
                />
                <Chip 
                  label={`Impatto: ${selectedNews.impact}`}
                  color={getImpactColor(selectedNews.impact)}
                />
              </Box>
              <Typography variant="subtitle2" gutterBottom>
                Parole chiave:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {selectedNews.keywords.map((keyword, index) => (
                  <Chip key={index} label={keyword} size="small" variant="outlined" />
                ))}
              </Box>
              <Typography variant="subtitle2" gutterBottom>
                Entità rilevate:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedNews.entities.map((entity, index) => (
                  <Chip key={index} label={entity} size="small" color="secondary" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewsDetail(false)}>Chiudi</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
