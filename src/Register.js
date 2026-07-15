import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'TENANT' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/verification/auth/register', formData);
            alert("Registration successful! Please login.");
            navigate('/'); // Redirect to Login page
        } catch (err) {
            alert("Error: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="row">
            {/* 1. The Hero Image (Consistent with Login) */}
            <div className="col-12 mb-5">
                <img
                    src="/hero2.jpg"
                    alt="Architecture"
                    style={{width: '100%', height: '400px', objectFit: 'cover', filter: 'brightness(0.8)'}}
                />
            </div>

            {/* 2. The Register Form */}
            <div className="col-md-6 offset-md-3">
                <h2 className="mb-4 text-center">Create Account</h2>

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-3">
                        <label className="form-label">USERNAME</label>
                        <input
                            className="form-control"
                            placeholder="Choose a username"
                            onChange={e => setFormData({...formData, username: e.target.value})}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label">PASSWORD</label>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Create a password"
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    {/* Role Selector - NEW */}
                    <div className="mb-5">
                        <label className="form-label">I AM A...</label>
                        <select
                            className="form-select" // Uses the new CSS below
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="TENANT">Tenant (Looking to rent)</option>
                            <option value="LANDLORD">Landlord (Verifying tenants)</option>
                        </select>
                    </div>

                    {/* Action Button */}
                    <button className="btn btn-primary w-100 mb-3 shadow">
                        REGISTER ACCOUNT
                    </button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center">
                    <Link to="/" className="text-light small" style={{textDecoration: 'none'}}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;