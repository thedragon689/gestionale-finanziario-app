import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Tooltip,
  Menu,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  Download,
  FilterList,
  DateRange,
  AccountBalance,
  Payment,
  People,
  Euro,
  ShowChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  BubbleChart as AreaChartIcon,
  ScatterPlot as ScatterChartIcon,
  MoreVert,
} from '@mui/icons-material';

// Charts
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from 'recharts';

// Services
import { reportService } from '../../services/reportService';

// Chart types
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'ecg';

// Chart Selector Component
interface ChartSelectorProps {
  chartType: ChartType;
  onChartTypeChange: (chartType: ChartType) => void;
  availableTypes?: ChartType[];
}

const ChartSelector: React.FC<ChartSelectorProps> = ({ 
  chartType, 
  onChartTypeChange, 
  availableTypes = ['line', 'bar', 'pie', 'area', 'scatter', 'ecg'] 
}) => {
  const getChartTypeIcon = (type: ChartType) => {
    switch (type) {
      case 'line': return <LineChartIcon />;
      case 'bar': return <BarChartIcon />;
      case 'pie': return <PieChartIcon />;
      case 'area': return <AreaChartIcon />;
      case 'scatter': return <ScatterChartIcon />;
      case 'ecg': return <span style={{ fontSize: '20px' }}>🫀</span>;
      default: return <LineChartIcon />;
    }
  };

  const getChartTypeLabel = (type: ChartType) => {
    switch (type) {
      case 'line': return 'Linee';
      case 'bar': return 'Barre';
      case 'pie': return 'Torta';
      case 'area': return 'Area';
      case 'scatter': return 'Dispersione';
      case 'ecg': return 'ECG';
      default: return 'Linee';
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
      {availableTypes.map((type) => (
        <Tooltip key={type} title={`Grafico a ${getChartTypeLabel(type)}`}>
          <IconButton
            onClick={() => onChartTypeChange(type)}
            sx={{
              bgcolor: chartType === type ? 'primary.main' : 'transparent',
              color: chartType === type ? 'white' : 'text.secondary',
              border: `1px solid ${chartType === type ? 'primary.main' : 'divider'}`,
              '&:hover': {
                bgcolor: chartType === type ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            {getChartTypeIcon(type)}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

// Chart components
interface ChartDataPoint {
  month: string;
  transactions: number;
  amount: number;
}

interface CustomerDataPoint {
  type: string;
  count: number;
  percentage: number;
}

const TransactionChart = ({ title, data, chartType, onChartTypeChange }: { 
  title: string; 
  data: ChartDataPoint[]; 
  chartType: ChartType;
  onChartTypeChange: (chartType: ChartType) => void;
}) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChartTypeChange = (newChartType: ChartType) => {
    onChartTypeChange(newChartType);
    handleMenuClose();
  };

  const getChartTypeIcon = (type: ChartType) => {
    switch (type) {
      case 'line': return <LineChartIcon />;
      case 'bar': return <BarChartIcon />;
      case 'area': return <AreaChartIcon />;
      case 'scatter': return <ScatterChartIcon />;
      case 'ecg': return <span style={{ fontSize: '20px' }}>🫀</span>;
      default: return <LineChartIcon />;
    }
  };

  const getChartTypeLabel = (type: ChartType) => {
    switch (type) {
      case 'line': return 'Linee';
      case 'bar': return 'Barre';
      case 'area': return 'Area';
      case 'scatter': return 'Dispersione';
      case 'ecg': return 'ECG';
      default: return 'Linee';
    }
  };

  // Calcola i valori normalizzati per l'ECG con protezione contro divisione per zero
  const normalizedData = data.length > 0 ? data.map((item) => {
    const minTransactions = Math.min(...data.map(d => d.transactions));
    const maxTransactions = Math.max(...data.map(d => d.transactions));
    const minAmount = Math.min(...data.map(d => d.amount));
    const maxAmount = Math.max(...data.map(d => d.amount));
    
    // Protezione contro divisione per zero
    const transactionsRange = maxTransactions - minTransactions;
    const amountRange = maxAmount - minAmount;
    
    const transactionsNormalized = transactionsRange > 0 ? 
      ((item.transactions - minTransactions) / transactionsRange) * 100 : 50;
    
    const amountNormalized = amountRange > 0 ? 
      ((item.amount - minAmount) / amountRange) * 100 : 50;
    
    const correlation = maxTransactions > 0 && maxAmount > 0 ? 
      ((item.transactions / maxTransactions) + (item.amount / maxAmount)) / 2 * 100 : 50;
    
    return {
    month: item.month,
    transactions: item.transactions,
    amount: item.amount,
      transactionsNormalized,
      amountNormalized,
      correlation
    };
  }) : [];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
            <Line type="monotone" dataKey="transactions" stroke={colors[0]} name="Transazioni" strokeWidth={2} />
            <Line type="monotone" dataKey="amount" stroke={colors[1]} name="Importo (€)" strokeWidth={2} />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
            <Bar dataKey="transactions" fill={colors[0]} name="Transazioni" />
            <Bar dataKey="amount" fill={colors[1]} name="Importo (€)" />
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
            <Area type="monotone" dataKey="transactions" fill={colors[0]} stroke={colors[0]} name="Transazioni" fillOpacity={0.6} />
            <Area type="monotone" dataKey="amount" fill={colors[1]} stroke={colors[1]} name="Importo (€)" fillOpacity={0.6} />
          </AreaChart>
        );
      
      case 'scatter':
        return (
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="transactions" name="Transazioni" />
            <YAxis name="Importo (€)" />
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
            <Scatter name="Transazioni vs Importo" data={data} fill={colors[0]} />
          </ScatterChart>
        );

      case 'ecg':
        // Controllo se ci sono dati per il grafico ECG
        if (normalizedData.length === 0) {
          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: 300,
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography variant="h6" color="text.secondary">
                Nessun dato disponibile per il grafico ECG
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seleziona un tipo di report con dati transazionali
              </Typography>
            </Box>
          );
        }
        
        return (
          <LineChart data={normalizedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#ccc' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#ccc' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <RechartsTooltip 
              formatter={(value, name) => {
                const numValue = typeof value === 'number' ? value : parseFloat(String(value));
                if (name === 'transactionsNormalized') return [`${numValue.toFixed(1)}%`, 'Transazioni (norm.)'];
                if (name === 'amountNormalized') return [`${numValue.toFixed(1)}%`, 'Importo (norm.)'];
                if (name === 'correlation') return [`${numValue.toFixed(1)}%`, 'Correlazione'];
                return [value, name];
              }}
              labelFormatter={(label) => `Mese: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Legend />

            {/* Linea principale - Correlazione (come battito cardiaco) */}
            <Line 
              type="monotone" 
              dataKey="correlation" 
              stroke={colors[0]} 
              strokeWidth={3}
              name="Correlazione"
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2, fill: '#fff' }}
            />
            
            {/* Linea transazioni normalizzate */}
            <Line 
              type="monotone" 
              dataKey="transactionsNormalized" 
              stroke={colors[1]} 
              strokeWidth={2}
              name="Transazioni (norm.)"
              strokeDasharray="5 5"
              dot={{ fill: colors[1], strokeWidth: 1, r: 3 }}
            />
            
            {/* Linea importo normalizzato */}
            <Line 
              type="monotone" 
              dataKey="amountNormalized" 
              stroke={colors[2]} 
              strokeWidth={2}
              name="Importo (norm.)"
              strokeDasharray="5 5"
              dot={{ fill: colors[2], strokeWidth: 1, r: 3 }}
            />
            
            {/* Area di correlazione per effetto ECG */}
            <Area 
              type="monotone" 
              dataKey="correlation" 
              fill={colors[0]} 
              fillOpacity={0.1}
              stroke="none"
            />
          </LineChart>
        );
      
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
            <Line type="monotone" dataKey="transactions" stroke={colors[0]} name="Transazioni" strokeWidth={2} />
            <Line type="monotone" dataKey="amount" stroke={colors[1]} name="Importo (€)" strokeWidth={2} />
          </LineChart>
        );
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <MoreVert />
          </IconButton>
        </Box>
        
        {/* Menu a tre pallini */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {/* Sezione Tipo Grafico */}
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold' }}>
            Tipo Grafico
          </Typography>
          {['line', 'bar', 'area', 'scatter', 'ecg'].map((type) => (
            <MenuItem 
              key={type} 
              onClick={() => handleChartTypeChange(type as ChartType)}
              selected={chartType === type}
            >
              <ListItemIcon>
                {getChartTypeIcon(type as ChartType)}
              </ListItemIcon>
              {getChartTypeLabel(type as ChartType)}
            </MenuItem>
          ))}
          
          <Box sx={{ borderTop: 1, borderColor: 'divider', my: 1 }} />
          
          {/* Opzioni aggiuntive */}
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Download fontSize="small" />
            </ListItemIcon>
            Esporta Dati
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <FilterList fontSize="small" />
            </ListItemIcon>
            Filtri Avanzati
          </MenuItem>
        </Menu>
        
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const CustomerChart = ({ title, data, chartType, onChartTypeChange }: { 
  title: string; 
  data: CustomerDataPoint[]; 
  chartType: ChartType;
  onChartTypeChange: (chartType: ChartType) => void;
}) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChartTypeChange = (newChartType: ChartType) => {
    onChartTypeChange(newChartType);
    handleMenuClose();
  };

  const getChartTypeIcon = (type: ChartType) => {
    switch (type) {
      case 'pie': return <PieChartIcon />;
      case 'bar': return <BarChartIcon />;
      case 'line': return <LineChartIcon />;
      case 'area': return <AreaChartIcon />;
      case 'ecg': return <span style={{ fontSize: '20px' }}>🫀</span>;
      default: return <PieChartIcon />;
    }
  };

  const getChartTypeLabel = (type: ChartType) => {
    switch (type) {
      case 'pie': return 'Torta';
      case 'bar': return 'Barre';
      case 'line': return 'Linee';
      case 'area': return 'Area';
      case 'ecg': return 'ECG';
      default: return 'Torta';
    }
  };

  // Calcola i valori normalizzati per l'ECG
  const normalizedData = data.map((item) => ({
    type: item.type,
    count: item.count,
    percentage: item.percentage,
    countNormalized: (item.count - Math.min(...data.map(d => d.count))) / 
                   (Math.max(...data.map(d => d.count)) - Math.min(...data.map(d => d.count))) * 100,
    percentageNormalized: (item.percentage - Math.min(...data.map(d => d.percentage))) / 
                         (Math.max(...data.map(d => d.percentage)) - Math.min(...data.map(d => d.percentage))) * 100,
    correlation: (item.count / Math.max(...data.map(d => d.count)) + 
                 item.percentage / Math.max(...data.map(d => d.percentage))) / 2 * 100
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
          </PieChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
            <Bar dataKey="count" fill={colors[0]} name="Numero Clienti" />
            <Bar dataKey="percentage" fill={colors[1]} name="Percentuale (%)" />
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
            <Line type="monotone" dataKey="count" stroke={colors[0]} name="Numero Clienti" strokeWidth={2} />
            <Line type="monotone" dataKey="percentage" stroke={colors[1]} name="Percentuale (%)" strokeWidth={2} />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
            <Area type="monotone" dataKey="count" fill={colors[0]} stroke={colors[0]} name="Numero Clienti" fillOpacity={0.6} />
            <Area type="monotone" dataKey="percentage" fill={colors[1]} stroke={colors[1]} name="Percentuale (%)" fillOpacity={0.6} />
          </AreaChart>
        );

      case 'ecg':
        return (
          <LineChart data={normalizedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#ccc' }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#ccc' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <RechartsTooltip
              formatter={(value, name) => {
                const numValue = typeof value === 'number' ? value : parseFloat(String(value));
                if (name === 'countNormalized') return [`${numValue.toFixed(1)}%`, 'Clienti (norm.)'];
                if (name === 'percentageNormalized') return [`${numValue.toFixed(1)}%`, 'Percentuale (norm.)'];
                if (name === 'correlation') return [`${numValue.toFixed(1)}%`, 'Correlazione'];
                return [value, name];
              }}
              labelFormatter={(label) => `Tipo: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Legend />

            {/* Linea principale - Correlazione (come battito cardiaco) */}
            <Line
              type="monotone"
              dataKey="correlation"
              stroke={colors[0]}
              strokeWidth={3}
              name="Correlazione"
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2, fill: '#fff' }}
            />

            {/* Linea clienti normalizzati */}
            <Line
              type="monotone"
              dataKey="countNormalized"
              stroke={colors[1]}
              strokeWidth={2}
              name="Clienti (norm.)"
              strokeDasharray="5 5"
              dot={{ fill: colors[1], strokeWidth: 1, r: 3 }}
            />

            {/* Linea percentuale normalizzata */}
            <Line
              type="monotone"
              dataKey="percentageNormalized"
              stroke={colors[2]}
              strokeWidth={2}
              name="Percentuale (norm.)"
              strokeDasharray="5 5"
              dot={{ fill: colors[2], strokeWidth: 1, r: 3 }}
            />

            {/* Area di correlazione per effetto ECG */}
            <Area
              type="monotone"
              dataKey="correlation"
              fill={colors[0]}
              fillOpacity={0.1}
              stroke="none"
            />
          </LineChart>
        );
      
      default:
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(value) => [value, '']} />
            <Legend />
          </PieChart>
        );
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <MoreVert />
          </IconButton>
        </Box>
        
        {/* Menu a tre pallini */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {/* Sezione Tipo Grafico */}
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold' }}>
            Tipo Grafico
          </Typography>
          {['pie', 'bar', 'line', 'area', 'ecg'].map((type) => (
            <MenuItem 
              key={type} 
              onClick={() => handleChartTypeChange(type as ChartType)}
              selected={chartType === type}
            >
              <ListItemIcon>
                {getChartTypeIcon(type as ChartType)}
              </ListItemIcon>
              {getChartTypeLabel(type as ChartType)}
            </MenuItem>
          ))}
          
          <Box sx={{ borderTop: 1, borderColor: 'divider', my: 1 }} />
          
          {/* Opzioni aggiuntive */}
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Download fontSize="small" />
            </ListItemIcon>
            Esporta Dati
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <FilterList fontSize="small" />
            </ListItemIcon>
            Filtri Avanzati
          </MenuItem>
        </Menu>
        
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ECGChartComponent = ({ title, data }: { title: string; data: ChartDataPoint[] }) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  // Calcola i valori normalizzati per l'ECG
  const normalizedData = data.map((item, index) => ({
    month: item.month,
    transactions: item.transactions,
    amount: item.amount,
    // Normalizza i valori per una migliore visualizzazione ECG
    transactionsNormalized: (item.transactions - Math.min(...data.map(d => d.transactions))) / 
                           (Math.max(...data.map(d => d.transactions)) - Math.min(...data.map(d => d.transactions))) * 100,
    amountNormalized: (item.amount - Math.min(...data.map(d => d.amount))) / 
                     (Math.max(...data.map(d => d.amount)) - Math.min(...data.map(d => d.amount))) * 100,
    // Calcola la correlazione come "battito cardiaco"
    correlation: (item.transactions / Math.max(...data.map(d => d.transactions)) + 
                 item.amount / Math.max(...data.map(d => d.amount))) / 2 * 100
  }));

  return (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={normalizedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#ccc' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#ccc' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <RechartsTooltip 
              formatter={(value, name) => {
                const numValue = typeof value === 'number' ? value : parseFloat(String(value));
                if (name === 'transactionsNormalized') return [`${numValue.toFixed(1)}%`, 'Transazioni (norm.)'];
                if (name === 'amountNormalized') return [`${numValue.toFixed(1)}%`, 'Importo (norm.)'];
                if (name === 'correlation') return [`${numValue.toFixed(1)}%`, 'Correlazione'];
                return [value, name];
              }}
              labelFormatter={(label) => `Mese: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
          <Legend />
            
            {/* Linea principale - Correlazione (come battito cardiaco) */}
            <Line 
              type="monotone" 
              dataKey="correlation" 
              stroke={colors[0]} 
              strokeWidth={3}
              name="Correlazione"
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2, fill: '#fff' }}
            />
            
            {/* Linea transazioni normalizzate */}
            <Line 
              type="monotone" 
              dataKey="transactionsNormalized" 
              stroke={colors[1]} 
              strokeWidth={2}
              name="Transazioni (norm.)"
              strokeDasharray="5 5"
              dot={{ fill: colors[1], strokeWidth: 1, r: 3 }}
            />
            
            {/* Linea importo normalizzato */}
            <Line 
              type="monotone" 
              dataKey="amountNormalized" 
              stroke={colors[2]} 
              strokeWidth={2}
              name="Importo (norm.)"
              strokeDasharray="5 5"
              dot={{ fill: colors[2], strokeWidth: 1, r: 3 }}
            />
            
            {/* Area di correlazione per effetto ECG */}
            <Area 
              type="monotone" 
              dataKey="correlation" 
              fill={colors[0]} 
              fillOpacity={0.1}
              stroke="none"
            />
          </LineChart>
      </ResponsiveContainer>
        
        {/* Legenda interpretativa */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>📊 Interpretazione Grafico ECG:</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • <strong>Linea Blu Spessa:</strong> Correlazione tra transazioni e importi (pattern principale)
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • <strong>Linea Verde Tratteggiata:</strong> Transazioni normalizzate (0-100%)
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • <strong>Linea Gialla Tratteggiata:</strong> Importi normalizzati (0-100%)
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • <strong>Area Blu:</strong> Zona di correlazione (più intensa = correlazione più forte)
          </Typography>
        </Box>
    </CardContent>
  </Card>
);
};

const Reports: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<string>('financial');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [chartType, setChartType] = useState<ChartType>('line');
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<ChartDataPoint[]>([]);
  const [customerData, setCustomerData] = useState<CustomerDataPoint[]>([]);

  // Load report data based on selected type
  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: any[] = [];
      switch (selectedReportType) {
        case 'financial':
          data = await reportService.getFinancialReport(selectedDateRange.startDate, selectedDateRange.endDate);
          break;
        case 'customer':
          data = await reportService.getCustomerReport(selectedDateRange.startDate, selectedDateRange.endDate);
          break;
        case 'transaction':
          data = await reportService.getTransactionReport(selectedDateRange.startDate, selectedDateRange.endDate);
          break;
        case 'investment':
          data = await reportService.getInvestmentReport(selectedDateRange.startDate, selectedDateRange.endDate);
          break;
        case 'equities':
          data = await reportService.getEquitiesReport(selectedDateRange.startDate, selectedDateRange.endDate);
          break;
        case 'bonds':
          data = await reportService.getBondsReport(selectedDateRange.startDate, selectedDateRange.endDate);
          break;
        default:
          data = await reportService.getFinancialReport(selectedDateRange.startDate, selectedDateRange.endDate);
      }
      
      setReportData(data);
    } catch (err) {
      setError('Errore nel caricamento dei dati del report');
    } finally {
      setLoading(false);
    }
  };

  // Handle report type change
  const handleReportTypeChange = (reportType: string) => {
    setSelectedReportType(reportType);
    // Reset chart type to line for better compatibility
    setChartType('line');
  };

  // Export functions
  const exportToPDF = async () => {
    try {
      await reportService.exportToPDF({
        reportType: selectedReportType,
        period: selectedPeriod,
        dateRange: selectedDateRange,
        data: reportData
      });
    } catch (err) {
      setError('Errore nell\'esportazione PDF');
    }
  };

  const exportToExcel = async () => {
    try {
      await reportService.exportToExcel({
        reportType: selectedReportType,
        period: selectedPeriod,
        dateRange: selectedDateRange,
        data: reportData
      });
    } catch (err) {
      setError('Errore nell\'esportazione Excel');
    }
  };

  const sendViaEmail = async () => {
    try {
      await reportService.sendViaEmail({
        reportType: selectedReportType,
        period: selectedPeriod,
        dateRange: selectedDateRange,
        data: reportData
      });
    } catch (err) {
      setError('Errore nell\'invio via email');
    }
  };

  const printReport = () => {
    window.print();
  };

  // Load data when component mounts or report type changes
  useEffect(() => {
    loadReportData();
  }, [selectedReportType, selectedPeriod, selectedDateRange]);

  // Generate dynamic data based on report type and chart type
  const getDynamicChartData = () => {
    // Create chart-compatible data based on report type (independent of reportData)
    let chartData: ChartDataPoint[] = [];
    
    switch (selectedReportType) {
      case 'financial':
        // Create monthly financial data
        chartData = [
          { month: 'Gen', transactions: 4200, amount: 285000 },
          { month: 'Feb', transactions: 3800, amount: 265000 },
          { month: 'Mar', transactions: 4500, amount: 295000 },
          { month: 'Apr', transactions: 4100, amount: 275000 },
          { month: 'Mag', transactions: 4800, amount: 315000 },
          { month: 'Giu', transactions: 5200, amount: 345000 }
        ];
        break;
      
      case 'customer':
        // Create customer distribution data with different values for ECG compatibility
        chartData = [
          { month: 'Privati', transactions: 890, amount: 89000 },
          { month: 'Aziende', transactions: 357, amount: 357000 },
          { month: 'Nuovi', transactions: 45, amount: 4500 },
          { month: 'Attivi', transactions: 1247, amount: 124700 }
        ];
        break;
      
      case 'transaction':
        // Create transaction volume data
        chartData = [
          { month: 'Gen', transactions: 4200, amount: 285000 },
          { month: 'Feb', transactions: 3800, amount: 265000 },
          { month: 'Mar', transactions: 4500, amount: 295000 },
          { month: 'Apr', transactions: 4100, amount: 275000 },
          { month: 'Mag', transactions: 4800, amount: 315000 },
          { month: 'Giu', transactions: 5200, amount: 345000 }
        ];
        break;
      
      case 'investment':
        // Create investment performance data
        chartData = [
          { month: 'Azioni', transactions: 45, amount: 45200 },
          { month: 'Obbligazioni', transactions: 38, amount: 3800 },
          { month: 'Fondi', transactions: 125, amount: 12500 },
          { month: 'Crypto', transactions: 287, amount: 28700 },
          { month: 'Portfolio', transactions: 183, amount: 18300 }
        ];
        break;
      
      case 'equities':
        // Create equities performance data
        chartData = [
          { month: 'GTI', transactions: 3.62, amount: 45.80 },
          { month: 'BNTX', transactions: 2.15, amount: 128.50 },
          { month: 'GGE', transactions: -2.32, amount: 67.30 },
          { month: 'FNBG', transactions: 2.05, amount: 12.45 },
          { month: 'ASDL', transactions: 2.69, amount: 89.75 },
          { month: 'SREP', transactions: 1.18, amount: 34.20 },
          { month: 'QST', transactions: 2.89, amount: 156.80 }
        ];
        break;
      
      case 'bonds':
        // Create bonds performance data
        chartData = [
          { month: 'FinNext 2028', transactions: 3.85, amount: 1025.50 },
          { month: 'BTP 2030', transactions: 3.12, amount: 985.20 },
          { month: 'GreenGrid 2027', transactions: 3.35, amount: 1010.80 },
          { month: 'BioNova Conv', transactions: 1.45, amount: 1085.60 },
          { month: 'High Yield 2026', transactions: 8.25, amount: 945.30 },
          { month: 'Zero Coupon 2025', transactions: 3.45, amount: 875.40 }
        ];
        break;
      
      default:
        chartData = [
          { month: 'Gen', transactions: 4200, amount: 285000 },
          { month: 'Feb', transactions: 3800, amount: 265000 },
          { month: 'Mar', transactions: 4500, amount: 295000 }
        ];
    }
    
    // Apply chart type specific modifications
    switch (chartType) {
      case 'area':
        return chartData.map((item, index) => ({
          ...item,
          amount: item.amount * (1 + index * 0.1)
        }));
      
      case 'scatter':
        return chartData.map((item, index) => ({
          ...item,
          transactions: item.transactions + (Math.random() - 0.5) * 200,
          amount: item.amount + (Math.random() - 0.5) * 50000
        }));
      
      default:
        return chartData;
    }
  };

  // Generate customer chart data
  const getCustomerChartData = () => {
    switch (selectedReportType) {
      case 'financial':
        return [
          { type: 'Ricavi', count: 2850000, percentage: 100 },
          { type: 'Spese', count: 1200000, percentage: 42.1 },
          { type: 'Profitto', count: 1650000, percentage: 57.9 }
        ];
      
      case 'customer':
        return [
          { type: 'Privati', count: 890, percentage: 71.4 },
          { type: 'Aziende', count: 357, percentage: 28.6 }
        ];
      
      case 'transaction':
        return [
          { type: 'Completate', count: 1960, percentage: 98.5 },
          { type: 'Fallite', count: 30, percentage: 1.5 }
        ];
      
      case 'investment':
        return [
          { type: 'Azioni', count: 45.2, percentage: 45.2 },
          { type: 'Obbligazioni', count: 3.8, percentage: 3.8 },
          { type: 'Fondi', count: 12.5, percentage: 12.5 },
          { type: 'Crypto', count: 28.7, percentage: 28.7 }
        ];
      
      case 'equities':
        return [
          { type: 'Tecnologia', count: 3.62, percentage: 25.9 },
          { type: 'Healthcare', count: 2.15, percentage: 15.4 },
          { type: 'Energia', count: -2.32, percentage: -16.6 },
          { type: 'Finanziario', count: 2.05, percentage: 14.7 },
          { type: 'Aerospaziale', count: 2.69, percentage: 19.3 },
          { type: 'Retail', count: 1.18, percentage: 8.5 },
          { type: 'Software', count: 2.89, percentage: 20.7 }
        ];
      
      case 'bonds':
        return [
          { type: 'Corporate', count: 3.85, percentage: 25.7 },
          { type: 'Governativo', count: 3.12, percentage: 20.8 },
          { type: 'Green', count: 3.35, percentage: 22.3 },
          { type: 'Convertibile', count: 1.45, percentage: 9.7 },
          { type: 'High Yield', count: 8.25, percentage: 55.0 },
          { type: 'Zero Coupon', count: 3.45, percentage: 23.0 }
        ];
      
      default:
        return [
          { type: 'Categoria A', count: 100, percentage: 50 },
          { type: 'Categoria B', count: 100, percentage: 50 }
        ];
    }
  };

  // Get appropriate chart type based on report type
  const getRecommendedChartType = (reportType: string): ChartType => {
    switch (reportType) {
      case 'financial':
        return 'line';
      case 'customer':
        return 'pie';
      case 'transaction':
        return 'bar';
      case 'investment':
        return 'scatter';
      case 'equities':
        return 'bar';
      case 'bonds':
        return 'line';
      default:
        return 'line';
    }
  };

  // Update chart type when report type changes
  useEffect(() => {
    setChartType(getRecommendedChartType(selectedReportType));
  }, [selectedReportType]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Header con controlli */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              📊 Report e Analisi Finanziarie
        </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>

            </Box>
          </Box>
          
          
        </Paper>

        {/* Report Type Selection */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tipo di Report
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo Report</InputLabel>
                <Select
                  value={selectedReportType}
                  onChange={(e) => handleReportTypeChange(e.target.value)}
                  label="Tipo Report"
                >
                  <MenuItem value="financial">Report Finanziario</MenuItem>
                  <MenuItem value="customer">Report Clienti</MenuItem>
                  <MenuItem value="transaction">Report Transazioni</MenuItem>
                  <MenuItem value="investment">Report Investimenti</MenuItem>
                  <MenuItem value="equities">Report Azioni</MenuItem>
                  <MenuItem value="bonds">Report Obbligazioni</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Periodo</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Periodo"
                >
                  <MenuItem value="day">Giornaliero</MenuItem>
                  <MenuItem value="week">Settimanale</MenuItem>
                  <MenuItem value="month">Mensile</MenuItem>
                  <MenuItem value="quarter">Trimestrale</MenuItem>
                  <MenuItem value="year">Annuale</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Data Inizio"
                type="date"
                value={selectedDateRange.startDate}
                onChange={(e) => setSelectedDateRange({...selectedDateRange, startDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Data Fine"
                type="date"
                value={selectedDateRange.endDate}
                onChange={(e) => setSelectedDateRange({...selectedDateRange, endDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Export Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Esportazione e Condivisione
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToPDF}
                disabled={loading || reportData.length === 0}
              >
                Esporta PDF
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToExcel}
                disabled={loading || reportData.length === 0}
              >
                Esporta Excel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={sendViaEmail}
                disabled={loading || reportData.length === 0}
              >
                Invia via Email
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={printReport}
                disabled={loading || reportData.length === 0}
              >
                Stampa
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Dynamic Metrics Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AccountBalance color="primary" />
                  <Typography color="textSecondary">
                    {selectedReportType === 'financial' ? 'Ricavi Totali' :
                     selectedReportType === 'customer' ? 'Clienti Totali' :
                     selectedReportType === 'transaction' ? 'Transazioni Totali' :
                     'Investimenti Totali'}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {selectedReportType === 'financial' ? '€1,250,000' :
                   selectedReportType === 'customer' ? '1,250' :
                   selectedReportType === 'transaction' ? '2,000' :
                   '€500,000'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    {selectedReportType === 'financial' ? '+12.5%' :
                     selectedReportType === 'customer' ? '+5.2%' :
                     selectedReportType === 'transaction' ? '+8.7%' :
                     '+15.3%'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Payment color="warning" />
                  <Typography color="textSecondary">
                    {selectedReportType === 'financial' ? 'Spese Totali' :
                     selectedReportType === 'customer' ? 'Clienti Nuovi' :
                     selectedReportType === 'transaction' ? 'Volume Medio' :
                     'Rischio Medio'}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {selectedReportType === 'financial' ? '€850,000' :
                   selectedReportType === 'customer' ? '125' :
                   selectedReportType === 'transaction' ? '€62.50' :
                   '6.2/10'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    {selectedReportType === 'financial' ? '+8.2%' :
                     selectedReportType === 'customer' ? '+12.8%' :
                     selectedReportType === 'transaction' ? '+3.4%' :
                     '-2.1%'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp color="success" />
                  <Typography color="textSecondary">
                    {selectedReportType === 'financial' ? 'Utile Netto' :
                     selectedReportType === 'customer' ? 'Soddisfazione' :
                     selectedReportType === 'transaction' ? 'Tasso Successo' :
                     'ROI Medio'}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {selectedReportType === 'financial' ? '€400,000' :
                   selectedReportType === 'customer' ? '4.8/5' :
                   selectedReportType === 'transaction' ? '98.5%' :
                   '+12.3%'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    {selectedReportType === 'financial' ? '+15.8%' :
                     selectedReportType === 'customer' ? '+0.3' :
                     selectedReportType === 'transaction' ? '+1.2%' :
                     '+2.7%'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <People color="info" />
                  <Typography color="textSecondary">
                    {selectedReportType === 'financial' ? 'Clienti Attivi' :
                     selectedReportType === 'customer' ? 'Retention Rate' :
                     selectedReportType === 'transaction' ? 'Transazioni/Giorno' :
                     'Diversificazione'}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {selectedReportType === 'financial' ? '1,250' :
                   selectedReportType === 'customer' ? '92.5%' :
                   selectedReportType === 'transaction' ? '1,523' :
                   '8.7/10'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    {selectedReportType === 'financial' ? '+5.2%' :
                     selectedReportType === 'customer' ? '+2.1%' :
                     selectedReportType === 'transaction' ? '+4.8%' :
                     '+1.5%'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Grafici principali */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <TransactionChart 
                title={`📈 ${selectedReportType === 'financial' ? 'Andamento Finanziario' : 
                       selectedReportType === 'customer' ? 'Distribuzione Clienti' :
                       selectedReportType === 'transaction' ? 'Andamento Transazioni' :
                       'Performance Investimenti'} ${selectedPeriod === 'day' ? 'Giornaliero' :
                       selectedPeriod === 'week' ? 'Settimanale' :
                       selectedPeriod === 'month' ? 'Mensile' :
                       selectedPeriod === 'quarter' ? 'Trimestrale' : 'Annuale'}`}
                data={getDynamicChartData()}
                chartType={chartType}
                onChartTypeChange={setChartType}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <CustomerChart 
                title={`👥 ${selectedReportType === 'financial' ? 'Metriche Finanziarie' : 
                       selectedReportType === 'customer' ? 'Distribuzione Clienti' :
                       selectedReportType === 'transaction' ? 'Riepilogo Transazioni' :
                       'Analisi Investimenti'}`}
                data={getCustomerChartData()}
                chartType={chartType}
                onChartTypeChange={setChartType}
            />
          </Grid>
        </Grid>

        {/* Grafico ECG per Correlazione */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            📊 Analisi ECG - Correlazione Finanziaria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Questo grafico ECG (elettrocardiogramma) mostra la correlazione tra il numero di transazioni e l'importo totale per mese. 
            Simile a un monitor cardiaco, rivela pattern, anomalie e la "salute finanziaria" del sistema nel tempo.
            La linea principale (correlazione) rappresenta il "battito cardiaco" dell'attività finanziaria.
          </Typography>
          <ECGChartComponent 
            title="🫀 ECG Correlazione Transazioni vs Importo" 
            data={getDynamicChartData()}
          />
          
          {/* Indicatori di Salute Finanziaria */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              🏥 Indicatori di Salute Finanziaria
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                  <Typography variant="h6">
                    {(() => {
                      const data = getDynamicChartData();
                      return data.length > 0 ? 
                        Math.round((data.reduce((sum, item) => sum + (item.transactions * item.amount), 0) / 
                                   data.reduce((sum, item) => sum + item.transactions, 0)) / 1000) + 'k' : 
                        '0k';
                    })()}
                  </Typography>
                  <Typography variant="caption">
                    Valore Medio per Transazione
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                  <Typography variant="h6">
                    {getDynamicChartData().length}
                  </Typography>
                  <Typography variant="caption">
                    Mesi Analizzati
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                  <Typography variant="h6">
                    {(() => {
                      const data = getDynamicChartData();
                      return data.length > 0 ? 
                        Math.round(data.reduce((sum, item) => sum + item.transactions, 0) / data.length) : 
                        0;
                    })()}
                  </Typography>
                  <Typography variant="caption">
                    Transazioni/Mese (Media)
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h6">
                    {(() => {
                      const data = getDynamicChartData();
                      return data.length > 0 ? 
                        Math.round(data.reduce((sum, item) => sum + item.amount, 0) / 1000) + 'k' : 
                        '0k';
                    })()}
                  </Typography>
                  <Typography variant="caption">
                    Importo Totale (€)
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Top Customers Table */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            🏆 Top Clienti per Saldo
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Saldo</TableCell>
                  <TableCell>Transazioni</TableCell>
                  <TableCell>Stato</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Assuming topCustomers is defined elsewhere or will be added */}
                {/* For now, using mock data for the table */}
                {/* This section needs to be updated with actual data fetching */}
                {/* Example: const topCustomers = [...]; setTopCustomers(mockTopCustomers); */}
                {/* For now, using a placeholder */}
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      Cliente A
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                      €12,345.67
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      15
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Attivo"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      Cliente B
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                      €8,901.23
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      10
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Attivo"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      Cliente C
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                      €5,678.90
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      8
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Attivo"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      Cliente D
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                      €2,345.67
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      6
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Attivo"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
                <TableRow hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                      Cliente E
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                      €1,234.56
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                      5
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Attivo"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Transaction Summary */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Riepilogo Transazioni
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Transazioni Totali:</Typography>
                  <Typography fontWeight="bold">2,000</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Volume Medio:</Typography>
                  <Typography fontWeight="bold">€62.50</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Transazioni/Giorno:</Typography>
                  <Typography fontWeight="bold">1,523</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tasso di Successo:</Typography>
                  <Typography fontWeight="bold" color="success.main">98.5%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Metriche di Performance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>ROI Medio:</Typography>
                  <Typography fontWeight="bold" color="success.main">+12.3%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Customer Satisfaction:</Typography>
                  <Typography fontWeight="bold" color="success.main">4.8/5</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tempo di Risposta:</Typography>
                  <Typography fontWeight="bold">2.3s</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Uptime Sistema:</Typography>
                  <Typography fontWeight="bold" color="success.main">99.9%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Reports;
