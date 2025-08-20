import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  toggleCategoryFilter, 
  clearCategoryFilters,
  selectSelectedCategories,
  selectAvailableCategories
} from '../features/entities/entitiesSlice';

// Constants for test IDs
export const FilterCategoryTestId = "filter-category";

const FilterEntitiesForm = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAvailableCategories);
  const selectedCategories = useSelector(selectSelectedCategories);

  const handleCategoryChange = (category) => {
    dispatch(toggleCategoryFilter(category));
  };

  const handleClearAllFilters = () => {
    dispatch(clearCategoryFilters());
  };

  return (
    <div className="filter-form-container">
      <div className="filter-header">
        <h3>Filter by Category</h3>
        {selectedCategories.length > 0 && (
          <button 
            className="clear-filters-btn"
            onClick={handleClearAllFilters}
          >
            Clear filters
          </button>
        )}
      </div>
      
      {categories.length === 0 ? (
        <p className="no-categories">No categories available</p>
      ) : (
        <div className="filter-options">
          {categories.map(category => (
            <div 
              key={category} 
              className={`filter-option ${selectedCategories.includes(category) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                id={`category-${category}`}
                data-testid={FilterCategoryTestId}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <label htmlFor={`category-${category}`}>
                {category}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterEntitiesForm;