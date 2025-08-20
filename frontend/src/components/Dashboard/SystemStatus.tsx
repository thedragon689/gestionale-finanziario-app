import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Info,
} from '@mui/icons-material';
// Animation placeholder

interface SystemAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

interface SystemStatusProps {
  alerts: SystemAlert[];
  loading?: boolean;
}

const getAlertIcon = (type: SystemAlert['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle color="success" />;
    case 'warning':
      return <Warning color="warning" />;
    case 'error':
      return <Error color="error" />;
    case 'info':
      return <Info color="info" />;
    default:
      return <Info />;
  }
};

const SystemStatus: React.FC<SystemStatusProps> = ({
  alerts,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton variant="text" width="60%" height={24} />} />
        <CardContent>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={60} />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader
          title="System Status"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          {alerts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircle color="success" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                All systems operational
              </Typography>
            </Box>
          ) : (
            <List>
                           {alerts.slice(0, 5).map((alert, index) => (
               <div key={alert.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getAlertIcon(alert.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.message}
                      secondary={alert.timestamp.toLocaleString()}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                                     </ListItem>
                 </div>
               ))}
            </List>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatus;
