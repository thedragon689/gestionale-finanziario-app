import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
  useTheme
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as LightbulbIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Category as CategoryIcon,
  QuestionAnswer as QuestionIcon,
  Schedule as ScheduleIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { AILearningEngine, LearningMetrics } from './AILearningEngine';
import { AICharts } from './AICharts';
import { AIAdvancedCharts } from './AIAdvancedCharts';

interface AILearningDashboardProps {
  open: boolean;
  onClose: () => void;
}

export const AILearningDashboard: React.FC<AILearningDashboardProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [learningEngine] = useState(() => new AILearningEngine());
  const [metrics, setMetrics] = useState<LearningMetrics | null>(null);
  const [improvementSuggestions, setImprovementSuggestions] = useState<string[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportData, setExportData] = useState('');
  const [showCharts, setShowCharts] = useState(false);
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<string>('time-series');

  useEffect(() => {
    if (open) {
      loadMetrics();
    }
  }, [open]);

  const loadMetrics = () => {
    const currentMetrics = learningEngine.getLearningMetrics();
    const suggestions = learningEngine.getImprovementSuggestions();
    setMetrics(currentMetrics);
    setImprovementSuggestions(suggestions);
  };

  const handleExport = () => {
    const data = learningEngine.exportLearningData();
    setExportData(data);
    setShowExportDialog(true);
  };

  const handleReset = () => {
    if (window.confirm('Sei sicuro di voler resettare tutti i dati di apprendimento? Questa azione non può essere annullata.')) {
      learningEngine.resetLearningData();
      loadMetrics();
    }
  };

  const downloadExport = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-learning-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getSatisfactionColor = (satisfaction: number): string => {
    if (satisfaction >= 4) return theme.palette.success.main;
    if (satisfaction >= 3) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }}>
        <PsychologyIcon />
        <Typography variant="h6">
          Dashboard Apprendimento AI
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Tooltip title="Grafici Base">
            <IconButton 
              onClick={() => setShowCharts(!showCharts)} 
              sx={{ color: showCharts ? 'inherit' : 'rgba(255,255,255,0.7)' }}
            >
              <BarChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Grafici Avanzati">
            <IconButton 
              onClick={() => setShowAdvancedCharts(!showAdvancedCharts)} 
              sx={{ color: showAdvancedCharts ? 'inherit' : 'rgba(255,255,255,0.7)' }}
            >
              <TimelineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Aggiorna metriche">
            <IconButton onClick={loadMetrics} sx={{ color: 'inherit' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Esporta dati">
            <IconButton onClick={handleExport} sx={{ color: 'inherit' }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset dati">
            <IconButton onClick={handleReset} sx={{ color: 'inherit' }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {!metrics ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <LinearProgress sx={{ width: '50%' }} />
          </Box>
        ) : (
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            {/* Metriche principali */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: theme.palette.primary.light, color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {metrics.totalInteractions}
                    </Typography>
                    <Typography variant="body2">
                      Interazioni Totali
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: theme.palette.success.light, color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {formatPercentage(metrics.responseAccuracy)}
                    </Typography>
                    <Typography variant="body2">
                      Accuratezza Risposte
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: theme.palette.info.light, color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {metrics.averageSatisfaction.toFixed(1)}/5
                    </Typography>
                    <Typography variant="body2">
                      Soddisfazione Media
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: theme.palette.warning.light, color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {metrics.positiveFeedback}
                    </Typography>
                    <Typography variant="body2">
                      Feedback Positivi
                    </Typography>
                  </CardContent>
                </Card>
                          </Grid>
          </Grid>

          {/* Grafici Base */}
          {showCharts && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChartIcon color="primary" />
                Grafici Interattivi
              </Typography>
              <AICharts 
                data={metrics} 
                onChartTypeChange={setSelectedChartType}
              />
            </Box>
          )}

          {/* Grafici Avanzati */}
          {showAdvancedCharts && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon color="primary" />
                Grafici Avanzati e Compositi
              </Typography>
              <AIAdvancedCharts 
                data={metrics}
                onChartUpdate={(config) => console.log('Configurazione grafici aggiornata:', config)}
              />
            </Box>
          )}

          <Grid container spacing={3}>
              {/* Domande popolari */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 'fit-content' }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QuestionIcon color="primary" />
                    Domande Popolari
                  </Typography>
                  <List dense>
                    {metrics.popularQuestions.slice(0, 5).map((item, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Typography variant="body2" color="primary">
                            {index + 1}.
                          </Typography>
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.question}
                          secondary={`${item.count} volte`}
                        />
                        <Chip 
                          label={item.count} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              {/* Categorie di problemi */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 'fit-content' }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon color="primary" />
                    Categorie Problemi
                  </Typography>
                  <List dense>
                    {metrics.problemCategories.slice(0, 5).map((item, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Typography variant="body2" color="primary">
                            {index + 1}.
                          </Typography>
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.category}
                          secondary={`${item.count} problemi`}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            color={getSatisfactionColor(item.avgSatisfaction)}
                            sx={{ fontWeight: 'bold' }}
                          >
                            {item.avgSatisfaction.toFixed(1)}/5
                          </Typography>
                          <Chip 
                            label={item.count} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              {/* Parole chiave comuni */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AnalyticsIcon color="primary" />
                    Parole Chiave Comuni
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {metrics.userBehavior.commonKeywords.slice(0, 10).map((item, index) => (
                      <Chip
                        key={index}
                        label={`${item.keyword} (${item.frequency})`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Attività per ora del giorno */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="primary" />
                    Attività per Ora
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'end', height: 120, gap: 0.5 }}>
                    {metrics.userBehavior.timeOfDay.map((hour, index) => {
                      const maxActivity = Math.max(...metrics.userBehavior.timeOfDay.map(h => h.activity));
                      const height = maxActivity > 0 ? (hour.activity / maxActivity) * 100 : 0;
                      
                      return (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <Box
                            sx={{
                              width: '100%',
                              height: `${height}%`,
                              bgcolor: theme.palette.primary.main,
                              borderRadius: '4px 4px 0 0',
                              minHeight: hour.activity > 0 ? '4px' : '0'
                            }}
                          />
                          <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                            {hour.hour}:00
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              </Grid>

              {/* Suggerimenti di miglioramento */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.warning.light }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LightbulbIcon color="warning" />
                    Suggerimenti di Miglioramento
                  </Typography>
                  {improvementSuggestions.length > 0 ? (
                    <List dense>
                      {improvementSuggestions.map((suggestion, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Typography variant="body2" color="warning.dark">
                              💡
                            </Typography>
                          </ListItemIcon>
                          <ListItemText primary={suggestion} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="warning.dark">
                      Ottimo lavoro! L'AI sta funzionando bene. Continua a monitorare le metriche per identificare aree di miglioramento.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} color="primary">
          Chiudi
        </Button>
      </DialogActions>

      {/* Dialog per esportazione dati */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Esporta Dati di Apprendimento</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            I dati di apprendimento contengono informazioni sulle interazioni, pattern e metriche dell'AI. 
            Puoi utilizzarli per analisi esterne o backup.
          </Typography>
          <Box sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1, 
            maxHeight: 300, 
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.8rem'
          }}>
            <pre>{exportData}</pre>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>
            Annulla
          </Button>
          <Button onClick={downloadExport} variant="contained" startIcon={<DownloadIcon />}>
            Scarica JSON
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
