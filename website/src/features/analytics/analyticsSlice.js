import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  salesData: {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: []
  },
  metrics: {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    topSellingCategory: '',
    growthRate: 0
  },
  reports: {
    inventoryReport: null,
    salesReport: null,
    customerReport: null,
    lastGenerated: null
  },
  filters: {
    dateRange: '30d',
    category: 'all',
    status: 'all'
  },
  isLoading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateSalesData: (state, action) => {
      const { period, data } = action.payload;
      state.salesData[period] = data;
    },
    updateMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    generateReport: (state, action) => {
      const { type, data } = action.payload;
      state.reports[`${type}Report`] = data;
      state.reports.lastGenerated = new Date().toISOString();
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setDateRange: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },
    clearReports: (state) => {
      state.reports = {
        inventoryReport: null,
        salesReport: null,
        customerReport: null,
        lastGenerated: null
      };
    },
    resetAnalytics: (state) => {
      return initialState;
    }
  }
});

export const {
  setLoading,
  setError,
  updateSalesData,
  updateMetrics,
  generateReport,
  updateFilters,
  setDateRange,
  setCategoryFilter,
  clearReports,
  resetAnalytics
} = analyticsSlice.actions;

// Selectors
export const selectAnalytics = state => state.analytics;
export const selectSalesData = state => state.analytics.salesData;
export const selectMetrics = state => state.analytics.metrics;
export const selectReports = state => state.analytics.reports;
export const selectAnalyticsFilters = state => state.analytics.filters;
export const selectAnalyticsLoading = state => state.analytics.isLoading;
export const selectAnalyticsError = state => state.analytics.error;

export default analyticsSlice.reducer;
