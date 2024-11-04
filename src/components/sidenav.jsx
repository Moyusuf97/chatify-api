import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onLogin }) => {
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

    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <ul className="nav-links">
        {!isLoggedIn ? (
          <>
            <li>
              <button 
                onClick={() => navigate('/login')} 
                className="nav-button">
                Login
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/')} 
                className="nav-button">
                Register
              </button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout} className="nav-button logout-button">
              Logout
            </button>
          </li>
        )}
      </ul>
      {/* CSS för Sidebar */}
      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 200px;
          height: 100vh;
          background-color: #4267B2; 
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 0;
          color: white;
        }

        .nav-links {
          list-style-type: none;
          padding: 0;
          margin: 0;
          width: 100%;
          text-align: center;
        }

        .nav-button {
          display: block;
          width: 80%;
          padding: 10px 0;
          margin: 10px auto;
          background-color: #ffffff; 
          color: #4267B2; 
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .nav-button:hover {
          background-color: #d1e7ff; 
        }

        .logout-button {
          background-color: #ff6b6b; 
          color: white;
        }

        .logout-button:hover {
          background-color: #ff5252;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
