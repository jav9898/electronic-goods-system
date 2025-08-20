import React, { useState } from 'react';

// Constants for test IDs
export const EntitySelectTestId = "entity-select";
export const EntityDeleteTestId = "entity-delete";
export const EntityCategoryTestId = "entity-category";

const Entity = ({ entity, onDelete, onSelect, isSelected }) => {
  // State for handling image loading errors
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const entityId = entity.productID || entity.id;
  const imageUrl = entity.imageURL || entity.imageUrl;
  
  return (
    <div className="entity-item">
      <div className="entity-header">
        <input 
          type="checkbox" 
          data-testid={EntitySelectTestId}
          checked={isSelected}
          onChange={() => onSelect(entityId)}
        />
        <h3>{entity.name}</h3>
        <span 
          data-testid={EntityCategoryTestId}
          className="entity-category"
        >
          {entity.category || `Category ${entity.CategoryID}`}
        </span>
      </div>
      <div className="entity-details">
        {imageUrl && !imageError ? (
          <div className="entity-image-container">
            <img 
              src={imageUrl} 
              alt={entity.name} 
              className="entity-image" 
              onError={handleImageError}
            />
          </div>
        ) : imageUrl && imageError ? (
          <div className="entity-image-placeholder">
            <p>Image could not be loaded</p>
          </div>
        ) : (
          <div className="entity-image-placeholder">
            <p>No image available</p>
          </div>
        )}
        <p><strong>ID:</strong> <span>{entityId}</span></p>
        {entity.brand && <p><strong>Brand:</strong> <span>{entity.brand}</span></p>}
        {entity.price && <p><strong>Price:</strong> <span>${entity.price.toFixed(2)}</span></p>}
        {entity.stock !== undefined && <p><strong>Stock:</strong> <span>{entity.stock} units</span></p>}
        {entity.description && (
          <div className="entity-description">
            <p><strong>Description:</strong></p>
            <p className="description-text">{entity.description}</p>
          </div>
        )}
      </div>
      <button 
        data-testid={EntityDeleteTestId}
        className="delete-btn"
        onClick={() => onDelete(entityId)}
      >
        Delete
      </button>
    </div>
  );
};

export default Entity;
