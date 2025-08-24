import { createSlice } from '@reduxjs/toolkit';
import initialEntities from '../../data/initialEntities';

const entitySlice = createSlice({
  name: 'entities',
  initialState: {
    items: initialEntities,
    selectedIds: [],
    filters: [],
  },
  reducers: {
    addEntity: (state, action) => {
      state.items.unshift(action.payload);
    },
    deleteEntity: (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
      state.selectedIds = state.selectedIds.filter((id) => id !== action.payload);
    },
    toggleSelectEntity: (state, action) => {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((sid) => sid !== id)
        : [...state.selectedIds, id];
    },
    deleteSelectedEntities: (state) => {
      state.items = state.items.filter((e) => !state.selectedIds.includes(e.id));
      state.selectedIds = [];
    },
    toggleFilter: (state, action) => {
      const category = action.payload;
      state.filters = state.filters.includes(category)
        ? state.filters.filter((f) => f !== category)
        : [...state.filters, category];
    },
  },
});

export const {
  addEntity,
  deleteEntity,
  toggleSelectEntity,
  deleteSelectedEntities,
  toggleFilter,
} = entitySlice.actions;

export default entitySlice.reducer;
