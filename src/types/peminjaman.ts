// src/types/peminjaman.ts

export interface PeminjamanNestedUser {
  id: number;
  name: string;
  npm: string;
  email?: string; // Tambahkan jika UserResource mengirimkannya
  role?: 'Mahasiswa' | 'Admin' | 'Aslab'; // Sesuaikan
}

export interface PeminjamanNestedInventaris {
  id: number;
  nama_alat: string;
  kode_barang?: string;
  lokasi?: string; // Tambahkan jika InventarisResource mengirimkannya
  kategori?: { id: number; nama_kategori: string };
}

export interface Peminjaman {
  id: number;
  user_peminjam: PeminjamanNestedUser | null;
  inventaris: PeminjamanNestedInventaris | null;
  tanggal_pinjam: string | null;
  tanggal_kembali_rencana: string | null;
  tanggal_kembali_aktual: string | null;
  jumlah_pinjam: number;
  status: 'Menunggu Persetujuan' | 'Dipinjam' | 'Dikembalikan' | 'Ditolak' | 'Terlambat' | 'Dibatalkan'; // Pastikan PERSIS sama dengan backend
  tujuan_peminjaman: string | null;
  catatan_pengembalian: string | null;
  petugas_pemroses: PeminjamanNestedUser | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedPeminjamanResponse {
  data: Peminjaman[];
  current_page: number;
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface ApiPeminjamanListResponse extends PaginatedPeminjamanResponse {
    success: boolean;
    message: string;
}

export interface BorrowingHistoryFilters {
  search: string;
  status: Peminjaman['status'] | '';
  page: number;
  per_page: number;
  sort_by: 'tanggal_pinjam' | 'status';
  direction: 'asc' | 'desc';
}