import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, []);

  const handleLogout = () => {
    
     localStorage.removeItem('token');
    localStorage.removeItem('currentUserId'); 
    localStorage.removeItem('currentConversationId');
    
    
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <ul className="nav-links">
        {!isLoggedIn ? (
          <>
            {/* Visa Logga in och Registrera länkar om användaren inte är inloggad */}
            <li>
              <button onClick={() => navigate('/login')} className="nav-button">
                Login
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/register')} className="nav-button">
                Register
              </button>
            </li>
          </>
        ) : (
          <li>
            {/* Visa Logout om användaren är inloggad */}
            <button onClick={handleLogout} className="nav-button logout-button">
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
