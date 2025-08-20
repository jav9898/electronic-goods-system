import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, selectLoading, selectError } from '../features/entities/entitiesSlice';

// Constants for test IDs
export const AddEntityCategoryTestId = "add-entity-category";
export const AddEntitySubmitTestId = "add-entity-submit";

// Function to generate a random 10-character alphanumeric ID
const generateId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const AddEntityForm = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    categoryID: '',
    description: '',
    imageURL: ''
  });
  
  // State for form validation errors
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    if (!formData.categoryID || parseInt(formData.categoryID) <= 0) {
      newErrors.categoryID = 'Valid category ID is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Create new product data matching API requirements
    const productData = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      categoryID: parseInt(formData.categoryID),
      description: formData.description.trim(),
      imageURL: formData.imageURL.trim() || null
    };

    try {
      // Create the product using Redux async thunk
      await dispatch(createProduct(productData)).unwrap();

      // Reset form on success
      setFormData({
        name: '',
        brand: '',
        categoryID: '',
        description: '',
        imageURL: ''
      });
    } catch (error) {
      // Error is handled by Redux state
      console.error('Failed to create product:', error);
    }
  };

  return (
    <div className="add-entity-form-container">
      <h2>Add New Product</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="add-entity-form">
        <div className={`form-group ${errors.name ? 'error' : ''}`}>
          <label htmlFor="name">Product Name: *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className={`form-group ${errors.brand ? 'error' : ''}`}>
          <label htmlFor="brand">Brand: *</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Enter brand name"
            required
          />
          {errors.brand && <div className="error-message">{errors.brand}</div>}
        </div>

        <div className={`form-group ${errors.categoryID ? 'error' : ''}`}>
          <label htmlFor="categoryID">Category ID: *</label>
          <input
            type="number"
            id="categoryID"
            name="categoryID"
            value={formData.categoryID}
            onChange={handleChange}
            data-testid={AddEntityCategoryTestId}
            placeholder="Enter category ID (e.g. 1, 2, 3)"
            min="1"
            required
          />
          {errors.categoryID && <div className="error-message">{errors.categoryID}</div>}
        </div>

        <div className={`form-group ${errors.description ? 'error' : ''}`}>
          <label htmlFor="description">Description: *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="imageURL">Image URL:</label>
          <input
            type="url"
            id="imageURL"
            name="imageURL"
            value={formData.imageURL}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          data-testid={AddEntitySubmitTestId}
          disabled={loading}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddEntityForm;