import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../features/user/userSlice';

export default function Navbar() {
    const userProfile = useSelector(selectUserProfile);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>Gyakusou Shop</h1>
                <span className="navbar-subtitle">Management System</span>
            </div>
            
            <div className="navbar-menu">
                <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    <i className="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </NavLink>
                
                <NavLink 
                    to="/products" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    <i className="fas fa-box"></i>
                    <span>Products</span>
                </NavLink>
                
                <NavLink 
                    to="/analytics" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    <i className="fas fa-chart-line"></i>
                    <span>Analytics</span>
                </NavLink>
            </div>

            <div className="navbar-user">
                <div className="user-info">
                    <div className="user-avatar">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="user-details">
                        <span className="user-name">{userProfile.name}</span>
                        <span className="user-role">{userProfile.role}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
