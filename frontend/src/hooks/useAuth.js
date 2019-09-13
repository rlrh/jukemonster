import React, { useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signIn = token => {
    setUser(token);
  };

  const signOut = () => {
    setUser(null);
  };

  // Return the user object and auth methods
  return {
    user,
    signIn,
    signOut,
  };
}
