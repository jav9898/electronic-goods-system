import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllEntities, selectAvailableCategories } from '../features/entities/entitiesSlice';
import { selectAnalytics } from '../features/analytics/analyticsSlice';
import EnhancedAnalytics from '../components/EnhancedAnalytics';

export default function AnalyticsPage() {
    const entities = useSelector(selectAllEntities);
    const categories = useSelector(selectAvailableCategories);
    const analytics = useSelector(selectAnalytics);
    const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

    // Calculate analytics data
    const totalRevenue = entities.reduce((sum, item) => sum + (item.price || 0) * (item.sold || 0), 0);
    const totalSold = entities.reduce((sum, item) => sum + (item.sold || 0), 0);
    const averagePrice = entities.length > 0 ? entities.reduce((sum, item) => sum + (item.price || 0), 0) / entities.length : 0;

    // Top performing categories
    const categoryPerformance = categories.map(category => {
        const categoryItems = entities.filter(item => item.category === category);
        const revenue = categoryItems.reduce((sum, item) => sum + (item.price || 0) * (item.sold || 0), 0);
        const sold = categoryItems.reduce((sum, item) => sum + (item.sold || 0), 0);
        return {
            name: category,
            revenue,
            sold,
            items: categoryItems.length
        };
    }).sort((a, b) => b.revenue - a.revenue);

    // Top selling products
    const topProducts = [...entities]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 5);

    return (
        <div className="page-content">
            <div className="page-header">
                <h2>Analytics & Reports</h2>
                <p>Detailed insights into your business performance</p>
                
                <div className="time-range-selector">
                    <label>Time Range:</label>
                    <select 
                        value={selectedTimeRange} 
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="time-range-select"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                </div>
            </div>

            <EnhancedAnalytics />
            
            <div className="analytics-grid">
                {/* Revenue Metrics */}
                <div className="analytics-section">
                    <h3>Revenue Overview</h3>
                    <div className="revenue-metrics">
                        {[
                            { value: `$${totalRevenue.toFixed(2)}`, label: 'Total Revenue', change: '+12.5% vs last period', changeType: 'positive', startColor: '#0e633d', endColor: '#000000' },
                            { value: totalSold, label: 'Units Sold', change: '+8.3% vs last period', changeType: 'positive', startColor: '#000000', endColor: '#0e633d' },
                            { value: `$${averagePrice.toFixed(2)}`, label: 'Average Price', change: '-2.1% vs last period', changeType: 'neutral', startColor: '#0e633d', endColor: '#000000' }
                        ].map((metric, index) => (
                            <div 
                                key={metric.label}
                                className="revenue-card"
                                style={{
                                    background: `linear-gradient(135deg, ${metric.startColor} 0%, ${metric.endColor} 100%)`,
                                    color: 'white'
                                }}
                            >
                                <div className="revenue-value">{metric.value}</div>
                                <div className="revenue-label">{metric.label}</div>
                                <div className={`revenue-change ${metric.changeType}`}>{metric.change}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Performance */}
                <div className="analytics-section">
                    <h3>Category Performance</h3>
                    <div className="category-performance">
                        {categoryPerformance.map(category => (
                            <div key={category.name} className="performance-item">
                                <div className="performance-header">
                                    <span className="category-name">{category.name}</span>
                                    <span className="category-revenue">${category.revenue.toFixed(2)}</span>
                                </div>
                                <div className="performance-details">
                                    <span>{category.sold} sold</span>
                                    <span>{category.items} products</span>
                                </div>
                                <div className="performance-bar">
                                    <div 
                                        className="performance-fill"
                                        style={{ 
                                            width: `${Math.min(100, (category.revenue / Math.max(...categoryPerformance.map(c => c.revenue))) * 100)}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="analytics-section">
                    <h3>Top Selling Products</h3>
                    <div className="top-products">
                        {topProducts.map((product, index) => (
                            <div key={product.id} className="top-product-item">
                                <div className="product-rank">#{index + 1}</div>
                                <div className="product-info">
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-category">{product.category}</div>
                                </div>
                                <div className="product-stats">
                                    <div className="stat">
                                        <span className="stat-value">{product.sold || 0}</span>
                                        <span className="stat-label">sold</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">${((product.price || 0) * (product.sold || 0)).toFixed(2)}</span>
                                        <span className="stat-label">revenue</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Health */}
                <div className="analytics-section">
                    <h3>Inventory Health</h3>
                    <div className="inventory-health">
                        <div className="health-metric">
                            <div className="health-icon healthy">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="health-info">
                                <div className="health-title">Stock Levels</div>
                                <div className="health-desc">
                                    {entities.filter(item => (item.stock || 0) > 10).length} items well stocked
                                </div>
                            </div>
                        </div>
                        
                        <div className="health-metric">
                            <div className="health-icon warning">
                                <i className="fas fa-exclamation-triangle"></i>
                            </div>
                            <div className="health-info">
                                <div className="health-title">Low Stock Alert</div>
                                <div className="health-desc">
                                    {entities.filter(item => (item.stock || 0) < 10 && (item.stock || 0) > 0).length} items need restocking
                                </div>
                            </div>
                        </div>

                        <div className="health-metric">
                            <div className="health-icon critical">
                                <i className="fas fa-times-circle"></i>
                            </div>
                            <div className="health-info">
                                <div className="health-title">Out of Stock</div>
                                <div className="health-desc">
                                    {entities.filter(item => (item.stock || 0) === 0).length} items unavailable
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
