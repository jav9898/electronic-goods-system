import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
    return (
        <div className="app">
            <Navbar />
            <main className="main-container">
                <Outlet />
            </main>
        </div>
    );
}
