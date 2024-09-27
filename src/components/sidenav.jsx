import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUserId'); // Clear any other relevant user data
    localStorage.removeItem('currentConversationId');
    
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
