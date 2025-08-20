import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Entity from './Entity';
import { 
  deleteProduct, 
  toggleSelectEntity, 
  selectFilteredEntities,
  selectSelectedEntities
} from '../features/entities/entitiesSlice';

// Constants for test IDs
export const DeleteSelectedTestId = "delete-selected";
export const EntityTestId = "entity";

const EntitiesList = () => {
  const dispatch = useDispatch();
  const entities = useSelector(selectFilteredEntities);
  const selectedEntities = useSelector(selectSelectedEntities);

  const handleDeleteEntity = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleSelectEntity = (id) => {
    dispatch(toggleSelectEntity(id));
  };

  const handleDeleteSelected = async () => {
    // Delete each selected product individually
    for (const id of selectedEntities) {
      await dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="entities-list-container">
      {selectedEntities.length > 0 && (
        <div className="bulk-actions">
          <button 
            className="delete-selected-btn"
            onClick={handleDeleteSelected}
            data-testid={DeleteSelectedTestId}
          >
            Delete Selected ({selectedEntities.length})
          </button>
        </div>
      )}
      
      {entities.length === 0 ? (
        <p className="no-entities">No items found</p>
      ) : (
        <ul className="entities-list">
          {entities.map(entity => (
            <li 
              key={entity.productID || entity.id} 
              data-testid={EntityTestId}
              className="entity-list-item"
            >
              <Entity 
                entity={entity} 
                onDelete={handleDeleteEntity} 
                onSelect={handleSelectEntity}
                isSelected={selectedEntities.includes(entity.productID || entity.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntitiesList;