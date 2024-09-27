import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Chat from './components/chat';
import SideNav from './components/sidenav';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/chat" /> : <Navigate to="/register" />}
        />
        <Route path="/register" element={<Register onRegister={handleLoginSuccess} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/chat"
          element={isLoggedIn ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/sidenav"
          element={isLoggedIn ? <SideNav /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
