import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';
import { AdminIcon } from '../components/admin/AdminIcons';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/users/login`,
        form
      );
      if (!data.user.isAdmin) {
        setError('Access denied. Admin only.');
        setLoading(false);
        return;
      }
      localStorage.setItem('corevita_token', data.token);
      localStorage.setItem('corevita_admin', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card fade-in">
        <div className="admin-login-logo">COREVITA</div>
        <h2>Admin Login</h2>
        <p className="admin-login-sub">Sign in to access the admin dashboard</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="admin@corevita.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="admin-hint">
          <span><AdminIcon name="lock" size={14} /> Default: admin@corevita.com / admin123</span>
          <br/>
          <small>Change these in <code>backend/.env</code></small>
        </div>
      </div>
    </div>
  );
}