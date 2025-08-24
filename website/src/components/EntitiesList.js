import React from 'react';
import Entity from './Entity';

function EntitiesList({ entities, selectedIds, onSelect, onDelete, onDeleteSelected }) {
    return (
        <div>
            <button onClick={onDeleteSelected} data-testid="DeletedSelectTestId">
                Delete all selected
            </button>

            <ul>
                {entities.map((entity) => (
                    <li key={entity.id} data-testid="EntityTestId">
                        <Entity
                            entity={entity}
                            isSelected={selectedIds.includes(entity.id)}
                            onSelect={onSelect}
                            onDelete={onDelete}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EntitiesList;
