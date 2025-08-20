import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllEntities, selectAvailableCategories } from '../features/entities/entitiesSlice';
import { setDateRange, setCategoryFilter } from '../features/analytics/analyticsSlice';

export default function EnhancedAnalytics() {
    const dispatch = useDispatch();
    const entities = useSelector(selectAllEntities);
    const categories = useSelector(selectAvailableCategories);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Category options for react-select
    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat, label: cat }))
    ];

    // Animation variants for framer-motion
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        dispatch(setCategoryFilter(selectedOption.value));
        toast.success(`Filtered by ${selectedOption.label}`, {
            icon: '📊',
            duration: 2000,
        });
    };

    const handleExportData = () => {
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    // Simulate export process
                    const data = entities.map(item => ({
                        name: item.name,
                        category: item.category,
                        price: item.price,
                        stock: item.stock || 0,
                        sold: item.sold || 0
                    }));
                    
                    // Create and download CSV
                    const csv = [
                        ['Name', 'Category', 'Price', 'Stock', 'Sold'],
                        ...data.map(item => [item.name, item.category, item.price, item.stock, item.sold])
                    ].map(row => row.join(',')).join('\n');
                    
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'inventory-analytics.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    
                    resolve('Export completed!');
                }, 1500);
            }),
            {
                loading: 'Exporting analytics data...',
                success: 'Analytics exported successfully! 📈',
                error: 'Export failed. Please try again.',
            }
        );
    };

    // Calculate filtered data
    const filteredEntities = selectedCategory && selectedCategory.value !== 'all' 
        ? entities.filter(item => item.category === selectedCategory.value)
        : entities;

    const totalValue = filteredEntities.reduce((sum, item) => sum + (item.price || 0), 0);
    const totalSold = filteredEntities.reduce((sum, item) => sum + (item.sold || 0), 0);
    const totalRevenue = filteredEntities.reduce((sum, item) => sum + (item.price || 0) * (item.sold || 0), 0);

    return (
        <div className="enhanced-analytics">
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
            
            <motion.div 
                className="analytics-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3>Enhanced Analytics Dashboard</h3>
                <p>Advanced filtering and data visualization with modern React libraries</p>
            </motion.div>

            <motion.div 
                className="analytics-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className="control-group">
                    <label>Filter by Category:</label>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        options={categoryOptions}
                        placeholder="Select category..."
                        className="category-select"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: '200px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: 'none',
                                '&:hover': {
                                    border: '1px solid #667eea'
                                }
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? '#667eea' : 'white',
                                color: state.isSelected ? 'white' : '#333',
                                '&:hover': {
                                    backgroundColor: state.isSelected ? '#667eea' : '#f7fafc'
                                }
                            })
                        }}
                    />
                </div>
                
                <motion.button
                    className="export-btn"
                    onClick={handleExportData}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-download"></i>
                    Export Data
                </motion.button>
            </motion.div>

            <div className="enhanced-metrics-grid">
                {[
                    { label: 'Products', value: filteredEntities.length, icon: '📦', startColor: '#0e633d', endColor: '#000000' },
                    { label: 'Total Value', value: `$${totalValue.toFixed(2)}`, icon: '💰', startColor: '#000000', endColor: '#0e633d' },
                    { label: 'Units Sold', value: totalSold, icon: '📈', startColor: '#0e633d', endColor: '#000000' },
                    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💎', startColor: '#000000', endColor: '#0e633d' }
                ].map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        className="enhanced-metric-card"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                        }}
                        style={{
                            background: `linear-gradient(135deg, ${metric.startColor} 0%, ${metric.endColor} 100%)`,
                            color: 'white'
                        }}
                    >
                        <div className="metric-icon">{metric.icon}</div>
                        <div className="metric-content">
                            <div className="metric-value">{metric.value}</div>
                            <div className="metric-label">{metric.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {selectedCategory && selectedCategory.value !== 'all' && (
                <motion.div
                    className="filter-info"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <i className="fas fa-filter"></i>
                    <span>Showing data for: <strong>{selectedCategory.label}</strong></span>
                    <button 
                        onClick={() => {
                            setSelectedCategory({ value: 'all', label: 'All Categories' });
                            dispatch(setCategoryFilter('all'));
                            toast.success('Filter cleared', { icon: '🔄' });
                        }}
                        className="clear-filter-btn"
                    >
                        Clear Filter
                    </button>
                </motion.div>
            )}
        </div>
    );
}
