import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
// Animation placeholder

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'primary.main',
  loading = false,
  trend,
}) => {
  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="circular" width={40} height={40} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {value}
              </Typography>
              {trend && (
                <Typography
                  variant="body2"
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                  sx={{ mt: 1 }}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                color,
                p: 1,
                borderRadius: 2,
                bgcolor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCard;
