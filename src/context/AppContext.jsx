import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Students/Loading";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // start in loading state

  const api_url = import.meta.env.VITE_API_BASE_URL;

  // Fetch user details after login or refresh
  const userdetails = async () => {
    try {
      const res = await axios.get(`${api_url}/api/userData`, { withCredentials: true });
      setUser(res.data.user);
      console.log(res.data.user)
    } catch (err) {
      if (err.response?.status !== 401) console.error("Error fetching user data:", err);
      setUser(null);
    }
  };

  // Fetch admin details after login or refresh
  const admindetails = async () => {
    try {
      const res = await axios.get(`${api_url}/api/adminData`, { withCredentials: true });
      setAdmin(res.data.admin);
    } catch (err) {
      if (err.response?.status !== 401) console.error("Error fetching admin data:", err);
      setAdmin(null);
    }
  };

  // Auto check on mount (refresh case)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        await userdetails();
        await admindetails();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  if (loading) {
    return <Loading />; // full page loader until session check completes
  }

  return (
    <AppContext.Provider value={{ user, setUser, admin, setAdmin, userdetails, admindetails, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useauth = () => useContext(AppContext);
