import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp;

        // Check if the token is not expired
        if (expirationTime * 1000 > Date.now()) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Runs only once when the component mounts

  return isLoggedIn;
}

export default useIsLoggedIn;
