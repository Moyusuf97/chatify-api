import { useEffect, useRef } from 'react';

/**
 * Fetches a CSRF token and sets it using the provided `setCsrfToken` function.
 * 
 * @param {Object} props 
 * @param {Function} props.setCsrfToken 
 * @returns {null} 
 */
const FetchCsrfToken = ({ setCsrfToken }) => {
  const hasFetched = useRef(false); 

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;

      fetch('https://chatify-api.up.railway.app/csrf', {
        method: 'PATCH',
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch CSRF token');
        return response.json();
      })
      .then(data => {
        console.log('Fetched CSRF Token:', data.csrfToken);
        setCsrfToken(data.csrfToken); 
      })
      .catch(error => {
        console.error('Error fetching CSRF token:', error);
      });
    }
  }, [setCsrfToken]); 

  return null; 
};

export default FetchCsrfToken;
