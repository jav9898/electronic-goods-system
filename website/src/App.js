
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// useSelector and useDispatch are React Redux hooks.
// These hooks replace useState and provide centralized access to the Redux store.
import { useSelector, useDispatch } from 'react-redux';


import AddEntityForm from './components/AddEntityForm';
import EntitiesList from './components/EntitiesList';
import FilterEntitiesForm from './components/FilterEntitiesForm';
import {
    addEntity,
    deleteEntity,
    toggleSelectEntity,
    deleteSelectedEntities,
    toggleFilter,
} from './redux/slices/entitySlice';

function HomePage() {
    const dispatch = useDispatch();
    const entities = useSelector((state) => state.entities.items);
    const selectedIds = useSelector((state) => state.entities.selectedIds);
    const filters = useSelector((state) => state.entities.filters);

    const handleAddEntity = (newEntity) => {
        dispatch(addEntity(newEntity));
        
    };

    const handleDeleteEntity = (id) => {
        dispatch(deleteEntity(id));
    };

    const handleToggleSelect = (id) => {
        dispatch(toggleSelectEntity(id));
    };

    const handleDeleteSelected = () => {
        dispatch(deleteSelectedEntities());
        toast.warn('Selected entities deleted.');
    };

    const handleFilterChange = (category) => {
        dispatch(toggleFilter(category));
    };

    const filteredEntities =
        filters.length === 0
            ? entities
            : entities.filter((e) => filters.includes(e.category));

    const uniqueCategories = [...new Set(entities.map((e) => e.category))];

    return (
        <div className="page-container">
            <header className="page-header">
                <h1>Fashion Shop Admin</h1>
                <p className="subtitle">Manage your fashion inventory efficiently</p>
            </header>
            <AddEntityForm addEntity={handleAddEntity} />
            <FilterEntitiesForm
                categories={uniqueCategories}
                selectedFilters={filters}
                onFilterChange={handleFilterChange}
            />
            <EntitiesList
                entities={filteredEntities}
                selectedIds={selectedIds}
                onSelect={handleToggleSelect}
                onDelete={handleDeleteEntity}
                onDeleteSelected={handleDeleteSelected}
            />
        </div>
    );
}

function AboutPage() {
    return (
        <div className="about-page">
            <div className="about-card">
                <h1>About This Project</h1>
                <p>
                    This project is part of CA2 
                    It showcases a simple inventory admin system for managing fashion items.
                </p>
                <h3>📦 Features:</h3>
                <ul>
                    <li>Add, filter, and delete fashion items</li>
                    <li>Category filtering with Redux state</li>
                    <li>Notifications with React Toastify</li>
                    <li>Routing with React Router</li>
                </ul>
                <h3>🔧 Built With:</h3>
                <ul>
                    <li>React + Redux Toolkit</li>
                    <li>React Router</li>
                    <li>Toastify for alerts</li>
                    <li>CSS for styling</li>
                </ul>
                <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                    Created by coderboy81
                </p>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <nav className="main-nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </Router>
        
    );
}
