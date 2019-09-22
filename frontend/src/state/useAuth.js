import React, { useState, useContext, useEffect, createContext } from 'react';
import * as api from '../apis';

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
          return JSON.parse(storedToken);
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

  const signIn = auth_results => {
    Object.keys(auth_results).forEach(key => {
      const token = auth_results[key];
      if (typeof token == 'object' || typeof token === 'string') {
        getStorage().setItem(key, JSON.stringify(token));
      }
    });
    setToken(auth_results);
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

  const ensureTokenValidity = async () => {
    // If the user is not logged in, we can't do this.
    if (!token.access_token) return;
    // Refresh the token for the app, and update.
    const newToken = await api.refreshToken(token);
    const updated = { ...token, access_token: newToken.access };
    signIn(updated);
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
    ensureTokenValidity,
    signIn,
    signOut,
  };
}
