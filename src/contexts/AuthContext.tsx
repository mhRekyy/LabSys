
import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthContextType {
  isLoggedIn: boolean;
  studentNpm: string | null;
  login: (npm: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [studentNpm, setStudentNpm] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const npm = localStorage.getItem("studentNpm");
    
    setIsLoggedIn(loggedIn);
    setStudentNpm(npm);
  }, []);

  const login = (npm: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("studentNpm", npm);
    setIsLoggedIn(true);
    setStudentNpm(npm);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("studentNpm");
    setIsLoggedIn(false);
    setStudentNpm(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, studentNpm, login, logout }}>
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
