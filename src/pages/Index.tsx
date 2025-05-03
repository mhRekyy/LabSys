import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  
  // If user is not logged in, navigate to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is admin, navigate to admin dashboard
  // Otherwise, navigate to student dashboard
  if (isAdmin) {
    return <Navigate to="/dashboard?view=admin" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default Index;