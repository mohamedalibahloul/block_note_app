import { useState } from 'react';
import { api } from '../api';

export default function Login({ onSuccess, onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(form);
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form" data-testid="login-form">
      {error && <p className="form-error" data-testid="login-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          data-testid="login-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          data-testid="login-password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading} data-testid="login-submit">
        {loading ? 'Logging in…' : 'Login'}
      </button>

      <p className="switch-link">
        No account?{' '}
        <button type="button" className="link-btn" onClick={onSwitch} data-testid="go-register">
          Register
        </button>
      </p>
    </form>
  );
}
