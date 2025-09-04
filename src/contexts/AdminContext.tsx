import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Secure admin credentials - in production, this should be environment variables
const ADMIN_CREDENTIALS = {
  email: 'droptaxigo06@gmail.com',
  password: 'droptaxigoadminportal@marzelet$'
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken');
    const tokenExpiry = localStorage.getItem('adminTokenExpiry');
    
    if (adminToken && tokenExpiry) {
      const now = new Date().getTime();
      if (now < parseInt(tokenExpiry)) {
        setIsAdminLoggedIn(true);
      } else {
        // Token expired, clean up
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
      }
    }
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Create a secure token with expiry (24 hours)
      const token = btoa(JSON.stringify({ 
        email, 
        timestamp: new Date().getTime(),
        role: 'admin'
      }));
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminTokenExpiry', expiry.toString());
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
