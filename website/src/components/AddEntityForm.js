
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function AddEntityForm({ addEntity }) {
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');

  const categories = useSelector((state) =>
    [...new Set(state.entities.items.map((e) => e.category))]
  );

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === '__custom__') {
      setIsCustom(true);
      setCategory('');
    } else {
      setIsCustom(false);
      setCategory(value);
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const finalCategory = isCustom ? customCategory.trim() : category;

  // Validate input
  if (!finalCategory || !name.trim() || !brand.trim() || !price.trim()) {
    alert("Please fill in all fields");
    return;
  }

  const newEntity = {
    id: Math.random().toString(36).substring(2, 10),
    category: finalCategory,
    name: name.trim(),
    brand: brand.trim(),
    price: parseFloat(price),
  };

  addEntity(newEntity);

  // Reset form
  setCategory('');
  setCustomCategory('');
  setIsCustom(false);
  setName('');
  setBrand('');
  setPrice('');
};


  return (
    <form onSubmit={handleSubmit}>
      {/* Category Dropdown */}
      <select value={isCustom ? '__custom__' : category} onChange={handleCategoryChange}>
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
        <option value="__custom__">Add new category...</option>
      </select>

      {/* Custom category input */}
      {isCustom && (
        <input
          type="text"
          placeholder="Enter new category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
        />
      )}

      {/* Other inputs */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="submit"
        value="Add Entity"
      />
    </form>
  );
}

export default AddEntityForm;
