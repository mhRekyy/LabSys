import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface User {
  npm: string;
  name?: string;
  email?: string;
  role: 'mahasiswa' | 'aslab';
}

interface AuthContextType {
  isLoggedIn: boolean;
  studentNpm: string | null;
  user: User | null;
  login: (npm: string, role: 'mahasiswa' | 'aslab') => void;
  logout: () => void;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [studentNpm, setStudentNpm] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isStudent, setIsStudent] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const npm = localStorage.getItem("studentNpm");
    const userRole = localStorage.getItem("userRole") || "mahasiswa";
    
    setIsLoggedIn(loggedIn);
    setStudentNpm(npm);
    
    if (npm) {
      const role = userRole as 'mahasiswa' | 'aslab';
      setUser({
        npm,
        role
      });
      
      // Set role-based flags
      setIsAdmin(role === 'aslab');
      setIsStudent(role === 'mahasiswa');
    }
  }, []);

  const login = (npm: string, role: 'mahasiswa' | 'aslab') => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("studentNpm", npm);
    localStorage.setItem("userRole", role);
    
    setIsLoggedIn(true);
    setStudentNpm(npm);
    setUser({
      npm,
      role
    });
    
    // Set role-based flags
    setIsAdmin(role === 'aslab');
    setIsStudent(role === 'mahasiswa');
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("studentNpm");
    localStorage.removeItem("userRole");
    
    setIsLoggedIn(false);
    setStudentNpm(null);
    setUser(null);
    setIsAdmin(false);
    setIsStudent(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      studentNpm, 
      user, 
      login, 
      logout, 
      isAdmin, 
      isStudent 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Add a component to require admin access
export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};