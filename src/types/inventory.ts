// src/types/inventory.ts

export interface KategoriInventaris {
  id: number;
  nama_kategori: string;
}

export interface Inventaris {
  id: number;
  nama_alat: string;
  kategori: KategoriInventaris | null; // Relasi dimuat dengan whenLoaded, jadi bisa null
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | string; // Sesuaikan dengan nilai pasti dari backend atau biarkan string jika bebas
  jumlah: number;
  lokasi: string | null;
  deskripsi: string | null;
  nomor_seri: string | null;
  tanggal_pengadaan: string | null; // Biasanya YYYY-MM-DD dari database, atau ISO jika di-cast
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string

  // Field opsional tambahan yang mungkin ingin Anda tambahkan di masa depan
  // dan perlu ada di InventarisResource.php:
  // harga_perolehan?: number | null;
  // model?: string | null;
  // merk?: string | null;
  // catatan?: string | null;
  // gambar_url?: string | null;
}

// Tipe untuk respons pagination dari Laravel (Generik)
export interface PaginatedResponse<T> {
  data: T[];
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

// Tipe untuk keseluruhan respons API GET /api/inventaris (List)
export interface ApiInventarisListResponse extends PaginatedResponse<Inventaris> {
  success?: boolean; // Opsional, tergantung apakah backend selalu mengirim ini
  message?: string;  // Opsional
}

// Tipe untuk respons API GET /api/inventaris/{id} (Detail)
// Biasanya, resource tunggal akan mengembalikan data di dalam wrapper 'data'
export interface ApiInventarisDetailResponse {
  data: Inventaris;
  success?: boolean;
  message?: string;
}


// Tipe untuk filter di halaman Inventaris
export interface InventoryFilters {
  search: string;
  kategori_id: string | number | ''; // Dari <select>, jadi bisa string atau number jika dikonversi
  lokasi: string; // Jika filter lokasi berdasarkan string
  kondisi: Inventaris['kondisi'] | ''; // Filter berdasarkan kondisi
  page: number;
  per_page: number;
  sort_by: 'nama_alat' | 'created_at' | 'kondisi' | 'lokasi' | 'jumlah'; // Kolom yang bisa disort
  direction: 'asc' | 'desc';
}

// Tipe untuk data form tambah/edit inventaris
// Sesuaikan dengan StoreInventarisRequest & UpdateInventarisRequest di backend
export interface InventarisFormData {
  nama_alat: string;
  kategori_id: string | number; // Akan jadi number saat dikirim ke backend
  kondisi: Inventaris['kondisi'];
  jumlah: number; // Pastikan ini number, bukan string dari input
  lokasi?: string;
  deskripsi?: string;
  nomor_seri?: string;
  tanggal_pengadaan?: string; // Format YYYY-MM-DD
  // gambar?: File | null; // Untuk upload file jika ada
}

// Tipe DashboardStats (bisa tetap di sini atau pindah ke file terpisah jika preferensi)
export interface DashboardStats {
  totalItems: number;
  totalCategories: number;
  totalLocations: number; // Ini merujuk pada jumlah lokasi unik string, bukan entitas Lokasi terpisah
  recentlyAdded: number;
  lowStock: number;
}