import { useState } from 'react';
import { AuthContext } from './AuthContextValue';
export { AuthContext };

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));

  function login(newToken) {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('access_token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
