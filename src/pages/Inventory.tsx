// src/pages/Inventory.tsx (Versi Lengkap Terhubung Backend - Dasar)

import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Link, useSearchParams } from "react-router-dom"; // Import useSearchParams jika perlu state di URL
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Search, Plus, Filter, MoreVertical, Edit, Trash2, Package, MapPin, History, Eye, ChevronLeft, ChevronRight
} from "lucide-react"; // Hapus CirclePlus, Tambah ChevronLeft/Right
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
// Import komponen dialog Anda
import AddItemDialog from "@/components/inventory/AddItemDialog";
import ViewItemDialog from "@/components/inventory/ViewItemDialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Import komponen Card/List item Anda
// import InventoryCard from "@/components/inventory/InventoryCard";
// import InventoryListItem from "@/components/inventory/InventoryListItem";

// --- Definisikan Tipe Data (Sesuaikan dengan data real dari API/types) ---
interface KategoriType {
    id: number;
    nama_kategori: string;
    // tambahkan properti lain jika ada
}

interface InventarisType {
    id: number;
    nama_alat: string;
    kategori: KategoriType | null; // Kategori bisa null jika nullable di backend
    kondisi: string;
    jumlah: number;
    lokasi?: string | null;
    deskripsi?: string | null;
    nomor_seri?: string | null;
    tanggal_pengadaan?: string | null;
    created_at: string;
    updated_at: string;
    // tambahkan imageUrl jika ada
    imageUrl?: string;
}
// --- Akhir Definisi Tipe Data ---


const Inventory = () => {
  // --- State ---
  const [inventoryData, setInventoryData] = useState<InventarisType[]>([]);
  const [categories, setCategories] = useState<KategoriType[]>([]);
  // const [locations, setLocations] = useState<string[]>([]); // State lokasi bisa diisi nanti
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk filter, pagination, sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10); // Default item per halaman
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Untuk debounce search
  const [selectedCategory, setSelectedCategory] = useState(''); // Simpan ID Kategori (string)
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('nama_alat'); // Default sort
  const [sortDirection, setSortDirection] = useState('asc'); // Default direction

  // State untuk Dialog
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showViewItemDialog, setShowViewItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventarisType | null>(null);

  // State untuk View Mode (jika masih dipakai)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { token, isAdmin, isAslab } = useAuth(); // Ambil token dan flag role
  const canManage = isAdmin || isAslab; // Flag helper untuk hak akses Admin/Aslab

  // --- Fungsi Fetch Kategori ---
  const fetchCategories = useCallback(async () => {
    if (!token) return;
    const apiUrl = "http://127.0.0.1:8000/api/kategori";
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
         throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      toast.error("Could not load categories."); // Tampilkan error ke user
    }
  }, [token]); // Dependensi token

  // --- Fungsi Fetch Inventaris ---
  const fetchInventory = useCallback(async (page = 1) => { // Terima page sebagai argumen
    if (!token) return;
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());
    if (debouncedSearchTerm) params.append('search', debouncedSearchTerm); // Gunakan debounced term
    if (selectedCategory) params.append('kategori_id', selectedCategory);
    if (selectedLocation) params.append('lokasi', selectedLocation);
    params.append('sort_by', sortBy);
    params.append('direction', sortDirection);

    const apiUrl = `http://127.0.0.1:8000/api/inventaris?${params.toString()}`;

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
        setInventoryData(data.data);
        if (data.meta) {
            setCurrentPage(data.meta.current_page);
            setTotalPages(data.meta.last_page);
            setPerPage(data.meta.per_page);
            setTotalItems(data.meta.total); // Ambil total item
        } else {
             // Jika tidak ada meta (misal tidak pakai pagination), handle di sini
             setInventoryData(data.data);
             setCurrentPage(1);
             setTotalPages(1);
             setTotalItems(data.data.length);
        }
      } else {
          throw new Error(data.message || 'Failed to fetch inventory');
      }
    } catch (err: any) {
      console.error("Error fetching inventory:", err);
      setError(err.message || 'Failed to load inventory data.');
      setInventoryData([]); // Kosongkan data jika error
    } finally {
      setIsLoading(false);
    }
  }, [token, perPage, debouncedSearchTerm, selectedCategory, selectedLocation, sortBy, sortDirection]); // Dependensi fetchInventory


  // --- useEffect untuk Load Awal ---
  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchInventory(1); // Fetch halaman pertama saat token ada
    } else {
      setIsLoading(false); // Selesai loading jika tidak ada token
      setInventoryData([]); // Kosongkan data
      setCategories([]);
    }
  }, [token, fetchCategories, fetchInventory]); // Hanya bergantung pada token dan fungsi fetch


  // --- useEffect untuk Debounce Search Term ---
   useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Tunggu 500ms setelah user berhenti mengetik

    return () => {
      clearTimeout(handler); // Bersihkan timeout jika user mengetik lagi
    };
  }, [searchTerm]);

  // --- useEffect untuk Fetch Ulang saat Filter/Sort/Debounce Berubah ---
  useEffect(() => {
    // Hanya fetch jika bukan load awal (token sudah ada) dan tidak sedang loading
    // Kita panggil fetchInventory dengan halaman 1 setiap filter/sort berubah
    if (token && !isLoading) {
       console.log("Fetching inventory due to filter/sort change...");
       fetchInventory(1); // Selalu kembali ke halaman 1 saat filter/sort berubah
    }
    // Jangan tambahkan fetchInventory ke dependency array ini untuk menghindari loop tak terbatas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, selectedCategory, selectedLocation, sortBy, sortDirection, perPage, token]);


  // --- Handler untuk Aksi (Contoh Delete, lainnya perlu implementasi fetch) ---
   const handleDelete = async (itemId: number) => { // Ubah parameter ke number
    if (!canManage) {
      toast.error("You don't have permission to delete items");
      return;
    }
    if (!token) return;

    // Konfirmasi sebelum hapus
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setIsLoading(true); // Bisa gunakan loading spesifik per item
    const apiUrl = `http://127.0.0.1:8000/api/inventaris/${itemId}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json(); // Baca response meskipun 200/204

      if (response.ok || response.status === 204) {
        toast.success(data.message || "Item deleted successfully");
        // Refresh data inventaris setelah delete
        fetchInventory(currentPage); // Tetap di halaman saat ini atau kembali ke halaman 1?
      } else {
         throw new Error(data.message || "Failed to delete item.");
      }
    } catch (err: any) {
       console.error("Error deleting item:", err);
       toast.error(err.message || "Could not delete item.");
    } finally {
       setIsLoading(false);
    }
  };

  // --- Handler untuk Aksi Lain (Perlu Implementasi Fetch API) ---
  const handleBorrowItem = (item: InventarisType) => {
    setSelectedItem(item);
    // Logika dialog borrow akan memanggil API POST /api/peminjaman
    setShowViewItemDialog(true); // Buka dialog view yang ada tombol borrow?
    console.log("Borrow button clicked for:", item.nama_alat);
    // TODO: Implement API call for borrowing in ViewItemDialog/confirmBorrow
  };

  const handleViewItem = (item: InventarisType) => {
    setSelectedItem(item);
    setShowViewItemDialog(true);
  };

  const confirmBorrow = async (item: InventarisType | null, quantity: number, returnDate: string, purpose: string) => {
      if (!item || !token) return;
      setShowViewItemDialog(false);
      setIsLoading(true); // Tampilkan loading global atau spesifik

      const apiUrl = `http://127.0.0.1:8000/api/peminjaman`;
      try {
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                  inventaris_id: item.id,
                  jumlah_pinjam: quantity,
                  tanggal_kembali_rencana: returnDate, // Format YYYY-MM-DD
                  tujuan_peminjaman: purpose,
              }),
          });
          const data = await response.json();

          if (response.status === 201) {
              toast.success(data.message || `Successfully requested to borrow ${item.nama_alat}`);
              // Refresh inventory untuk update jumlah? Atau tunggu status Approved?
              fetchInventory(currentPage);
          } else {
              throw new Error(data.message || 'Failed to request borrow');
          }
      } catch (err: any) {
          console.error("Error borrowing item:", err);
          toast.error(err.message || "Could not borrow item.");
      } finally {
          setIsLoading(false);
      }
  };

  const handleAddItem = async (newItemData: Omit<InventarisType, 'id' | 'created_at' | 'updated_at' | 'kategori'> & {kategori_id: number | string}) => {
      // Dipanggil dari AddItemDialog saat form disubmit
      if (!canManage || !token) return;
      setIsLoading(true);
      const apiUrl = `http://127.0.0.1:8000/api/inventaris`;
      try {
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(newItemData),
          });
          const data = await response.json();
          if (response.status === 201) {
              toast.success(data.message || "Item added successfully");
              setShowAddItemDialog(false); // Tutup dialog
              fetchInventory(1); // Kembali ke halaman pertama setelah menambah item baru
          } else {
              // Tangani error validasi (422)
              if (response.status === 422 && data.errors) {
                   const errorMessages = Object.values(data.errors).flat().join(' ');
                   throw new Error(`Validation failed: ${errorMessages}`);
              }
              throw new Error(data.message || "Failed to add item");
          }
      } catch (err: any) {
          console.error("Error adding item:", err);
          toast.error(err.message || "Could not add item.");
      } finally {
          setIsLoading(false);
      }
  };


  // --- Handler Pagination ---
  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage); // Update state halaman
          fetchInventory(newPage); // Fetch data untuk halaman baru
      }
  };


  // --- JSX ---
  return (
    <div className="space-y-6 animate-fade-in">
      {/* --- Header & Tombol Aksi --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
         <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            {canManage
              ? "Manage and track all campus inventory items."
              : "Browse and borrow laboratory equipment."
            }
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto" size="sm" asChild>
            <Link to="/borrowing-history">
              <History className="mr-2 h-4 w-4" />
              Borrowing History
            </Link>
          </Button>
          {/* Tampilkan tombol Add hanya jika Admin/Aslab */}
          {canManage && (
            <Button
              className="w-full sm:w-auto"
              size="sm"
              onClick={() => setShowAddItemDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          )}
        </div>
      </div>

      {/* --- Filter & Konten --- */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* --- Kolom Filter --- */}
        <div className="md:col-span-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="space-y-2">
                <Label htmlFor="search-inventory">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-inventory"
                    type="search"
                    placeholder="Search by name, serial..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm, useEffect akan handle debounce & fetch
                  />
                </div>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {/* Isi dari state categories */}
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()} // Value harus string ID
                      >
                        {category.nama_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Select (Perlu data lokasi) */}
              <div className="space-y-2">
                 <Label htmlFor="location-filter">Location</Label>
                {/* TODO: Isi Select Lokasi dari data unik atau API */}
                <Select value={selectedLocation} onValueChange={(value) => setSelectedLocation(value === 'all' ? '' : value)}>
                    <SelectTrigger id="location-filter">
                        <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {/* Contoh jika locations adalah array of string */}
                        {/* {locations.map((loc, index) => (
                            <SelectItem key={index} value={loc}>{loc}</SelectItem>
                        ))} */}
                        <SelectItem value="Lab Kimia Dasar A1">Lab Kimia Dasar A1</SelectItem>
                        <SelectItem value="Lab Fisika Dasar F1">Lab Fisika Dasar F1</SelectItem>
                         {/* ... Tambahkan lokasi lain ... */}
                    </SelectContent>
                </Select>
              </div>

              {/* Sort Select */}
              <div className="space-y-2">
                <Label htmlFor="sort-filter">Sort By</Label>
                <Select value={`${sortBy}-${sortDirection}`} onValueChange={(value) => {
                    const [newSortBy, newDirection] = value.split('-');
                    setSortBy(newSortBy);
                    setSortDirection(newDirection);
                    // useEffect akan memanggil fetchInventory(1)
                }}>
                  <SelectTrigger id="sort-filter">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nama_alat-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="nama_alat-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="created_at-desc">Recently Added</SelectItem>
                    <SelectItem value="created_at-asc">Oldest Added</SelectItem>
                    {/* Tambahkan opsi sort lain jika perlu */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
               <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Reset state filter dan panggil fetch
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedLocation("");
                  setSortBy("nama_alat");
                  setSortDirection("asc");
                  // useEffect akan otomatis fetch ulang halaman 1 karena state berubah
                }}
              >
                Reset Filters
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* --- Kolom Konten Inventaris --- */}
        <div className="md:col-span-4 lg:col-span-3">
          {/* Header Konten (Info jumlah, tombol view mode) */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {inventoryData.length} of {totalItems} items (Page {currentPage}/{totalPages})
            </p>
             {/* ... (Tombol View Mode Grid/List) ... */}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center p-10">Loading inventory...</div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center p-10 text-red-500">{error}</div>
          )}

          {/* Tampilan Data (Grid atau List) */}
          {!isLoading && !error && inventoryData.length > 0 && (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventoryData.map((item) => (
                  <InventoryCard
                    key={item.id}
                    item={item}
                    onDelete={() => handleDelete(item.id)} // Kirim ID saja
                    onBorrow={handleBorrowItem} // Tetap kirim item object
                    onView={handleViewItem} // Tetap kirim item object
                    isAdmin={canManage} // Gunakan flag canManage
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {inventoryData.map((item) => (
                  <InventoryListItem
                    key={item.id}
                    item={item}
                    onDelete={() => handleDelete(item.id)}
                    onBorrow={handleBorrowItem}
                    onView={handleViewItem}
                    isAdmin={canManage}
                  />
                ))}
              </div>
            )
          )}

          {/* Pesan Jika Tidak Ada Data */}
          {!isLoading && !error && inventoryData.length === 0 && (
            <div className="h-60 flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
              <Filter className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

           {/* --- Komponen Pagination --- */}
          {!isLoading && !error && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                  >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                  </span>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                  >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
              </div>
          )}

        </div> {/* Akhir Kolom Konten */}
      </div> {/* Akhir Grid Utama */}


      {/* --- Dialog --- */}
      <ViewItemDialog
        open={showViewItemDialog}
        onOpenChange={setShowViewItemDialog}
        item={selectedItem}
        onBorrow={confirmBorrow} // Kirim fungsi confirmBorrow
        canManage={canManage} // Kirim flag admin/aslab
        onDeleteItem={handleDelete} // Kirim fungsi delete
      />

      <AddItemDialog
        open={showAddItemDialog}
        onOpenChange={setShowAddItemDialog}
        onAddItem={handleAddItem} // Kirim fungsi handleAddItem
        categories={categories} // Kirim daftar kategori
        // locations={locations} // Kirim daftar lokasi jika ada
      />

    </div>
  );
};


// ==============================================================
// DEFINISI KOMPONEN InventoryCard & InventoryListItem (Contoh)
// Anda mungkin sudah punya ini di file terpisah
// Sesuaikan dengan struktur data 'item' yang baru dari API
// ==============================================================

interface InventoryCardProps {
  item: InventarisType; // Gunakan tipe data yang benar
  onDelete: () => void; // Hanya perlu trigger, ID sudah ada di item
  onBorrow: (item: InventarisType) => void;
  onView: (item: InventarisType) => void;
  isAdmin: boolean;
}

const InventoryCard = ({ item, onDelete, onBorrow, onView, isAdmin }: InventoryCardProps) => {
  // Contoh JSX (Sesuaikan dengan UI Anda)
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {item.imageUrl ? <img src={item.imageUrl} alt={item.nama_alat} className="h-full w-full object-cover"/> : <Package className="h-12 w-12 text-gray-400" />}
      </div>
      <CardHeader className="p-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-semibold line-clamp-1">{item.nama_alat}</CardTitle>
           {/* Tombol Aksi (View/Admin Menu) */}
           {isAdmin ? (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                   <MoreVertical className="h-4 w-4" />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuItem onClick={() => onView(item)}>View Details</DropdownMenuItem>
                 <DropdownMenuItem>Edit</DropdownMenuItem> {/* TODO: Implement Edit */}
                 <DropdownMenuItem onClick={onDelete} className="text-red-600">Delete</DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           ) : (
             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(item)}>
               <Eye className="h-4 w-4" />
             </Button>
           )}
        </div>
         {/* Tampilkan kategori jika ada */}
         {item.kategori && (
             <Badge variant="secondary" className="mt-1 w-fit text-xs">
                 {item.kategori.nama_kategori}
             </Badge>
         )}
      </CardHeader>
      <CardContent className="p-3 pt-0 text-xs text-muted-foreground flex-grow">
         <p className="line-clamp-2">{item.deskripsi || 'No description'}</p>
         <div className="flex justify-between mt-2">
           <span>Qty: {item.jumlah}</span>
           <span>Cond: {item.kondisi}</span>
         </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
         <div className="text-xs text-muted-foreground flex items-center">
            <MapPin className="h-3 w-3 inline mr-1" />
             {item.lokasi || 'N/A'}
         </div>
         {/* Tombol Aksi Utama */}
         {isAdmin ? (
             <Button variant="outline" size="sm" onClick={() => onView(item)}>View</Button>
         ) : (
             <Button variant="default" size="sm" onClick={() => onBorrow(item)} disabled={item.jumlah <= 0}>
                 {item.jumlah > 0 ? 'Borrow' : 'Out of Stock'}
             </Button>
         )}
      </CardFooter>
    </Card>
  );
};


const InventoryListItem = ({ item, onDelete, onBorrow, onView, isAdmin }: InventoryCardProps) => {
  // Contoh JSX (Sesuaikan dengan UI Anda)
   return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 flex-shrink-0 rounded flex items-center justify-center">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.nama_alat} className="h-full w-full object-cover"/> : <Package className="h-8 w-8 text-gray-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm sm:text-base">{item.nama_alat}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{item.deskripsi || 'No description'}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {item.kategori && <Badge variant="secondary" className="text-xs">{item.kategori.nama_kategori}</Badge>}
              <div className="text-xs text-muted-foreground flex items-center">
                 <MapPin className="h-3 w-3 inline mr-1" />
                 {item.lokasi || 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-0 min-w-[80px] text-xs sm:text-sm">
            <div><span className="font-medium">Qty:</span> {item.jumlah}</div>
            <div><span className="font-medium">Cond:</span> {item.kondisi}</div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Tombol Aksi */}
             {isAdmin ? (
              <>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onView(item)}><Eye className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>{/* TODO: Implement Edit */}
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={onDelete}><Trash2 className="h-4 w-4 text-red-600" /></Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onView(item)}><Eye className="h-4 w-4" /></Button>
                <Button variant="default" size="sm" onClick={() => onBorrow(item)} disabled={item.jumlah <= 0}>
                   {item.jumlah > 0 ? 'Borrow' : 'Out of Stock'}
                 </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default Inventory;