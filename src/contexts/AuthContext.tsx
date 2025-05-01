import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface User {
  npm: string;
  name?: string;
  email?: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  isLoggedIn: boolean;
  studentNpm: string | null;
  user: User | null;
  login: (npm: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [studentNpm, setStudentNpm] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const npm = localStorage.getItem("studentNpm");
    const userRole = localStorage.getItem("userRole") || "student";
    
    setIsLoggedIn(loggedIn);
    setStudentNpm(npm);
    
    if (npm) {
      setUser({
        npm,
        role: userRole as 'student' | 'admin'
      });
    }
  }, []);

  const login = (npm: string) => {
    // For the demo, NPM 123456 will be an admin, others will be students
    const userRole = npm === "123456" ? "admin" : "student";
    
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("studentNpm", npm);
    localStorage.setItem("userRole", userRole);
    
    setIsLoggedIn(true);
    setStudentNpm(npm);
    setUser({
      npm,
      role: userRole as 'student' | 'admin'
    });
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("studentNpm");
    localStorage.removeItem("userRole");
    
    setIsLoggedIn(false);
    setStudentNpm(null);
    setUser(null);
  };
  
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, studentNpm, user, login, logout, isAdmin }}>
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
