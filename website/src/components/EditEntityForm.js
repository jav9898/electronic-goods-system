import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, selectCategories } from '../features/entities/entitiesSlice';

const EditEntityForm = ({ entity, onClose, onUpdate }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    categoryID: '',
    description: '',
    imageURL: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Populate form with entity data when component mounts
  useEffect(() => {
    if (entity) {
      setFormData({
        name: entity.name || '',
        brand: entity.brand || '',
        categoryID: entity.CategoryID || '',
        description: entity.description || '',
        imageURL: entity.ImageURL || ''
      });
    }
  }, [entity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const updateData = {
        productID: entity.productID,
        name: formData.name,
        brand: formData.brand,
        categoryID: parseInt(formData.categoryID),
        description: formData.description,
        imageURL: formData.imageURL
      };

      const result = await dispatch(updateProduct(updateData)).unwrap();
      
      if (onUpdate) {
        onUpdate(result);
      }
      
      onClose();
    } catch (err) {
      setError(err || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!entity) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content">
        <div className="form-container">
          <div className="form-header">
            <h3>Edit Product</h3>
            <button 
              className="close-btn" 
              onClick={onClose}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="entity-form">
            <div className="form-group">
              <label htmlFor="edit-name">Product Name *</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-brand">Brand *</label>
              <input
                type="text"
                id="edit-brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                placeholder="Enter brand name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-categoryID">Category ID *</label>
              <input
                type="number"
                id="edit-categoryID"
                name="categoryID"
                value={formData.categoryID}
                onChange={handleInputChange}
                required
                placeholder="Enter category ID (e.g. 1, 2, 3)"
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-imageURL">Image URL</label>
              <input
                type="url"
                id="edit-imageURL"
                name="imageURL"
                value={formData.imageURL}
                onChange={handleInputChange}
                placeholder="Enter image URL (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-description">Description *</label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter product description"
                rows="4"
              />
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={onClose} 
                className="cancel-btn"
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="submit-btn"
                style={{
                  backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEntityForm;
