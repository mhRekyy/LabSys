// src/pages/BorrowingHistory.tsx (Versi Lengkap Terhubung Backend)

import React, { useState, useEffect, useCallback } from 'react'; // Import hook
import { Link } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Package, Search, Filter, MoreVertical, ArrowUpDown, Calendar, Eye, ChevronLeft, ChevronRight,History } from "lucide-react"; // Tambahkan ikon jika perlu
import { format, formatDistanceToNow, parseISO } from "date-fns"; // Import date-fns
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ViewItemDialog from "@/components/inventory/ViewItemDialog"; // Import dialog view


// --- Definisikan Tipe Data dari API Backend (Idealnya impor dari src/types) ---
interface KategoriType { id: number; nama_kategori: string; }
interface InventarisType { id: number; nama_alat: string; kategori: KategoriType | null; kondisi: string; jumlah: number; lokasi?: string | null; deskripsi?: string | null; nomor_seri?: string | null; tanggal_pengadaan?: string | null; created_at: string; updated_at: string; imageUrl?: string; }
interface UserType { id: number; name: string; npm: string; email?: string; role?: string; }

// Tipe Data untuk Record Peminjaman dari API /api/peminjaman
interface PeminjamanType {
  id: number; // ID Peminjaman
  user_peminjam: UserType | null; // Objek user peminjam
  inventaris: InventarisType | null; // Objek inventaris yang dipinjam
  tanggal_pinjam: string;
  tanggal_kembali_rencana: string | null;
  tanggal_kembali_aktual: string | null;
  jumlah_pinjam: number;
  status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat' | 'Menunggu Persetujuan' | 'Ditolak'; // Sesuaikan dengan backend
  tujuan_peminjaman: string | null;
  catatan_pengembalian: string | null;
  petugas_pemroses: UserType | null; // Objek user petugas
  created_at: string;
  updated_at: string;
}
// --- Akhir Definisi Tipe Data ---


const BorrowingHistory = () => {
  // --- State ---
  const [borrowingHistoryData, setBorrowingHistoryData] = useState<PeminjamanType[]>([]); // Gunakan tipe PeminjamanType
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State filter & pagination (sama seperti Inventory)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Filter status (kosong = semua)
  const [sortBy, setSortBy] = useState('tanggal_pinjam'); // Default sort
  const [sortDirection, setSortDirection] = useState('desc'); // Default direction (terbaru dulu)

  // State untuk dialog View Item
  const [showViewItemDialog, setShowViewItemDialog] = useState(false);
  const [selectedItemForView, setSelectedItemForView] = useState<InventarisType | null>(null); // Gunakan InventarisType

  // Ambil data dari AuthContext
  const { token, user, isAdmin, isAslab } = useAuth(); // Ambil 'user' lengkap, bukan 'studentNpm'
  const canManage = isAdmin || isAslab; // Flag Admin/Aslab

  // --- Fungsi Fetch Riwayat Peminjaman ---
  const fetchBorrowingHistory = useCallback(async (page = 1) => {
    if (!token) return;
    setIsLoading(true); setError(null);

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());
    if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
    if (statusFilter) params.append('status', statusFilter);
    params.append('sort_by', sortBy);
    params.append('direction', sortDirection);

    const apiUrl = `http://127.0.0.1:8000/api/peminjaman?${params.toString()}`;

    try {
      const response = await fetch(apiUrl, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }});
      if (!response.ok) { const errorData = await response.json().catch(() => ({})); throw new Error(errorData.message || `HTTP error! status: ${response.status}`); }
      const data = await response.json();
      if (data.success) {
        setBorrowingHistoryData(data.data);
        if (data.meta) { setCurrentPage(data.meta.current_page); setTotalPages(data.meta.last_page); setPerPage(data.meta.per_page); setTotalItems(data.meta.total); }
        else { setBorrowingHistoryData(data.data); setCurrentPage(1); setTotalPages(1); setTotalItems(data.data.length); }
      } else { throw new Error(data.message || 'Failed to fetch borrowing history'); }
    } catch (err: any) { console.error("Error fetching borrowing history:", err); setError(err.message || 'Failed to load history.'); setBorrowingHistoryData([]); }
    finally { setIsLoading(false); }
  }, [token, perPage, debouncedSearchTerm, statusFilter, sortBy, sortDirection]);

  // --- useEffect untuk Load Awal ---
  useEffect(() => {
    if (token) { fetchBorrowingHistory(1); }
    else { setIsLoading(false); setBorrowingHistoryData([]); }
  }, [token, fetchBorrowingHistory]);

   // --- useEffect untuk Debounce Search Term ---
   useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearchTerm(searchTerm); }, 500);
    return () => { clearTimeout(handler); };
  }, [searchTerm]);

  // --- useEffect untuk Fetch Ulang saat Filter/Sort/Debounce Berubah ---
  useEffect(() => {
    if (token && !isLoading) { fetchBorrowingHistory(1); }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, statusFilter, sortBy, sortDirection, perPage, token]);


  // --- Handler Aksi (Mark Returned) ---
  const handleReturn = async (recordId: number) => { // ID Peminjaman adalah number
    if (!canManage || !token) { toast.error("Unauthorized"); return; }
    if (!window.confirm("Mark this item as returned?")) return;

    setIsLoading(true); // Atau loading spesifik
    const apiUrl = `http://127.0.0.1:8000/api/peminjaman/${recordId}/update-status`;
    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Dikembalikan' }) // Kirim status baru
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Item marked as returned");
        fetchBorrowingHistory(currentPage); // Refresh data
      } else {
        throw new Error(data.message || "Failed to mark item as returned.");
      }
    } catch (err: any) {
      console.error("Error returning item:", err);
      toast.error(err.message || "Could not mark item as returned.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handler untuk View Item Detail ---
  const handleViewItem = (record: PeminjamanType) => {
    if (record.inventaris) { // Cek jika data inventaris ada di record
      setSelectedItemForView(record.inventaris); // Gunakan data inventaris dari record
      setShowViewItemDialog(true);
    } else {
      toast.error("Item details not available for this record.");
      // Opsional: Fetch detail item terpisah jika diperlukan
      // fetchItemDetails(record.inventaris_id); // Fungsi fetch terpisah
    }
  };

  // --- Handler Pagination ---
   const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          fetchBorrowingHistory(newPage); // Fetch halaman baru
      }
  };


  // Fungsi helper format tanggal
   const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString); //.split(' ')[0]); // Hapus split jika format ISO
      return format(date, "PPpp"); // Format: Jan 1, 2023, 1:23:45 PM
    } catch (e) { return dateString; }
  };

   const formatRelativeDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) { return dateString; }
   };

  // Fungsi untuk badge status
    const getStatusBadgeVariant = (status: PeminjamanType['status']): "default" | "outline" | "secondary" | "destructive" => {
        switch (status) {
            case 'Dipinjam': return 'default'; // Biru/Primary
            case 'Menunggu Persetujuan': return 'secondary'; // Abu-abu
            case 'Dikembalikan': return 'outline'; // Outline/Hijau?
            case 'Terlambat': return 'destructive'; // Merah
            case 'Ditolak': return 'destructive'; // Merah
            default: return 'secondary';
        }
    };


  // --- JSX ---
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">Borrowing History</h1><p className="text-muted-foreground mt-1">{isAdmin ? "Track all borrowings." : "Your borrowed items."}</p></div>
        <div><Button asChild><Link to="/inventory"><Package className="mr-2 h-4 w-4" />Inventory</Link></Button></div>
      </div>

      {/* Card Konten */}
      <Card>
        <CardHeader>
          {/* Header Card dengan Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div><CardTitle>{isAdmin ? "All Borrowings" : "Your Borrowings"}</CardTitle><CardDescription>{totalItems} records found</CardDescription></div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-[240px]"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="search" placeholder="Search name/item..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
              {/* Filter Status */}
              <div className="w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value === 'all-status' ? '' : value)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="All Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="Menunggu Persetujuan">Pending Approval</SelectItem>
                    <SelectItem value="Dipinjam">Borrowed</SelectItem>
                    <SelectItem value="Dikembalikan">Returned</SelectItem>
                    <SelectItem value="Terlambat">Overdue</SelectItem>
                    <SelectItem value="Ditolak">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
           {isLoading && <div className="text-center p-10">Loading history...</div>}
          {/* Error State */}
           {error && !isLoading && <div className="text-center p-10 text-red-500">{error}</div>}

           {/* Tabel Riwayat */}
           {!isLoading && !error && borrowingHistoryData.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Item</TableHead>
                    {/* Tampilkan kolom Borrower hanya untuk Admin/Aslab */}
                    {canManage && <TableHead>Borrower</TableHead>}
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    {/* Tombol Sort Tanggal */}
                    <TableHead><button className="flex items-center space-x-1 hover:text-primary" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}><span title={`Sort by Borrow Date (${sortDirection === 'asc' ? 'Oldest' : 'Newest'})`}>Date Borrowed</span><ArrowUpDown className="h-3 w-3" /></button></TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Qty</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowingHistoryData.map((record) => (
                    <TableRow key={record.id}>
                      {/* Item Cell */}
                      <TableCell><div className="flex items-center space-x-2"><div className="h-9 w-9 rounded bg-muted flex items-center justify-center"><Package className="h-5 w-5 text-muted-foreground" /></div><div><div className="font-medium">{record.inventaris?.nama_alat || 'Item Deleted'}</div><div className="text-xs text-muted-foreground">{record.inventaris?.lokasi || 'N/A'}</div></div></div></TableCell>
                      {/* Borrower Cell (Admin/Aslab Only) */}
                      {canManage && (<TableCell><div className="font-medium">{record.user_peminjam?.name || 'N/A'}</div><div className="text-xs text-muted-foreground">NPM: {record.user_peminjam?.npm || 'N/A'}</div></TableCell>)}
                       {/* Category Cell */}
                      <TableCell className="hidden md:table-cell"><Badge variant="secondary">{record.inventaris?.kategori?.nama_kategori || 'N/A'}</Badge></TableCell>
                       {/* Date Cell */}
                      <TableCell><div className="flex items-center" title={formatDate(record.tanggal_pinjam)}><Calendar className="h-3 w-3 mr-1 text-muted-foreground" /><span>{formatRelativeDate(record.tanggal_pinjam)}</span></div>{record.tanggal_kembali_aktual && (<div className="text-xs text-muted-foreground mt-1" title={formatDate(record.tanggal_kembali_aktual)}>Returned {formatRelativeDate(record.tanggal_kembali_aktual)}</div>)}</TableCell>
                       {/* Status Cell */}
                      <TableCell><Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge></TableCell>
                       {/* Quantity Cell */}
                      <TableCell className="hidden md:table-cell text-center">{record.jumlah_pinjam}</TableCell>
                       {/* Actions Cell */}
                      <TableCell className="text-right"><div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewItem(record)} className="h-8 w-8 p-0"><Eye className="h-4 w-4" /><span className="sr-only">View Item</span></Button>
                          {/* Tombol Aksi Admin/Aslab */}
                          {canManage && record.status === "Dipinjam" && (
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild><Button variant="outline" className="h-8 w-8 p-0" size="sm"><MoreVertical className="h-4 w-4" /><span className="sr-only">Actions</span></Button></DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleReturn(record.id)}>Mark as returned</DropdownMenuItem>
                                      {/* Tambah aksi lain? Approve/Reject? */}
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          )}
                          {/* Jika status Menunggu Persetujuan */}
                          {canManage && record.status === "Menunggu Persetujuan" && (
                             <DropdownMenu>
                                  <DropdownMenuTrigger asChild><Button variant="outline" className="h-8 w-8 p-0" size="sm"><MoreVertical className="h-4 w-4" /><span className="sr-only">Actions</span></Button></DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => {/* Panggil PATCH dengan status Dipinjam */}}>Approve</DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {/* Panggil PATCH dengan status Ditolak */}} className="text-red-500">Reject</DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          )}
                      </div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pesan Jika Tidak Ada Data */}
          {!isLoading && !error && borrowingHistoryData.length === 0 && (
            <div className="h-60 flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
                <History className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No borrowing records found</h3>
                <p className="text-sm text-muted-foreground mt-1">{searchTerm || statusFilter ? "Try adjusting filter." : isAdmin ? "No items borrowed yet." : "You haven't borrowed items."}</p>
                <Button asChild className="mt-4"><Link to="/inventory">Browse Inventory</Link></Button>
            </div>
          )}
        </CardContent>
         {/* --- Komponen Pagination --- */}
         {!isLoading && !error && totalPages > 1 && (
              <CardFooter className="flex justify-center items-center space-x-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1" />Prev</Button>
                  <span className="text-sm text-muted-foreground">Page {currentPage}/{totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
              </CardFooter>
          )}
      </Card>

      {/* --- Dialog View Item --- */}
      <ViewItemDialog
        open={showViewItemDialog}
        onOpenChange={setShowViewItemDialog}
        item={selectedItemForView} // Kirim state yang benar
        // Jangan kirim onBorrow ke ViewItemDialog dari halaman history
        // onBorrow={...}
        canManage={false} // Mahasiswa tidak bisa manage dari sini
        // onDeleteItem={...} // Mungkin tidak perlu delete dari sini
      />
    </div>
  );
};

export default BorrowingHistory;