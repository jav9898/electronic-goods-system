import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import MainLayout from './components/MainLayout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
