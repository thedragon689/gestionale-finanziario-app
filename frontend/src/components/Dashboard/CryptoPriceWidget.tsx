import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
// Animation placeholder

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
}

interface CryptoPriceWidgetProps {
  prices: CryptoPrice[];
  loading?: boolean;
}

const CryptoPriceWidget: React.FC<CryptoPriceWidgetProps> = ({
  prices,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton variant="text" width="60%" height={24} />} />
        <CardContent>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={50} />
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
          title="Crypto Prices"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <List>
                         {prices.map((crypto, index) => (
               <div key={crypto.symbol}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'grey.100' }}>
                      <Typography variant="caption" fontWeight="bold">
                        {crypto.symbol}
                      </Typography>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={crypto.name}
                    secondary={crypto.symbol}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight="bold">
                      ${crypto.price.toLocaleString()}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        mt: 0.5,
                      }}
                    >
                      {crypto.changePercent > 0 ? (
                        <TrendingUp color="success" fontSize="small" />
                      ) : (
                        <TrendingDown color="error" fontSize="small" />
                      )}
                      <Typography
                        variant="caption"
                        color={crypto.changePercent > 0 ? 'success.main' : 'error.main'}
                        sx={{ ml: 0.5 }}
                      >
                        {crypto.changePercent > 0 ? '+' : ''}
                        {crypto.changePercent.toFixed(2)}%
                      </Typography>
                    </Box>
                                     </Box>
                 </ListItem>
               </div>
             ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoPriceWidget;
