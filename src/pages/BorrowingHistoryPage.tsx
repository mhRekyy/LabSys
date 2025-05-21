// src/pages/BorrowingHistory.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Search, MoreVertical, ArrowUpDown, Calendar, Eye, ChevronLeft, ChevronRight, History, Edit3, CheckCircle, XCircle } from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import axiosInstance from '@/lib/axiosInstance'; // Gunakan axiosInstance
import {
  Peminjaman,
  ApiPeminjamanListResponse,
  BorrowingHistoryFilters,
  PeminjamanNestedInventaris // Impor tipe ini juga jika ViewItemDialog membutuhkannya
} from "@/types/peminjaman"; // Asumsi tipe ada di sini
import ViewItemDialog from "@/components/inventory/ViewItemDialog"; // Sesuaikan path dan pastikan dialog ini menerima PeminjamanNestedInventaris
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'; // Untuk konfirmasi

// Komponen untuk input catatan pengembalian (opsional)
const ReturnNoteDialog: React.FC<{ open: boolean, onOpenChange: (open: boolean) => void, onSubmit: (note: string) => void }> = ({ open, onOpenChange, onSubmit }) => {
    const [note, setNote] = useState("");
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Catatan Pengembalian (Opsional)</AlertDialogTitle></AlertDialogHeader>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-2 border rounded min-h-[80px]" placeholder="Masukkan catatan kondisi barang saat dikembalikan..."></textarea>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setNote(""); onOpenChange(false);}}>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { onSubmit(note); setNote(""); }}>Submit Catatan & Kembalikan</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


const BorrowingHistoryPage: React.FC = () => {
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<BorrowingHistoryFilters>({
    search: "",
    status: "",
    page: 1,
    per_page: 10,
    sort_by: 'tanggal_pinjam',
    direction: 'desc',
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Info pagination dari API
  const [paginationInfo, setPaginationInfo] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  } | null>(null);

  const [showViewItemDialog, setShowViewItemDialog] = useState(false);
  const [selectedItemForView, setSelectedItemForView] = useState<PeminjamanNestedInventaris | null>(null); // Tipe baru

  // State untuk dialog catatan pengembalian
  const [showReturnNoteDialog, setShowReturnNoteDialog] = useState(false);
  const [peminjamanToReturn, setPeminjamanToReturn] = useState<Peminjaman | null>(null);


  const { token, user, isAdmin, isAslab } = useAuth();
  const canManage = isAdmin || isAslab;

  const fetchBorrowingHistory = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('per_page', filters.per_page.toString());
    if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
    if (filters.status) params.append('status', filters.status);
    params.append('sort_by', filters.sort_by);
    params.append('direction', filters.direction);

    try {
      const response = await axiosInstance.get<ApiPeminjamanListResponse>(`/api/peminjaman`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      if (response.data.success) {
        setPeminjamanList(response.data.data);
        setPaginationInfo({
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
          perPage: response.data.per_page,
        });
      } else {
        throw new Error(response.data.message || 'Gagal memuat riwayat peminjaman');
      }
    } catch (err: any) {
      console.error("Error fetching borrowing history:", err);
      setError(err.response?.data?.message || err.message || 'Gagal memuat riwayat.');
      setPeminjamanList([]);
      setPaginationInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, filters, debouncedSearchTerm]); // filters sudah mencakup semua parameter kecuali debouncedSearchTerm

  useEffect(() => {
    fetchBorrowingHistory();
  }, [fetchBorrowingHistory]); // fetchBorrowingHistory sudah di-memoize dan bergantung pada filters & token

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearchTerm(filters.search); }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  // Handler untuk perubahan filter
  const handleFilterChange = <K extends keyof BorrowingHistoryFilters>(key: K, value: BorrowingHistoryFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset ke halaman 1 saat filter berubah
  };

  // Handler untuk Aksi Update Status Peminjaman
  const handleUpdateStatus = async (recordId: number, newStatus: Peminjaman['status'], catatan?: string) => {
    if (!canManage || !token) { toast.error("Aksi tidak diizinkan."); return; }

    // Konfirmasi untuk aksi tertentu
    if (newStatus === 'Ditolak' && !window.confirm("Apakah Anda yakin ingin menolak permintaan ini?")) return;

    setIsLoading(true); // Bisa gunakan loading spesifik per baris
    try {
      const payload: { status: string; catatan_pengembalian?: string } = { status: newStatus };
      if (catatan && (newStatus === 'Dikembalikan' || newStatus === 'Terlambat')) {
        payload.catatan_pengembalian = catatan;
      }

      const response = await axiosInstance.patch(`/api/peminjaman/${recordId}/update-status`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success(response.data.message || "Status peminjaman berhasil diperbarui.");
        fetchBorrowingHistory(); // Refresh data
      } else {
        throw new Error(response.data.message || "Gagal update status.");
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || err.message || "Gagal update status.");
    } finally {
      setIsLoading(false);
      setPeminjamanToReturn(null); // Reset state untuk dialog catatan
      setShowReturnNoteDialog(false);
    }
  };

  const openReturnNoteDialog = (record: Peminjaman) => {
    setPeminjamanToReturn(record);
    setShowReturnNoteDialog(true);
  };


  const handleViewItem = (record: Peminjaman) => {
    if (record.inventaris) {
      // Perlu disesuaikan jika ViewItemDialog mengharapkan tipe InventarisType yang lama
      // Idealnya, ViewItemDialog menerima PeminjamanNestedInventaris atau tipe Inventaris global yang konsisten
      setSelectedItemForView(record.inventaris as PeminjamanNestedInventaris); // Casting jika perlu, pastikan tipe cocok
      setShowViewItemDialog(true);
    } else {
      toast.error("Detail item tidak tersedia.");
    }
  };

  const formatDate = (dateString: string | null | undefined, customFormat: string = "PPpp"): string => {
    if (!dateString) return 'N/A';
    try { return format(parseISO(dateString), customFormat); }
    catch (e) { return dateString; }
  };

  const getStatusBadgeVariant = (status: Peminjaman['status']): "default" | "outline" | "secondary" | "destructive" => {
    switch (status) {
      case 'Dipinjam': return 'default';
      case 'Menunggu Persetujuan': return 'secondary';
      case 'Dikembalikan': return 'outline'; // Mungkin ingin warna hijau?
      case 'Terlambat': case 'Ditolak': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Riwayat Peminjaman</h1>
          <p className="text-muted-foreground mt-1">{canManage ? "Lacak semua peminjaman." : "Barang yang Anda pinjam."}</p>
        </div>
        {!canManage && ( // Tombol untuk Mahasiswa
            <Button asChild variant="outline">
                <Link to="/inventory"><Package className="mr-2 h-4 w-4" />Pinjam Alat Lain</Link>
            </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>{canManage ? "Semua Peminjaman" : "Riwayat Peminjaman Saya"}</CardTitle>
              <CardDescription>{paginationInfo?.totalItems || 0} data ditemukan</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 sm:w-[240px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Cari alat/peminjam..." className="pl-8 w-full" value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
              </div>
              <div className="w-full sm:w-auto">
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value as Peminjaman['status'] | '')}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Status</SelectItem>
                    <SelectItem value="Menunggu Persetujuan">Menunggu Persetujuan</SelectItem>
                    <SelectItem value="Dipinjam">Dipinjam</SelectItem>
                    <SelectItem value="Dikembalikan">Dikembalikan</SelectItem>
                    <SelectItem value="Terlambat">Terlambat</SelectItem>
                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-center p-10 text-muted-foreground animate-pulse">Memuat riwayat...</div>}
          {error && !isLoading && <div className="text-center p-10 text-destructive">{error}</div>}
          {!isLoading && !error && peminjamanList.length > 0 && (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Inventaris</TableHead>
                    {canManage && <TableHead className="min-w-[150px]">Peminjam</TableHead>}
                    <TableHead
                      className="cursor-pointer hover:text-primary min-w-[180px]"
                      onClick={() => handleFilterChange('direction', filters.direction === 'asc' ? 'desc' : 'asc')}
                      title={`Urut berdasarkan Tgl Pinjam (${filters.direction === 'asc' ? 'Terlama' : 'Terbaru'})`}
                    >
                      <div className="flex items-center">Tgl Pinjam <ArrowUpDown className="ml-1 h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="min-w-[150px]">Tgl Kembali Rencana</TableHead>
                    <TableHead className="min-w-[150px]">Tgl Kembali Aktual</TableHead>
                    <TableHead className="text-center min-w-[80px]">Jml</TableHead>
                    <TableHead className="min-w-[150px]">Status</TableHead>
                    <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {peminjamanList.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{record.inventaris?.nama_alat || <span className="italic text-muted-foreground">N/A</span>}</div>
                        <div className="text-xs text-muted-foreground">{record.inventaris?.kode_barang || ""}</div>
                      </TableCell>
                      {canManage && (
                        <TableCell>
                          <div className="font-medium">{record.user_peminjam?.name || <span className="italic text-muted-foreground">N/A</span>}</div>
                          <div className="text-xs text-muted-foreground">NPM: {record.user_peminjam?.npm || "N/A"}</div>
                        </TableCell>
                      )}
                      <TableCell title={formatDate(record.tanggal_pinjam)}>
                        {formatDate(record.tanggal_pinjam, "dd MMM yy, HH:mm")}
                        <div className="text-xs text-muted-foreground">{formatDistanceToNow(parseISO(record.tanggal_pinjam!), { addSuffix: true })}</div>
                      </TableCell>
                      <TableCell title={formatDate(record.tanggal_kembali_rencana)}>
                        {formatDate(record.tanggal_kembali_rencana, "dd MMM yy")}
                      </TableCell>
                      <TableCell title={formatDate(record.tanggal_kembali_aktual)}>
                        {record.tanggal_kembali_aktual ? formatDate(record.tanggal_kembali_aktual, "dd MMM yy, HH:mm") : <span className="italic text-muted-foreground">Belum Kembali</span>}
                      </TableCell>
                      <TableCell className="text-center">{record.jumlah_pinjam}</TableCell>
                      <TableCell><Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewItem(record)} title="Lihat Detail Alat">
                                <Eye className="h-4 w-4" />
                            </Button>
                            {canManage && (
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" title="Aksi Lain">
                                    <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {record.status === 'Menunggu Persetujuan' && (
                                    <>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(record.id, 'Dipinjam')}>
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Setujui
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(record.id, 'Ditolak')} className="text-destructive">
                                        <XCircle className="mr-2 h-4 w-4" /> Tolak
                                        </DropdownMenuItem>
                                    </>
                                    )}
                                    {record.status === 'Dipinjam' && (
                                    <DropdownMenuItem onClick={() => openReturnNoteDialog(record)}>
                                        <Edit3 className="mr-2 h-4 w-4" /> Tandai Dikembalikan
                                    </DropdownMenuItem>
                                    )}
                                    {/* Tambah aksi lain jika perlu, misal 'Batalkan Peminjaman (jika belum dipinjam)' */}
                                </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!isLoading && !error && peminjamanList.length === 0 && (
            <div className="h-60 flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
              <History className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">Tidak Ada Riwayat Peminjaman</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filters.search || filters.status ? "Coba sesuaikan filter Anda." : canManage ? "Belum ada peminjaman yang tercatat." : "Anda belum pernah melakukan peminjaman."}
              </p>
              {!canManage && <Button asChild className="mt-4"><Link to="/inventory">Pinjam Alat Sekarang</Link></Button>}
            </div>
          )}
        </CardContent>
        {paginationInfo && paginationInfo.totalPages > 1 && !isLoading && !error && (
          <CardFooter className="flex justify-center items-center space-x-2 pt-6">
            <Button variant="outline" size="sm" onClick={() => handleFilterChange('page', paginationInfo.currentPage - 1)} disabled={paginationInfo.currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
            </Button>
            <span className="text-sm text-muted-foreground">
              Hal {paginationInfo.currentPage} dari {paginationInfo.totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => handleFilterChange('page', paginationInfo.currentPage + 1)} disabled={paginationInfo.currentPage === paginationInfo.totalPages}>
              Berikutnya <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        )}
      </Card>

      {selectedItemForView && (
        <ViewItemDialog
          open={showViewItemDialog}
          onOpenChange={setShowViewItemDialog}
          item={selectedItemForView as any} // Perlu disesuaikan tipenya di ViewItemDialog
          canManage={false}
        />
      )}
      {peminjamanToReturn && (
        <ReturnNoteDialog
            open={showReturnNoteDialog}
            onOpenChange={setShowReturnNoteDialog}
            onSubmit={(note) => handleUpdateStatus(peminjamanToReturn.id, 'Dikembalikan', note)}
        />
      )}
    </div>
  );
};

export default BorrowingHistoryPage; // Ganti nama komponen jika perlu