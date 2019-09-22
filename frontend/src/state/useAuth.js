import React, { useState, useContext, useEffect, createContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const auth = useProvideAuth('session');
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function useProvideAuth(key, persistOnWindowClosed = true) {
  if (!key) {
    throw new Error('sessionKey not provided');
  }

  const getStorage = () => {
    return persistOnWindowClosed ? localStorage : sessionStorage;
  };

  const getStoredToken = () => {
    try {
      const storedToken = getStorage().getItem(key);
      if (storedToken != null) {
        // There is a token in storage already
        try {
          // Token is an object
          const token = JSON.parse(token);
          return token;
        } catch {
          // Token is a string
          return storedToken;
        }
      }
    } catch {
      // This catch block handles the known issues listed here: https://caniuse.com/#feat=namevalue-storage
      console.warn(
        'Could not access the browser storage. Session will be lost when closing browser window',
      );
    }
    return null;
  };

  const [token, setToken] = useState(getStoredToken());

  const signIn = token => {
    if (typeof token == 'object' || typeof token === 'string') {
      getStorage().setItem(key, JSON.stringify(token));
      setToken(token);
    } else {
      throw new Error('Only objects or strings can be tokens');
    }
  };

  const signOut = () => {
    getStorage().removeItem(key);
    setToken(null);
  };

  const syncState = event => {
    if (event.key === key) {
      setToken(getStoredToken());
    }
  };
  useEffect(() => {
    window.addEventListener('storage', syncState);
    return () => {
      window.removeEventListener('storage', syncState);
    };
  }, [key]);

  return {
    isAuthenticated: token !== null,
    user: token,
    signIn,
    signOut,
  };
}
