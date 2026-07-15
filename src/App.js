import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Login';
import Register from './Register';
import TenantDashboard from './TenantDashboard';
import LandlordDashboard from './LandlordDashboard';

function App() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("app_user");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("app_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("app_user");
        }
    }, [user]);

    return (
        <Router>
            <div className="App">
                <nav className="navbar d-flex justify-content-between align-items-center">
                    {/* UPDATED BRAND NAME */}
                    <span className="navbar-brand">
                ZRent
            </span>

                    {/* Right Side */}
                    <div>
                        {user ? (
                            <button className="btn btn-outline-light" onClick={() => setUser(null)}>
                                Logout
                            </button>
                        ) : (
                            <span className="text-muted small" style={{fontFamily: 'Inter'}}>
                        Secure Verification Portal
                    </span>
                        )}
                    </div>
                </nav>

                {/* Content Area */}
                <div className="container mt-5">
                    <Routes>
                        <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to={user.role === 'LANDLORD' ? "/landlord" : "/tenant"} />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/tenant" element={
                            user?.role === 'TENANT' ? <TenantDashboard tenantId={user.id} /> : <Navigate to="/" />
                        } />

                        <Route path="/landlord" element={
                            user?.role === 'LANDLORD' ? <LandlordDashboard user={user} /> : <Navigate to="/" />
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;