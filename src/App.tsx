import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import BorrowingHistory from "./pages/BorrowingHistory";
import Laboratories from "./pages/Laboratories";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Index from "./pages/Index";
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" closeButton />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/index" element={<Index />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <RequireAuth>
                  <Layout><Dashboard /></Layout>
                </RequireAuth>
              } />
              <Route path="/dashboard" element={
                <RequireAuth>
                  <Layout><Dashboard /></Layout>
                </RequireAuth>
              } />
              <Route path="/inventory" element={
                <RequireAuth>
                  <Layout><Inventory /></Layout>
                </RequireAuth>
              } />
              <Route path="/borrowing-history" element={
                <RequireAuth>
                  <Layout><BorrowingHistory /></Layout>
                </RequireAuth>
              } />
              <Route path="/laboratories" element={
                <RequireAuth>
                  <Layout><Laboratories /></Layout>
                </RequireAuth>
              } />
              <Route path="/categories" element={
                <RequireAuth>
                  <Layout><Categories /></Layout>
                </RequireAuth>
              } />
              <Route path="/settings" element={
                <RequireAuth>
                  <Layout><Settings /></Layout>
                </RequireAuth>
              } />
              
              {/* 404 and fallback routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
