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
  const [user, setUser] = useState({});

  const login = async (email, password) => {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const message = await response.text();
      throw Error(message);
    }
    const result = await response.json();
    setUser(prevState => ({
      ...prevState,
      ...result
    }));
  };

  const logout = () => {
    setUser({});
  };

  return {
    user,
    login,
    logout,
  };
}