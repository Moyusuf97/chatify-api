import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FetchCsrfToken from './csrfToken';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://chatify-api.up.railway.app/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ username, password }),
      });

      // Kontrollera om svaret är HTML (kan indikera ett problem)
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('text/html')) {
        const html = await response.text();
        throw new Error(`Server responded with HTML: ${html}`);
      }

      // Förvänta JSON-svar
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login successful:', data);
      localStorage.setItem('token', data.token); // Antag att servern returnerar en token
      onLoginSuccess(); // Uppdatera login-status i App
      navigate('/chat'); // Omdirigera till chattsidan
    } catch (error) {
      console.error('Login Error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="login-form">
      <FetchCsrfToken setCsrfToken={setCsrfToken} />
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
