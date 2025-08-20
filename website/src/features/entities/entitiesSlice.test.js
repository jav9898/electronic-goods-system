import { configureStore } from '@reduxjs/toolkit';
import entitiesReducer, { 
  addEntity, 
  deleteEntity, 
  toggleSelectEntity, 
  deleteSelectedEntities, 
  toggleCategoryFilter, 
  clearCategoryFilters,
  selectFilteredEntities,
  selectSelectedEntities,
  selectAvailableCategories,
  selectSelectedCategories
} from './entitiesSlice';

describe('entitiesSlice', () => {
  let store;
  
  const initialState = {
    items: [],
    filteredItems: [],
    selectedItems: [],
    selectedCategories: [],
    availableCategories: []
  };

  const testProduct = {
    id: '1',
    name: 'Test Product',
    category: 'Electronics',
    price: 999.99,
    stock: 10,
    description: 'A test product',
    imageUrl: 'test.jpg'
  };

  const testProduct2 = {
    id: '2',
    name: 'Another Product',
    category: 'Clothing',
    price: 49.99,
    stock: 5,
    description: 'Another test product',
    imageUrl: 'test2.jpg'
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        entities: entitiesReducer
      },
      preloadedState: {
        entities: { ...initialState }
      }
    });
  });

  describe('actions', () => {
    it('should handle adding an entity', () => {
      store.dispatch(addEntity(testProduct));
      const state = store.getState().entities;
      
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(testProduct);
      expect(state.filteredItems).toHaveLength(1);
      expect(state.availableCategories).toContain('Electronics');
    });

    it('should handle deleting an entity', () => {
      // First add a product
      store.dispatch(addEntity(testProduct));
      // Then delete it
      store.dispatch(deleteEntity(testProduct.id));
      
      const state = store.getState().entities;
      expect(state.items).toHaveLength(0);
      expect(state.filteredItems).toHaveLength(0);
    });

    it('should handle toggling entity selection', () => {
      store.dispatch(addEntity(testProduct));
      
      // Select
      store.dispatch(toggleSelectEntity(testProduct.id));
      let state = store.getState().entities;
      expect(state.selectedItems).toContain(testProduct.id);
      
      // Deselect
      store.dispatch(toggleSelectEntity(testProduct.id));
      state = store.getState().entities;
      expect(state.selectedItems).not.toContain(testProduct.id);
    });

    it('should handle deleting multiple selected entities', () => {
      // Add two products
      store.dispatch(addEntity(testProduct));
      store.dispatch(addEntity(testProduct2));
      
      // Select both
      store.dispatch(toggleSelectEntity(testProduct.id));
      store.dispatch(toggleSelectEntity(testProduct2.id));
      
      // Delete selected
      store.dispatch(deleteSelectedEntities());
      
      const state = store.getState().entities;
      expect(state.items).toHaveLength(0);
      expect(state.selectedItems).toHaveLength(0);
    });

    it('should handle toggling category filter', () => {
      store.dispatch(addEntity(testProduct));
      store.dispatch(addEntity(testProduct2));
      
      // Filter by Electronics
      store.dispatch(toggleCategoryFilter('Electronics'));
      let state = store.getState().entities;
      expect(state.selectedCategories).toContain('Electronics');
      expect(selectFilteredEntities({ entities: state })).toHaveLength(1);
      
      // Toggle off
      store.dispatch(toggleCategoryFilter('Electronics'));
      state = store.getState().entities;
      expect(state.selectedCategories).not.toContain('Electronics');
      expect(selectFilteredEntities({ entities: state })).toHaveLength(2);
    });

    it('should clear all category filters', () => {
      store.dispatch(addEntity(testProduct));
      store.dispatch(toggleCategoryFilter('Electronics'));
      
      store.dispatch(clearCategoryFilters());
      const state = store.getState().entities;
      
      expect(state.selectedCategories).toHaveLength(0);
      expect(selectFilteredEntities({ entities: state })).toHaveLength(1);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.dispatch(addEntity(testProduct));
      store.dispatch(addEntity(testProduct2));
    });

    it('should select all filtered entities', () => {
      const state = { entities: store.getState().entities };
      const filtered = selectFilteredEntities(state);
      
      expect(filtered).toHaveLength(2);
      // Check that both products are in the filtered results (order doesn't matter)
      const productNames = filtered.map(p => p.name);
      expect(productNames).toContain('Test Product');
      expect(productNames).toContain('Another Product');
    });

    it('should select selected entities', () => {
      store.dispatch(toggleSelectEntity(testProduct.id));
      const state = { entities: store.getState().entities };
      
      const selected = selectSelectedEntities(state);
      expect(selected).toContain(testProduct.id);
      expect(selected).toHaveLength(1);
    });

    it('should select available categories', () => {
      const state = { entities: store.getState().entities };
      const categories = selectAvailableCategories(state);
      
      expect(categories).toContain('Electronics');
      expect(categories).toContain('Clothing');
      expect(categories).toHaveLength(2);
    });

    it('should select selected categories', () => {
      store.dispatch(toggleCategoryFilter('Electronics'));
      const state = { entities: store.getState().entities };
      
      const selectedCats = selectSelectedCategories(state);
      expect(selectedCats).toContain('Electronics');
      expect(selectedCats).toHaveLength(1);
    });
  });
});
