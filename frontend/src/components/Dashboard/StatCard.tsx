import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  loading?: boolean;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'primary.main',
  loading = false,
  trend,
  trendDirection,
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
      <Card sx={{ 
        height: '100%', 
        position: 'relative', 
        overflow: 'visible',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        }
      }}>
        <CardContent sx={{ 
          p: { xs: 2, sm: 2.5, md: 3 },
          '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } }
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  mb: { xs: 1, sm: 1.5 }
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                component="div" 
                fontWeight="bold"
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                  lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
                }}
              >
                {value}
              </Typography>
              {trend && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: { xs: 1, sm: 1.5 }, 
                  gap: 0.5 
                }}>
                  {trendDirection === 'up' ? (
                    <TrendingUp sx={{ 
                      color: 'success.main', 
                      fontSize: { xs: 14, sm: 16 } 
                    }} />
                  ) : trendDirection === 'down' ? (
                    <TrendingDown sx={{ 
                      color: 'error.main', 
                      fontSize: { xs: 14, sm: 16 } 
                    }} />
                  ) : null}
                  <Typography
                    variant="body2"
                    color={trendDirection === 'up' ? 'success.main' : trendDirection === 'down' ? 'error.main' : 'text.secondary'}
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {trend}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                color,
                p: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                bgcolor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: { xs: 40, sm: 48 },
                minHeight: { xs: 40, sm: 48 },
                '& > svg': {
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                }
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
