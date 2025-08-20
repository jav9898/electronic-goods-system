import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllEntities, selectAvailableCategories } from '../features/entities/entitiesSlice';
import { selectUserProfile } from '../features/user/userSlice';

export default function DashboardPage() {
    const entities = useSelector(selectAllEntities);
    const categories = useSelector(selectAvailableCategories);
    const userProfile = useSelector(selectUserProfile);

    // Calculate statistics
    const totalProducts = entities.length;
    const totalValue = entities.reduce((sum, item) => sum + (item.price || 0), 0);
    const lowStockItems = entities.filter(item => (item.stock || 0) < 10);
    const outOfStockItems = entities.filter(item => (item.stock || 0) === 0);

    // Category distribution
    const categoryStats = categories.map(category => ({
        name: category,
        count: entities.filter(item => item.category === category).length,
        value: entities
            .filter(item => item.category === category)
            .reduce((sum, item) => sum + (item.price || 0), 0)
    }));

    return (
        <div className="page-content">
            <div className="page-header">
                <h2>Dashboard</h2>
                <p>Welcome back, {userProfile.name}! Here's your inventory overview.</p>
            </div>

            <div className="dashboard-grid">
                {/* Key Metrics */}
                <div className="dashboard-section">
                    <h3>Key Metrics</h3>
                    <div className="metrics-grid">
                        {[
                            { value: totalProducts, label: 'Total Products', isAlert: false, startColor: '#0e633d', endColor: '#000000' },
                            { value: `$${totalValue.toFixed(2)}`, label: 'Total Inventory Value', isAlert: false, startColor: '#000000', endColor: '#0e633d' },
                            { value: categories.length, label: 'Categories', isAlert: false, startColor: '#0e633d', endColor: '#000000' },
                            { value: lowStockItems.length, label: 'Low Stock Items', isAlert: true, startColor: '#dc2626', endColor: '#7f1d1d' }
                        ].map((metric, index) => (
                            <div 
                                key={metric.label}
                                className={`metric-card ${metric.isAlert ? 'alert' : ''}`}
                                style={{
                                    background: `linear-gradient(135deg, ${metric.startColor} 0%, ${metric.endColor} 100%)`,
                                    color: 'white'
                                }}
                            >
                                <div className="metric-value">{metric.value}</div>
                                <div className="metric-label">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="dashboard-section">
                    <h3>Category Breakdown</h3>
                    <div className="category-stats">
                        {categoryStats.map(category => (
                            <div key={category.name} className="category-stat">
                                <div className="category-info">
                                    <span className="category-name">{category.name}</span>
                                    <span className="category-count">{category.count} items</span>
                                </div>
                                <div className="category-value">${category.value.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div className="dashboard-section">
                    <h3>Inventory Alerts</h3>
                    <div className="alerts-list">
                        {outOfStockItems.length > 0 && (
                            <div className="alert-item critical">
                                <i className="fas fa-exclamation-triangle"></i>
                                <span>{outOfStockItems.length} items are out of stock</span>
                            </div>
                        )}
                        {lowStockItems.length > 0 && (
                            <div className="alert-item warning">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>{lowStockItems.length} items have low stock (less than 10)</span>
                            </div>
                        )}
                        {outOfStockItems.length === 0 && lowStockItems.length === 0 && (
                            <div className="alert-item success">
                                <i className="fas fa-check-circle"></i>
                                <span>All items are well stocked!</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard-section">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        <button className="action-btn primary">
                            <i className="fas fa-plus"></i>
                            Add New Product
                        </button>
                        <button className="action-btn secondary">
                            <i className="fas fa-download"></i>
                            Export Inventory
                        </button>
                        <button className="action-btn secondary">
                            <i className="fas fa-chart-bar"></i>
                            View Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
