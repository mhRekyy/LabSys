
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isLoggedIn } = useAuth();
  
  // If user is logged in, navigate to dashboard, otherwise to login page
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
