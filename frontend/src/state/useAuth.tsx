import React, { useState, useContext, useEffect, createContext } from 'react';
import { Credentials, refreshToken } from '../apis';

interface AuthContextMethods {
  value: string | Credentials;
  isAuthenticated: boolean;
  spotify_access_token: string;
  access_token: string;
  ensureTokenValidity: () => Promise<void>;
  signIn: (token: Credentials | string) => void;
  signOut: () => void;
}

const AuthContext = createContext({} as AuthContextMethods);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const auth = useProvideAuth('session');
  return <AuthContext.Provider value={auth}> {children} </AuthContext.Provider>;
}

function useProvideAuth(key: string, persistOnWindowClosed = true) {
  if (!key) {
    throw new Error('Key not provided');
  }

  const getStorage = () => {
    return persistOnWindowClosed ? localStorage : sessionStorage;
  };

  const getStoredValue = (): Credentials | string | null => {
    try {
      const storedValue = getStorage().getItem(key);
      if (storedValue != null) {
        // There is a value in storage already
        try {
          return JSON.parse(storedValue); // Value is an object
        } catch {
          return storedValue; // value is a string
        }
      }
    } catch {
      // This catch block handles the known issues listed here: https://caniuse.com/#feat=namevalue-storage
      console.warn(
        'Could not access browser storage. Session will be lost when closing browser window',
      );
    }
    return null;
  };

  const [value, setValue] = useState(getStoredValue());

  const signIn = (newValue: Credentials | string) => {
    if (typeof newValue === 'object' || typeof newValue === 'string') {
      getStorage().setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    } else {
      throw new Error('Only objects or strings are accepted values');
    }
  };

  const signOut = () => {
    getStorage().removeItem(key);
    setValue(null);
  };

  const ensureTokenValidity = async () => {
    // If the user is not logged in, we can't do this.
    if (typeof value === 'string' || !value.access_token) return;
    // Refresh the token for the app, and update.
    const newValue = await refreshToken(value);
    signIn(newValue);
  };

  const syncState = event => {
    if (event.key === key) {
      setValue(getStoredValue());
    }
  };
  useEffect(() => {
    window.addEventListener('storage', syncState);
    return () => {
      window.removeEventListener('storage', syncState);
    };
  }, [key]);

  return {
    value,
    isAuthenticated:
      value &&
      typeof value === 'object' &&
      'access_token' in value &&
      'spotify_access_token' in value,
    spotify_access_token:
      value && (typeof value === 'string' ? value : value.spotify_access_token),
    access_token:
      value && (typeof value === 'string' ? value : value.access_token),
    ensureTokenValidity,
    signIn,
    signOut,
  };
}
