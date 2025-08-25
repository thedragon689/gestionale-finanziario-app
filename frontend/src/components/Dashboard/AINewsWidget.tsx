import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Badge,
  useTheme
} from '@mui/material';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Warning,
  Lightbulb,
  Notifications,
  OpenInNew,
  Psychology,
  Assessment
} from '@mui/icons-material';
import { aiNewsService, NewsItem, MarketAlert } from '../../services/aiNewsService';
import { AINewsIntelligence } from '../AINewsIntelligence';

interface AINewsWidgetProps {
  maxNews?: number;
  showAlerts?: boolean;
}

export const AINewsWidget: React.FC<AINewsWidgetProps> = ({ 
  maxNews = 3, 
  showAlerts = true 
}) => {
  const theme = useTheme();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewsIntelligence, setShowNewsIntelligence] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [news, newAlerts] = await Promise.all([
        aiNewsService.getMockNewsFeed(),
        aiNewsService.generateMarketAlerts([])
      ]);

      setNewsItems(news.slice(0, maxNews));
      setAlerts(newAlerts.slice(0, 3)); // Mostra solo i primi 3 alert
    } catch (error) {
      console.error('Error loading news data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'negative':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      default:
        return <TrendingUp sx={{ color: 'warning.main' }} />;
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

  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Newspaper />
              <Typography variant="h6">
                AI News Intelligence
              </Typography>
              {unreadAlerts.length > 0 && (
                <Badge badgeContent={unreadAlerts.length} color="error">
                  <Notifications />
                </Badge>
              )}
            </Box>
          }
          action={
            <Tooltip title="Apri News AI">
              <IconButton 
                size="small" 
                onClick={() => setShowNewsIntelligence(true)}
                color="primary"
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Caricamento notizie...
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* Notizie recenti */}
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                📰 Ultime Notizie
              </Typography>
              <List dense>
                {newsItems.map((news) => (
                  <ListItem key={news.id} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {getSentimentIcon(news.sentiment)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {news.title.length > 60 
                            ? `${news.title.substring(0, 60)}...` 
                            : news.title
                          }
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {news.source} • {new Date(news.publishedAt).toLocaleDateString('it-IT')}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      <Chip 
                        label={`Sentiment: ${(news.sentimentScore * 100).toFixed(0)}%`}
                        size="small"
                        color={getSentimentColor(news.sentiment)}
                        variant="outlined"
                      />
                      <Chip 
                        label={`Impatto: ${news.impact}`}
                        size="small"
                        color={getImpactColor(news.impact)}
                        variant="outlined"
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>

              {/* Alert attivi */}
              {showAlerts && alerts.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                    🚨 Alert Attivi
                  </Typography>
                  <List dense>
                    {alerts.slice(0, 2).map((alert) => (
                      <ListItem key={alert.id} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {alert.type === 'risk_warning' ? (
                            <Warning sx={{ color: 'error.main' }} />
                          ) : (
                            <Lightbulb sx={{ color: 'success.main' }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {alert.title.length > 50 
                                ? `${alert.title.substring(0, 50)}...` 
                                : alert.title
                              }
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {alert.affectedAssets.join(', ')}
                            </Typography>
                          }
                        />
                        <Box sx={{ mt: 0.5 }}>
                          <Chip 
                            label={alert.severity}
                            size="small"
                            color={alert.severity === 'critical' ? 'error' : 'warning'}
                            variant="outlined"
                          />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Pulsante per aprire il sistema completo - RIMOSSO, mantenuta solo l'icona nell'header */}
              {/* <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<Psychology />}
                  onClick={() => setShowNewsIntelligence(true)}
                  fullWidth
                >
                  🚀 Apri AI News Intelligence
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Analisi completa, alert e raccomandazioni
                </Typography>
              </Box> */}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog AI News Intelligence */}
      <AINewsIntelligence
        open={showNewsIntelligence}
        onClose={() => setShowNewsIntelligence(false)}
      />
    </>
  );
};
