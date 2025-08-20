import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddEntityForm from '../components/AddEntityForm';
import EntitiesList from '../components/EntitiesList';
import FilterEntitiesForm from '../components/FilterEntitiesForm';
import { fetchProducts, fetchCategories, selectLoading, selectError } from '../features/entities/entitiesSlice';

export default function ProductsPage() {
    const dispatch = useDispatch();
    const [showSidebar, setShowSidebar] = useState(false);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="page-content">
                <div className="loading">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content">
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <h2>Product Inventory</h2>
                <p>Manage your fashion inventory with ease</p>
                <button 
                    className="toggle-sidebar-btn mobile-only"
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    {showSidebar ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className="page-layout">
                <div className={`page-sidebar ${showSidebar ? 'show' : ''}`}>
                    <AddEntityForm />
                    <FilterEntitiesForm />
                </div>

                <div className="page-main">
                    <EntitiesList />
                </div>
            </div>
        </div>
    );
}
