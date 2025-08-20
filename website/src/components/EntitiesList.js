import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Entity from './Entity';
import EditEntityForm from './EditEntityForm';
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
  const [editingEntity, setEditingEntity] = useState(null);

  const handleDeleteEntity = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleSelectEntity = (id) => {
    dispatch(toggleSelectEntity(id));
  };

  const handleEditEntity = (entity) => {
    setEditingEntity(entity);
  };

  const handleCloseEdit = () => {
    setEditingEntity(null);
  };

  const handleUpdateEntity = (updatedEntity) => {
    // The update is handled by Redux, just close the modal
    setEditingEntity(null);
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
                onEdit={handleEditEntity}
                isSelected={selectedEntities.includes(entity.productID || entity.id)}
              />
            </li>
          ))}
        </ul>
      )}
      
      {editingEntity && (
        <EditEntityForm 
          entity={editingEntity}
          onClose={handleCloseEdit}
          onUpdate={handleUpdateEntity}
        />
      )}
    </div>
  );
};

export default EntitiesList;