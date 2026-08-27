import { createContext, useEffect, useState } from "react";
import { apiClient } from "../services/apiClient.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  );
  const [loading, setLoading] = useState(true);

  // on app load : check if user already loggedIn :
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      if (savedToken) {
        setToken(savedToken);

        try {
          // fetch current user from backend :
          const response = await apiClient.get(`/auth/me`);
          setUser(response.user);

          localStorage.setItem("user", JSON.stringify(response.user));
        } catch (error) {
          console.error("Token expired or invalid!", error);
          // logout();
        } finally {
          setLoading(false);
        }
      }
    };

    loadUser();
  }, [token]);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const logout = async () => {
    // remove token :
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  const updateUser = (newUser) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...newUser };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
