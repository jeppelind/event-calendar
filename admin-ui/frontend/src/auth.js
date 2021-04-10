// based on https://usehooks.com/useAuth/

import React, { createContext, useContext, useState } from 'react';

const authContext = createContext();

export const useAuth = () => {
  return useContext(authContext);
};

export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

const useProvideAuth = () => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setUser('tester');
        resolve();
      }, 2000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    login,
    logout,
  };
}