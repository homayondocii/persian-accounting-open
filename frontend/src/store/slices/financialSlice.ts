import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account, Transaction, Category } from '@/types';

interface FinancialState {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: FinancialState = {
  accounts: [],
  transactions: [],
  categories: [],
  loading: false,
  error: null,
};

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setAccounts,
  addAccount,
  updateAccount,
  setTransactions,
  addTransaction,
  setCategories,
} = financialSlice.actions;

export default financialSlice.reducer;