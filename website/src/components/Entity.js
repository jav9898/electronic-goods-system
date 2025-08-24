import React from 'react';

function Entity({ entity, isSelected, onSelect, onDelete }) {
    return (
        <div>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(entity.id)}
                data-testid="EntitySelectTestId"
            />
            <span data-testid="EntityCategoryTestId">{entity.category}</span>
            <br />
            <br />
            <span>{entity.name}</span> - {entity.brand} (${entity.price?.toFixed(2)})
            <br />
            <br />
            <button onClick={() => onDelete(entity.id)} data-testid="EntityDeleteTestId">
                Delete
            </button>
        </div>
    );
}

export default Entity;
