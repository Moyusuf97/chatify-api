import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SideNav from './components/sidenav';
import Login from './components/login';
import Chat from './components/chat';
import Register from './components/register';
import FetchCsrfToken from './components/csrfToken';


const ProtectedRoute = ({ element, token }) => {
  return token ? element : <Navigate to="/login" />;
};

const ErrorComponent = ({ error }) => {
  if (!error) return null;
  return (
    <div className="error">
      <p>{error}</p>
    </div>
  );
};

const LoadingComponent = () => (
  <div className="loading">
    <p>Loading...</p>
  </div>
);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }, [token, userId]);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://chatify-api.up.railway.app/csrf', {
          method: 'PATCH',
        });
        if (!response.ok) throw new Error('Failed to fetch CSRF token');
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCsrfToken();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <ErrorComponent error={error} />
      <Router>
        <SideNav token={token} setToken={setToken} />
        <Routes>
          <Route path="/" element={<Register csrfToken={csrfToken} />} />
          <Route path="/login" element={<Login setToken={setToken} setUserId={setUserId} csrfToken={csrfToken} />} />
          <Route path="/chat" element={<ProtectedRoute element={<Chat token={token} userId={userId} />} token={token} />} />
          <Route path="*" element={<Navigate to={token ? "/chat" : "/login"} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;