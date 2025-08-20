import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Box,
  Paper,
  Skeleton,
} from '@mui/material';
import { Send, CallReceived } from '@mui/icons-material';
// Animation placeholder

interface CryptoTransaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  timestamp: Date;
  fee: number;
  toAddress?: string;
  fromAddress?: string;
}

interface TransactionHistoryProps {
  transactions: CryptoTransaction[];
  loading?: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  loading = false,
}) => {
  const getStatusColor = (status: CryptoTransaction['status']) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTransactionIcon = (type: CryptoTransaction['type']) => {
    return type === 'send' ? (
      <Send color="error" />
    ) : (
      <CallReceived color="success" />
    );
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={60} />
          </Box>
        ))}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>
      
      {transactions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No transactions found
          </Typography>
        </Box>
      ) : (
        <List>
                       {transactions.map((transaction, index) => (
               <div key={transaction.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'grey.100' }}>
                    {getTransactionIcon(transaction.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {transaction.type === 'send' ? '-' : '+'}
                        {transaction.amount} {transaction.currency}
                      </Typography>
                      <Chip
                        label={transaction.status}
                        size="small"
                        color={getStatusColor(transaction.status) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {transaction.timestamp.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Hash: {transaction.hash.substring(0, 16)}...
                      </Typography>
                      {transaction.fee > 0 && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Fee: {transaction.fee} {transaction.currency}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            </div>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default TransactionHistory;
