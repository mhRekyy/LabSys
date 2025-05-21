// src/pages/Laboratories.tsx
import React from "react";
import { motion } from "framer-motion";
// Pastikan path ini benar ke provider Anda
import { LabFilterProvider } from "@/components/laboratories/LabFilteringProvider";
import LaboratoriesContent from "@/components/laboratories/LaboratoriesContent";
import { useAuth } from '@/contexts/AuthContext'; // Pastikan path ini benar
import { Navigate, useLocation } from 'react-router-dom';

// HAPUS mock data INITIAL_LABS dari sini. Data akan diambil dari API.

const LaboratoriesPage: React.FC = () => { // Lebih baik dinamai Page jika ini adalah komponen halaman
  const { isAuthenticated, isLoading: authIsLoading } = useAuth();
  const location = useLocation();

  if (authIsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="animate-pulse">Memeriksa sesi login...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-6 space-y-4" // Beri sedikit space
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/*
        LabFilterProvider sekarang akan mengambil data sendiri dari API.
        Kita TIDAK mengirimkan prop 'initialLabs' lagi.
      */}
      <LabFilterProvider>
        <LaboratoriesContent />
      </LabFilterProvider>
    </motion.div>
  );
};

// Pastikan nama export default sesuai dengan nama file jika di-refactor (misal, LaboratoriesPage)
export default LaboratoriesPage; // Jika nama file adalah LaboratoriesPage.tsx
// Atau export default Laboratories; jika nama file adalah Laboratories.tsx