import React from 'react';

function FilterEntitiesForm({ categories, selectedFilters, onFilterChange }) {
    return (
        <div className="FilterEntitiesForm">
            <h3>Filter by Category</h3>

            {/* Loop through each category */}
            <ul>
                {categories.map((category) => (
                    <li key={category}>
                        <label>
                            <input
                                type="checkbox"
                                data-testid="FilterCategoryTestId"
                                checked={selectedFilters.includes(category)}
                                onChange={() => onFilterChange(category)}
                            />
                            {category}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FilterEntitiesForm;
