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
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  BubbleChart as BubbleChartIcon,
  ScatterPlot as ScatterPlotIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  Settings as SettingsIcon
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
  Funnel
} from 'recharts';

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartConfig {
  type: 'line' | 'area' | 'bar' | 'pie' | 'composed' | 'scatter' | 'bubble' | 'radar' | 'funnel';
  title: string;
  data: ChartData[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  height?: number;
}

export interface BaseChartConfig {
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  height?: number;
}

export interface LineChartConfig extends BaseChartConfig {
  type: 'line';
  title: string;
  data: ChartData[];
  xAxis: string;
  yAxis: string;
  colors?: string[];
}

export interface AreaChartConfig extends BaseChartConfig {
  type: 'area';
  title: string;
  data: ChartData[];
  xAxis: string;
  yAxis: string;
  colors?: string[];
}

export interface BarChartConfig extends BaseChartConfig {
  type: 'bar';
  title: string;
  data: ChartData[];
  xAxis: string;
  yAxis: string;
  colors?: string[];
}

export interface PieChartConfig extends BaseChartConfig {
  type: 'pie';
  title: string;
  data: ChartData[];
  colors?: string[];
}

export interface ComposedChartConfig extends BaseChartConfig {
  type: 'composed';
  title: string;
  data: ChartData[];
  xAxis: string;
  yAxis: string;
  colors?: string[];
}

export interface ScatterChartConfig extends BaseChartConfig {
  type: 'scatter';
  title: string;
  data: ChartData[];
  xAxis: string;
  yAxis: string;
  colors?: string[];
}

export interface BubbleChartConfig extends BaseChartConfig {
  type: 'bubble';
  title: string;
  data: ChartData[];
  xAxis: string;
  yAxis: string;
  colors?: string[];
}

export interface RadarChartConfig extends BaseChartConfig {
  type: 'radar';
  title: string;
  data: ChartData[];
  colors?: string[];
}

export interface FunnelChartConfig extends BaseChartConfig {
  type: 'funnel';
  title: string;
  data: ChartData[];
  colors?: string[];
}

export type AnyChartConfig = LineChartConfig | AreaChartConfig | BarChartConfig | PieChartConfig | ComposedChartConfig | ScatterChartConfig | BubbleChartConfig | RadarChartConfig | FunnelChartConfig;

interface AIChartsProps {
  data: any;
  onChartTypeChange?: (type: string) => void;
}

export const AICharts: React.FC<AIChartsProps> = ({ data, onChartTypeChange }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChartType, setSelectedChartType] = useState<string>('line');
  const [chartConfig, setChartConfig] = useState<AnyChartConfig>({
    type: 'line',
    title: 'Metriche Temporali',
    data: [],
    xAxis: 'name',
    yAxis: 'value',
    showGrid: true,
    showLegend: true,
    animate: true,
    height: 300
  });
  const [showSettings, setShowSettings] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

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
    if (!data) return [];

    switch (selectedChartType) {
      case 'time-series':
        return data.userBehavior?.timeOfDay?.map((hour: any) => ({
          name: `${hour.hour}:00`,
          value: hour.activity,
          hour: hour.hour,
          activity: hour.activity
        })) || [];

      case 'composition':
        return data.problemCategories?.map((category: any) => ({
          name: category.category,
          value: category.count,
          satisfaction: category.avgSatisfaction,
          count: category.count
        })) || [];

      case 'trends':
        return data.popularQuestions?.slice(0, 10).map((question: any, index: number) => ({
          name: `Q${index + 1}`,
          value: question.count,
          question: question.question,
          count: question.count
        })) || [];

      case 'keywords':
        return data.userBehavior?.commonKeywords?.map((keyword: any) => ({
          name: keyword.keyword,
          value: keyword.frequency,
          frequency: keyword.frequency
        })) || [];

      case 'satisfaction':
        return data.problemCategories?.map((category: any) => ({
          name: category.category,
          value: category.avgSatisfaction,
          count: category.count,
          satisfaction: category.avgSatisfaction
        })) || [];

      default:
        return [];
    }
  }, [data, selectedChartType]);

  // Configurazioni per i diversi tipi di grafici
  const chartConfigs = useMemo(() => {
    const baseConfig = {
      showGrid: chartConfig.showGrid,
      showLegend: chartConfig.showLegend,
      animate: chartConfig.animate,
      height: chartConfig.height
    };

    switch (selectedChartType) {
      case 'time-series':
        return {
          ...baseConfig,
          type: 'line' as const,
          title: 'Attività per Ora del Giorno',
          data: chartData,
          xAxis: 'name',
          yAxis: 'value',
          colors: [theme.palette.primary.main]
        };

      case 'composition':
        return {
          ...baseConfig,
          type: 'pie' as const,
          title: 'Composizione per Categoria',
          data: chartData,
          colors: defaultColors
        };

      case 'trends':
        return {
          ...baseConfig,
          type: 'bar' as const,
          title: 'Trend Domande Popolari',
          data: chartData,
          xAxis: 'name',
          yAxis: 'value',
          colors: [theme.palette.secondary.main]
        };

      case 'keywords':
        return {
          ...baseConfig,
          type: 'bubble' as const,
          title: 'Cloud Parole Chiave',
          data: chartData,
          xAxis: 'name',
          yAxis: 'value',
          colors: defaultColors
        };

      case 'satisfaction':
        return {
          ...baseConfig,
          type: 'radar' as const,
          title: 'Soddisfazione per Categoria',
          data: chartData,
          colors: [theme.palette.success.main]
        };

      default:
        return baseConfig;
    }
  }, [selectedChartType, chartData, chartConfig, theme.palette]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChartTypeChange = (type: string) => {
    setSelectedChartType(type);
    setChartConfig(prev => ({ ...prev, type: type as any }));
    onChartTypeChange?.(type);
    handleMenuClose();
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `ai-chart-${selectedChartType}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const renderChart = () => {
    const config = chartConfigs as AnyChartConfig;
    
    switch (config.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <LineChart data={config.data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <RechartsTooltip />
              {config.showLegend && <RechartsTooltip />}
              <Line
                type="monotone"
                dataKey={config.yAxis}
                stroke={config.colors?.[0]}
                strokeWidth={2}
                dot={{ fill: config.colors?.[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: config.colors?.[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <AreaChart data={config.data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <RechartsTooltip />
              <Area
                type="monotone"
                dataKey={config.yAxis}
                fill={config.colors?.[0]}
                stroke={config.colors?.[0]}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <BarChart data={config.data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey={config.yAxis} fill={config.colors?.[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <PieChart>
              <Pie
                data={config.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {config.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={config.colors?.[index % config.colors!.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <ComposedChart data={config.data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="count" fill={theme.palette.primary.main} />
              <Line type="monotone" dataKey="satisfaction" stroke={theme.palette.success.main} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <ScatterChart data={config.data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <RechartsTooltip />
              <Scatter fill={config.colors?.[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'bubble':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <ScatterChart data={config.data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <RechartsTooltip />
              <Scatter dataKey="value" fill={config.colors?.[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <RadarChart data={config.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar
                name="Soddisfazione"
                dataKey="satisfaction"
                stroke={config.colors?.[0]}
                fill={config.colors?.[0]}
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'funnel':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <FunnelChart>
              <RechartsTooltip />
              <Funnel
                dataKey="value"
                data={config.data}
                isAnimationActive={config.animate}
              >
                {config.data.map((entry: any, index: number) => (
                  <Cell key={`funnel-${index}`} fill={config.colors?.[index % (config.colors?.length || 1)]} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography variant="body2" color="text.secondary">
              Tipo di grafico non supportato
            </Typography>
          </Box>
        );
    }
  };

  const chartTypes = [
    { key: 'time-series', label: 'Grafici Temporali', icon: <TimelineIcon />, description: 'Serie temporali per attività e trend' },
    { key: 'composition', label: 'Grafici di Composizione', icon: <PieChartIcon />, description: 'Distribuzione percentuale per categorie' },
    { key: 'trends', label: 'Trend e Andamenti', icon: <TrendingUpIcon />, description: 'Barre per confronti e ranking' },
    { key: 'keywords', label: 'Cloud Parole Chiave', icon: <BubbleChartIcon />, description: 'Bolle per frequenza e importanza' },
    { key: 'satisfaction', label: 'Radar Soddisfazione', icon: <ScatterPlotIcon />, description: 'Radar per metriche multiple' }
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
      {/* Header del grafico */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" color="primary">
          {(chartConfigs as AnyChartConfig).title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Pulsante impostazioni */}
          <Tooltip title="Impostazioni grafico">
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
          <Tooltip title="Scarica grafico">
            <IconButton size="small" onClick={handleDownload}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>

          {/* Menu a 3 puntini */}
          <Tooltip title="Opzioni grafico">
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
        {chartTypes.map((chartType) => (
          <MenuItem
            key={chartType.key}
            onClick={() => handleChartTypeChange(chartType.key)}
            selected={selectedChartType === chartType.key}
          >
            <ListItemIcon>{chartType.icon}</ListItemIcon>
            <ListItemText
              primary={chartType.label}
              secondary={chartType.description}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Pannello impostazioni */}
      {showSettings && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Configurazione Grafico
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Altezza</InputLabel>
                <Select
                  value={chartConfig.height}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, height: e.target.value as number }))}
                  label="Altezza"
                >
                  <MenuItem value={200}>200px</MenuItem>
                  <MenuItem value={300}>300px</MenuItem>
                  <MenuItem value={400}>400px</MenuItem>
                  <MenuItem value={500}>500px</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.showGrid}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, showGrid: e.target.checked }))}
                  />
                }
                label="Mostra Griglia"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.showLegend}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, showLegend: e.target.checked }))}
                  />
                }
                label="Mostra Legenda"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.animate}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, animate: e.target.checked }))}
                  />
                }
                label="Animazioni"
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Statistiche rapide */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {chartData.slice(0, 3).map((item: any, index: number) => (
          <Chip
            key={index}
            label={`${item.name}: ${item.value}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      {/* Grafico principale */}
      <Box sx={{ position: 'relative' }}>
        {renderChart()}
        
        {/* Indicatore di caricamento se non ci sono dati */}
        {chartData.length === 0 && (
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              Nessun dato disponibile per questo tipo di grafico
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer con informazioni */}
      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Tipo: {chartTypes.find(t => t.key === selectedChartType)?.label} | 
          Dati: {chartData.length} elementi | 
          Ultimo aggiornamento: {new Date().toLocaleTimeString('it-IT')}
        </Typography>
      </Box>
    </Paper>
  );
};
