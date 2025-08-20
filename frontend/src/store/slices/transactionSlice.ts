import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: Date;
  reference: string;
  counterparty?: {
    name: string;
    iban?: string;
    accountNumber?: string;
  };
}

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
  filters: {
    accountId?: string;
    type?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  };
}

const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchTransactions = createAsyncThunk<
  Transaction[],
  any | undefined,
  { rejectValue: string }
>(
  'transaction/fetchTransactions',
  async (filters, { rejectWithValue }) => {
    try {
      // Mock data for now - replace with actual API call
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          accountId: '1',
          type: 'transfer',
          amount: 5000.00,
          currency: 'EUR',
          description: 'Transfer to Account IT987654321',
          status: 'completed',
          timestamp: new Date('2024-01-15T10:30:00'),
          reference: 'TXN123456789',
          counterparty: {
            name: 'Mario Rossi',
            iban: 'IT60X0542811101000000987654',
          },
        },
        {
          id: '2',
          accountId: '1',
          type: 'deposit',
          amount: 10000.00,
          currency: 'EUR',
          description: 'Salary deposit',
          status: 'completed',
          timestamp: new Date('2024-01-14T09:15:00'),
          reference: 'TXN987654321',
        },
        {
          id: '3',
          accountId: '1',
          type: 'payment',
          amount: -250.00,
          currency: 'EUR',
          description: 'Utility bill payment',
          status: 'pending',
          timestamp: new Date('2024-01-15T14:20:00'),
          reference: 'TXN456789123',
        },
      ];
      return mockTransactions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTransaction = createAsyncThunk<
  Transaction,
  any,
  { rejectValue: string }
>(
  'transaction/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        ...transactionData,
        status: 'pending',
        timestamp: new Date(),
        reference: `TXN${Date.now()}`,
      };
      return newTransaction;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setSelectedTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTransaction = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TransactionState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    updateTransactionStatus: (state, action: PayloadAction<{
      transactionId: string;
      status: Transaction['status'];
    }>) => {
      const transaction = state.transactions.find(t => t.id === action.payload.transactionId);
      if (transaction) {
        transaction.status = action.payload.status;
      }
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedTransaction,
  setFilters,
  clearFilters,
  updateTransactionStatus,
  addTransaction,
  clearError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
