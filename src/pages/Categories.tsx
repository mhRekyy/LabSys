// src/pages/Categories.tsx (Versi Terhubung ke Backend - Dasar)

import React, { useState, useEffect, useCallback } from 'react'; // Import hook
import { Link } from 'react-router-dom'; // Import Link jika perlu untuk View Items
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, Edit } from "lucide-react"; // Import ikon
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { toast } from 'sonner'; // Import toast jika perlu untuk aksi

// Hapus import mock data
// import { categories, inventoryItems } from "@/data/mockData";

// --- Tipe Data Kategori (Idealnya dari src/types) ---
interface KategoriType {
    id: number;
    nama_kategori: string;
    deskripsi?: string | null; // Tambahkan jika ada di API
    created_at?: string;
    updated_at?: string;
    // Hapus properti 'color' jika tidak ada di API
}
// --- Akhir Tipe Data ---

const Categories = () => {
  // --- State ---
  const [categoriesData, setCategoriesData] = useState<KategoriType[]>([]); // State untuk data API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAdmin, isAslab } = useAuth(); // Ambil token dan role
  const canManage = isAdmin || isAslab;

  // --- Fungsi Fetch Kategori ---
  const fetchCategories = useCallback(async () => {
    if (!token) {
        setIsLoading(false); // Berhenti loading jika tidak ada token
        return;
    }
    setIsLoading(true);
    setError(null);
    const apiUrl = "http://127.0.0.1:8000/api/kategori"; // Endpoint backend
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setCategoriesData(data.data); // Simpan data dari API ke state
      } else {
         throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || 'Could not load categories.');
      setCategoriesData([]); // Kosongkan jika error
    } finally {
        setIsLoading(false);
    }
  }, [token]); // Dependensi token

  // --- useEffect untuk Fetch saat Komponen Mount ---
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // Panggil fetchCategories saat mount

  // --- Handler Aksi (Placeholder - Perlu API Backend) ---
  const handleAddCategory = () => {
      // TODO: Buka dialog tambah kategori
      toast.info("Add category functionality not implemented yet.");
  };

  const handleEditCategory = (categoryId: number) => {
      // TODO: Buka dialog edit kategori
      toast.info(`Edit category ${categoryId} functionality not implemented yet.`);
  };

  const handleViewItems = (categoryId: number) => {
      // TODO: Navigasi ke halaman Inventory dengan filter kategori
      toast.info(`View items for category ${categoryId} functionality not implemented yet.`);
      // Contoh navigasi: navigate(`/inventory?category=${categoryId}`);
  };

  // --- JSX Rendering ---
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage inventory categories.
          </p>
        </div>
        {/* Tombol Add hanya untuk Admin/Aslab */}
        {canManage && (
            <Button className="w-full sm:w-auto" size="sm" onClick={handleAddCategory}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Category
            </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && <div className="text-center p-10">Loading categories...</div>}

      {/* Error State */}
      {error && !isLoading && <div className="text-center p-10 text-red-500">{error}</div>}

      {/* Tampilan Grid Kategori */}
      {!isLoading && !error && categoriesData.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Gunakan categoriesData dari state */}
          {categoriesData.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              {/* Hapus header warna jika tidak ada data color */}
              {/* <div className="h-2" style={{ backgroundColor: category.color }}></div> */}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                   {/* Gunakan nama_kategori */}
                  {category.nama_kategori}
                </CardTitle>
              </CardHeader>
              <CardContent>
                 {/* Hitung item per kategori perlu logika berbeda (misal data agregat dari API atau filter client-side jika data inventaris di-load semua) */}
                 {/* Untuk sekarang, tampilkan deskripsi jika ada */}
                 <p className="text-sm text-muted-foreground mb-4">{category.deskripsi || 'No description.'}</p>
                {/* <div className="flex items-center mb-4">
                  <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{getCategoryItemCount(category.id)} items</span>
                </div> */}
                <div className="flex justify-end gap-2">
                  {/* Tombol Edit hanya untuk Admin/Aslab */}
                  {canManage && (
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(category.id)}>Edit</Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleViewItems(category.id)}>View Items</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

       {/* Pesan Jika Tidak Ada Kategori */}
       {!isLoading && !error && categoriesData.length === 0 && (
            <div className="h-60 flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
              <Package className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No categories found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {canManage ? "Add a new category to get started." : "No categories available at the moment."}
              </p>
            </div>
       )}
    </div>
  );
};

export default Categories;