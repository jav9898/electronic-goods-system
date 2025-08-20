import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI, categoriesAPI } from '../../services/api';

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'entities/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getAllProducts();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'entities/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productsAPI.createProduct(productData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'entities/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      await productsAPI.updateProduct(id, productData);
      return { id, ...productData };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'entities/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productsAPI.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'entities/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getAllCategories();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  selectedItems: [],
  selectedCategories: [],
  availableCategories: [],
  categories: [],
  loading: false,
  error: null,
};

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    toggleSelectEntity: (state, action) => {
      const id = action.payload;
      const index = state.selectedItems.indexOf(id);
      if (index === -1) {
        state.selectedItems.push(id);
      } else {
        state.selectedItems.splice(index, 1);
      }
    },
    toggleCategoryFilter: (state, action) => {
      const category = action.payload;
      const index = state.selectedCategories.indexOf(category);
      
      if (index === -1) {
        state.selectedCategories.push(category);
      } else {
        state.selectedCategories.splice(index, 1);
      }
      
      state.filteredItems = getFilteredItems([...state.items], state.selectedCategories);
    },
    clearCategoryFilters: (state) => {
      state.selectedCategories = [];
      state.filteredItems = [...state.items];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = getFilteredItems(action.payload, state.selectedCategories);
        state.availableCategories = [...new Set(action.payload.map(item => item.category))];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.filteredItems = getFilteredItems([...state.items], state.selectedCategories);
        if (!state.availableCategories.includes(action.payload.category)) {
          state.availableCategories.push(action.payload.category);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.productID === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
          state.filteredItems = getFilteredItems([...state.items], state.selectedCategories);
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.productID !== action.payload);
        state.filteredItems = getFilteredItems([...state.items], state.selectedCategories);
        state.selectedItems = state.selectedItems.filter(itemId => itemId !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

// Helper function to filter items by selected categories
const getFilteredItems = (items, selectedCategories) => {
  if (selectedCategories.length === 0) return items;
  return items.filter(item => selectedCategories.includes(item.category));
};

export const { 
  toggleSelectEntity, 
  toggleCategoryFilter,
  clearCategoryFilters,
  clearError
} = entitiesSlice.actions;

// Selectors
export const selectAllEntities = state => state.entities.items;
export const selectFilteredEntities = state => state.entities.filteredItems;
export const selectSelectedEntities = state => state.entities.selectedItems;
export const selectSelectedCategories = state => state.entities.selectedCategories;
export const selectAvailableCategories = state => state.entities.availableCategories;
export const selectCategories = state => state.entities.categories;
export const selectLoading = state => state.entities.loading;
export const selectError = state => state.entities.error;

export default entitiesSlice.reducer;
