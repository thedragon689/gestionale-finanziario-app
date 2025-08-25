import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  IconButton, 
  Box, 
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import { 
  MoreVert,
  ShowChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  BubbleChart as AreaChartIcon,
  ScatterPlot as ScatterChartIcon
} from '@mui/icons-material';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'ecg';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  action?: React.ReactNode;
  chartTypes?: ChartType[];
  onChartTypeChange?: (chartType: ChartType) => void;
  currentChartType?: ChartType;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  loading = false,
  action,
  chartTypes = ['line', 'bar', 'pie', 'area', 'scatter', 'ecg'],
  onChartTypeChange,
  currentChartType = 'line'
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChartTypeChange = (chartType: ChartType) => {
    onChartTypeChange?.(chartType);
    handleMenuClose();
  };

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
      case 'line': return 'Grafico a Linee';
      case 'bar': return 'Grafico a Barre';
      case 'pie': return 'Grafico a Torta';
      case 'area': return 'Grafico ad Area';
      case 'scatter': return 'Grafico a Dispersione';
      case 'ecg': return 'Grafico ECG';
      default: return 'Grafico a Linee';
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={<Skeleton variant="text" width="60%" height={24} />}
          action={
            <Skeleton variant="circular" width={32} height={32} />
          }
        />
        <CardContent>
          <Skeleton variant="rectangular" height={200} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={title}
          action={
            action || (
              <Tooltip title="Opzioni grafico">
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
              </Tooltip>
            )
          }
        />
        <CardContent>
          <Box sx={{ height: 300, width: '100%' }}>
            {children}
          </Box>
        </CardContent>
      </Card>

      {/* Menu per selezione tipo grafico */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        {chartTypes.map((chartType) => (
          <MenuItem
            key={chartType}
            onClick={() => handleChartTypeChange(chartType)}
            selected={currentChartType === chartType}
          >
            <ListItemIcon>{getChartTypeIcon(chartType)}</ListItemIcon>
            <ListItemText primary={getChartTypeLabel(chartType)} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ChartCard;
