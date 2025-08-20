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
  Chip,
  Box,
  Skeleton,
} from '@mui/material';
import {
  AccountBalance,
  Payment,
  SwapHoriz,
  TrendingUp,
} from '@mui/icons-material';
// Animation placeholder

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
}

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'deposit':
      return <TrendingUp color="success" />;
    case 'withdrawal':
      return <Payment color="error" />;
    case 'transfer':
      return <SwapHoriz color="info" />;
    case 'payment':
      return <AccountBalance color="warning" />;
    default:
      return <AccountBalance />;
  }
};

const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
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
          title="Recent Transactions"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <List>
                         {transactions.slice(0, 5).map((transaction, index) => (
               <div key={transaction.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'grey.100' }}>
                      {getTransactionIcon(transaction.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={transaction.description}
                    secondary={transaction.timestamp.toLocaleDateString()}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount.toFixed(2)} {transaction.currency}
                    </Typography>
                    <Chip
                      label={transaction.status}
                      size="small"
                      color={getStatusColor(transaction.status) as any}
                      sx={{ mt: 0.5 }}
                    />
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

export default RecentTransactions;
