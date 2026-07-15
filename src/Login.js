import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/verification/auth/login', formData);
            setUser(res.data);
            if (res.data.role === 'LANDLORD') navigate('/landlord');
            else navigate('/tenant');
        } catch (err) {
            alert("Login Failed: " + err.response?.data);
        }
    };

    return (
        <div className="row">
            {/* 1. The Hero Image (Takes up large space like the screenshot) */}
            <div className="col-12 mb-5">
                <img
                    src="/hero.jpg"
                    alt="Architecture"
                    style={{width: '100%', height: '400px', objectFit: 'cover', filter: 'brightness(0.8)'}}
                />
            </div>

            {/* 2. The Minimal Login Form */}
            <div className="col-md-6 offset-md-3">
                <h2 className="mb-4 text-center">Login Access</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="text-muted small">USERNAME</label>
                        <input className="form-control"
                               onChange={e => setFormData({...formData, username: e.target.value})} />
                    </div>
                    <div className="mb-4">
                        <label className="text-muted small">PASSWORD</label>
                        <input className="form-control" type="password"
                               onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <button className="btn btn-primary w-100 mb-3">Enter Portal</button>
                </form>
                <div className="text-center">
                    <Link to="/register" className="text-light small" style={{textDecoration: 'none'}}>
                        Create an account →
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default Login;