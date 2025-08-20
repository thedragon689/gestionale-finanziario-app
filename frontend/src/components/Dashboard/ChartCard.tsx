import React from 'react';
import { Card, CardContent, CardHeader, IconButton, Box, Skeleton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
// Animation placeholder

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  action?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  loading = false,
  action,
}) => {
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
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            )
          }
        />
        <CardContent>
          <Box sx={{ height: 300, width: '100%' }}>
            {children}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartCard;
