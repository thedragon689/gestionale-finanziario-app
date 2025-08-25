import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  Button,
  ButtonGroup
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  ScatterPlot as ScatterPlotIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Settings as SettingsIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ScatterChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
  Legend,
  Brush,
  ReferenceLine,
  ReferenceArea
} from 'recharts';

export interface AdvancedChartData {
  name: string;
  value: number;
  count: number;
  satisfaction: number;
  trend: number;
  [key: string]: any;
}

export interface AdvancedChartConfig {
  layout: 'single' | 'grid' | 'dashboard';
  charts: Array<{
    id: string;
    type: 'line' | 'area' | 'bar' | 'pie' | 'composed' | 'scatter' | 'bubble' | 'radar';
    title: string;
    dataKey: string;
    color: string;
    height: number;
    showGrid: boolean;
    showLegend: boolean;
    animate: boolean;
  }>;
  showBrush: boolean;
  showReferenceLines: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

interface AIAdvancedChartsProps {
  data: any;
  onChartUpdate?: (config: AdvancedChartConfig) => void;
}

export const AIAdvancedCharts: React.FC<AIAdvancedChartsProps> = ({ data, onChartUpdate }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLayout, setSelectedLayout] = useState<'single' | 'grid' | 'dashboard'>('dashboard');
  const [chartConfig, setChartConfig] = useState<AdvancedChartConfig>({
    layout: 'dashboard',
    charts: [
      {
        id: 'time-series',
        type: 'line',
        title: 'Attività Temporale',
        dataKey: 'activity',
        color: theme.palette.primary.main,
        height: 200,
        showGrid: true,
        showLegend: true,
        animate: true
      },
      {
        id: 'composition',
        type: 'pie',
        title: 'Distribuzione Categorie',
        dataKey: 'count',
        color: theme.palette.secondary.main,
        height: 200,
        showGrid: false,
        showLegend: true,
        animate: true
      },
      {
        id: 'trends',
        type: 'bar',
        title: 'Trend Domande',
        dataKey: 'count',
        color: theme.palette.success.main,
        height: 200,
        showGrid: true,
        showLegend: false,
        animate: true
      },
      {
        id: 'satisfaction',
        type: 'radar',
        title: 'Soddisfazione',
        dataKey: 'satisfaction',
        color: theme.palette.warning.main,
        height: 200,
        showGrid: true,
        showLegend: true,
        animate: true
      }
    ],
    showBrush: true,
    showReferenceLines: false,
    autoRefresh: false,
    refreshInterval: 30
  });
  const [showSettings, setShowSettings] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<[number, number]>([0, 23]);

  // Colori predefiniti per i grafici
  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  // Prepara i dati per i diversi tipi di grafici
  const chartData = useMemo(() => {
    if (!data) return {
      timeData: [],
      categoryData: [],
      questionData: [],
      keywordData: []
    };

    // Dati temporali
    const timeData = data.userBehavior?.timeOfDay?.map((hour: any) => ({
      name: `${hour.hour}:00`,
      hour: hour.hour,
      activity: hour.activity,
      trend: hour.activity > 5 ? 1 : hour.activity > 2 ? 0.5 : 0
    })) || [];

    // Dati categorie
    const categoryData = data.problemCategories?.map((category: any) => ({
      name: category.category,
      count: category.count,
      satisfaction: category.avgSatisfaction,
      trend: category.avgSatisfaction > 4 ? 1 : category.avgSatisfaction > 3 ? 0.5 : 0
    })) || [];

    // Dati domande popolari
    const questionData = data.popularQuestions?.slice(0, 8).map((question: any, index: number) => ({
      name: `Q${index + 1}`,
      count: question.count,
      trend: question.count > 10 ? 1 : question.count > 5 ? 0.5 : 0
    })) || [];

    // Dati parole chiave
    const keywordData = data.userBehavior?.commonKeywords?.slice(0, 6).map((keyword: any) => ({
      name: keyword.keyword,
      frequency: keyword.frequency,
      trend: keyword.frequency > 20 ? 1 : keyword.frequency > 10 ? 0.5 : 0
    })) || [];

    return {
      timeData,
      categoryData,
      questionData,
      keywordData
    };
  }, [data]);

  // Filtra i dati per il range temporale selezionato
  const filteredTimeData = useMemo(() => {
    return chartData.timeData.filter((item: any) => 
      item.hour >= selectedTimeRange[0] && item.hour <= selectedTimeRange[1]
    );
  }, [chartData.timeData, selectedTimeRange]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLayoutChange = (layout: 'single' | 'grid' | 'dashboard') => {
    setSelectedLayout(layout);
    setChartConfig(prev => ({ ...prev, layout }));
    onChartUpdate?.({ ...chartConfig, layout });
  };

  const handleChartTypeChange = (chartId: string, newType: string) => {
    setChartConfig(prev => ({
      ...prev,
      charts: prev.charts.map(chart => 
        chart.id === chartId ? { ...chart, type: newType as any } : chart
      )
    }));
    handleMenuClose();
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `ai-advanced-charts-${selectedLayout}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const renderSingleChart = (chart: any) => {
    const data = getChartData(chart.id);
    
    switch (chart.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={chart.height}>
            <LineChart data={data}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              {chart.showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={chart.dataKey}
                stroke={chart.color}
                strokeWidth={2}
                dot={{ fill: chart.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chart.color, strokeWidth: 2 }}
              />
              {chartConfig.showReferenceLines && (
                <ReferenceLine y={getAverageValue(data, chart.dataKey)} stroke="red" strokeDasharray="3 3" />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={chart.height}>
            <AreaChart data={data}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Area
                type="monotone"
                dataKey={chart.dataKey}
                fill={chart.color}
                stroke={chart.color}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chart.height}>
            <BarChart data={data}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey={chart.dataKey} fill={chart.color} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={chart.height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey={chart.dataKey}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={defaultColors[index % defaultColors.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={chart.height}>
            <ComposedChart data={data}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="count" fill={theme.palette.primary.main} />
              <Line type="monotone" dataKey="satisfaction" stroke={theme.palette.success.main} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={chart.height}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar
                name="Valore"
                dataKey={chart.dataKey}
                stroke={chart.color}
                fill={chart.color}
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: chart.height }}>
            <Typography variant="body2" color="text.secondary">
              Tipo non supportato
            </Typography>
          </Box>
        );
    }
  };

  const getChartData = (chartId: string) => {
    switch (chartId) {
      case 'time-series':
        return filteredTimeData;
      case 'composition':
        return chartData.categoryData;
      case 'trends':
        return chartData.questionData;
      case 'satisfaction':
        return chartData.categoryData;
      default:
        return [];
    }
  };

  const getAverageValue = (data: any[], key: string) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + (item[key] || 0), 0);
    return sum / data.length;
  };

  const chartTypes = [
    { key: 'line', label: 'Linea', icon: <LineChartIcon /> },
    { key: 'area', label: 'Area', icon: <LineChartIcon /> },
    { key: 'bar', label: 'Barre', icon: <BarChartIcon /> },
    { key: 'pie', label: 'Torta', icon: <PieChartIcon /> },
    { key: 'composed', label: 'Composto', icon: <LineChartIcon /> },
    { key: 'radar', label: 'Radar', icon: <ScatterPlotIcon /> }
  ];

  const layouts = [
    { key: 'single', label: 'Singolo', icon: <ViewListIcon />, description: 'Un grafico alla volta' },
    { key: 'grid', label: 'Griglia', icon: <ViewModuleIcon />, description: 'Layout a griglia 2x2' },
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, description: 'Layout dashboard completo' }
  ];

  return (
    <Paper 
      sx={{ 
        p: 2, 
        position: 'relative',
        height: fullscreen ? '100vh' : 'auto',
        zIndex: fullscreen ? 9999 : 1
      }}
    >
      {/* Header del grafico avanzato */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" color="primary">
          Grafici Avanzati AI
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Selezione layout */}
          <ButtonGroup size="small" variant="outlined">
            {layouts.map((layout) => (
              <Tooltip key={layout.key} title={layout.description}>
                <Button
                  onClick={() => handleLayoutChange(layout.key as any)}
                  variant={selectedLayout === layout.key ? 'contained' : 'outlined'}
                  startIcon={layout.icon}
                >
                  {layout.label}
                </Button>
              </Tooltip>
            ))}
          </ButtonGroup>

          {/* Pulsante impostazioni */}
          <Tooltip title="Impostazioni avanzate">
            <IconButton
              size="small"
              onClick={() => setShowSettings(!showSettings)}
              color={showSettings ? 'primary' : 'default'}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Pulsante fullscreen */}
          <Tooltip title={fullscreen ? 'Esci da schermo intero' : 'Schermo intero'}>
            <IconButton
              size="small"
              onClick={() => setFullscreen(!fullscreen)}
            >
              <FullscreenIcon />
            </IconButton>
          </Tooltip>

          {/* Pulsante download */}
          <Tooltip title="Scarica grafici">
            <IconButton size="small" onClick={handleDownload}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>

          {/* Menu a 3 puntini */}
          <Tooltip title="Opzioni grafici">
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Menu contestuale per selezione tipo grafico */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 250 }
        }}
      >
        <Typography variant="subtitle2" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Cambia Tipo Grafico
        </Typography>
        {chartConfig.charts.map((chart) => (
          <MenuItem key={chart.id} onClick={() => handleMenuClose()}>
            <ListItemIcon>{chartTypes.find(t => t.key === chart.type)?.icon}</ListItemIcon>
            <ListItemText
              primary={chart.title}
              secondary={`Tipo attuale: ${chartTypes.find(t => t.key === chart.type)?.label}`}
            />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => setShowSettings(true)}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Configura Grafici" />
        </MenuItem>
      </Menu>

      {/* Pannello impostazioni avanzate */}
      {showSettings && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Configurazione Avanzata Grafici
          </Typography>
          
          {/* Configurazione singoli grafici */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {chartConfig.charts.map((chart, index) => (
              <Grid item xs={12} md={6} key={chart.id}>
                <Paper sx={{ p: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {chart.title}
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Tipo</InputLabel>
                        <Select
                          value={chart.type}
                          onChange={(e) => handleChartTypeChange(chart.id, e.target.value)}
                          label="Tipo"
                        >
                          {chartTypes.map((type) => (
                            <MenuItem key={type.key} value={type.key}>
                              {type.icon} {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Altezza</InputLabel>
                        <Select
                          value={chart.height}
                          onChange={(e) => {
                            setChartConfig(prev => ({
                              ...prev,
                              charts: prev.charts.map(c => 
                                c.id === chart.id ? { ...c, height: e.target.value as number } : c
                              )
                            }));
                          }}
                          label="Altezza"
                        >
                          <MenuItem value={150}>150px</MenuItem>
                          <MenuItem value={200}>200px</MenuItem>
                          <MenuItem value={250}>250px</MenuItem>
                          <MenuItem value={300}>300px</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={chart.showGrid}
                            onChange={(e) => {
                              setChartConfig(prev => ({
                                ...prev,
                                charts: prev.charts.map(c => 
                                  c.id === chart.id ? { ...c, showGrid: e.target.checked } : c
                                )
                              }));
                            }}
                          />
                        }
                        label="Mostra Griglia"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={chart.showLegend}
                            onChange={(e) => {
                              setChartConfig(prev => ({
                                ...prev,
                                charts: prev.charts.map(c => 
                                  c.id === chart.id ? { ...c, showLegend: e.target.checked } : c
                                )
                              }));
                            }}
                          />
                        }
                        label="Mostra Legenda"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Configurazioni globali */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.showBrush}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, showBrush: e.target.checked }))}
                  />
                }
                label="Mostra Selezione Temporale"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.showReferenceLines}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, showReferenceLines: e.target.checked }))}
                  />
                }
                label="Linee di Riferimento"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.autoRefresh}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, autoRefresh: e.target.checked }))}
                  />
                }
                label="Aggiornamento Automatico"
              />
            </Grid>
            {chartConfig.autoRefresh && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Intervallo Aggiornamento: {chartConfig.refreshInterval}s
                </Typography>
                <Slider
                  value={chartConfig.refreshInterval}
                  onChange={(_, value) => setChartConfig(prev => ({ ...prev, refreshInterval: value as number }))}
                  min={5}
                  max={60}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Selezione range temporale */}
      {chartConfig.showBrush && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Selezione Range Temporale
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={selectedTimeRange}
              onChange={(_, value) => setSelectedTimeRange(value as [number, number])}
              min={0}
              max={23}
              step={1}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}:00`}
            />
            <Typography variant="caption" color="text.secondary">
              Range selezionato: {selectedTimeRange[0]}:00 - {selectedTimeRange[1]}:00
            </Typography>
          </Box>
        </Box>
      )}

      {/* Rendering dei grafici in base al layout */}
      <Box sx={{ position: 'relative' }}>
        {selectedLayout === 'single' && (
          <Box>
            {chartConfig.charts[0] && renderSingleChart(chartConfig.charts[0])}
          </Box>
        )}

        {selectedLayout === 'grid' && (
          <Grid container spacing={2}>
            {chartConfig.charts.slice(0, 4).map((chart) => (
              <Grid item xs={12} sm={6} key={chart.id}>
                <Paper sx={{ p: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                    {chart.title}
                  </Typography>
                  {renderSingleChart(chart)}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {selectedLayout === 'dashboard' && (
          <Grid container spacing={2}>
            {chartConfig.charts.map((chart) => (
              <Grid item xs={12} lg={6} key={chart.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {chart.title}
                  </Typography>
                  {renderSingleChart(chart)}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Indicatore di caricamento se non ci sono dati */}
        {Object.values(chartData).every(data => data.length === 0) && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 300,
            textAlign: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              Nessun dato disponibile per i grafici
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer con informazioni */}
      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Layout: {layouts.find(l => l.key === selectedLayout)?.label} | 
          Grafici: {chartConfig.charts.length} | 
          Ultimo aggiornamento: {new Date().toLocaleTimeString('it-IT')}
        </Typography>
      </Box>
    </Paper>
  );
};
