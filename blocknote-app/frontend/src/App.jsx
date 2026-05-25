import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import './App.css';

export default function App() {
  const [page, setPage] = useState('login');
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  function handleAuth(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setPage('notes');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setPage('login');
  }

  if (token && page === 'notes') {
    return <Notes user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-title">BlockNote</h1>
        <div className="tab-bar">
          <button
            className={page === 'login' ? 'tab active' : 'tab'}
            onClick={() => setPage('login')}
            data-testid="tab-login"
          >
            Login
          </button>
          <button
            className={page === 'register' ? 'tab active' : 'tab'}
            onClick={() => setPage('register')}
            data-testid="tab-register"
          >
            Register
          </button>
        </div>

        {page === 'login' ? (
          <Login onSuccess={handleAuth} onSwitch={() => setPage('register')} />
        ) : (
          <Register onSuccess={handleAuth} onSwitch={() => setPage('login')} />
        )}
      </div>
    </div>
  );
}
