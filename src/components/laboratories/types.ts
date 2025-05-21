// src/components/laboratories/types.ts

export interface Laboratorium {
  id: number;
  nama_lab: string;
  lokasi_gedung: string;
  lokasi_ruang: string;
  jam_buka: string | null;
  jam_tutup: string | null;
  kapasitas: number;
  status: 'Open' | 'Closed';
  deskripsi_singkat: string | null;
  fasilitas_utama: string | null;
  created_at: string;
  updated_at: string;
  type_lab?: string; // Opsional, tergantung backend Anda
}

// Filter yang dikirim ke API Backend
export interface BackendLaboratoriumFilters {
  search: string;
  status: '' | 'Open' | 'Closed';
  // page?: number; // Jika Anda implementasi pagination
  // per_page?: number; // Jika Anda implementasi pagination
}

// Filter yang diterapkan di Frontend (jika Anda masih menggunakan pendekatan hibrida)
export interface FrontendLaboratoriumFilters {
  building: string;
  floor: string;
  typeDropdown: string;
  selectedTypeCheckboxes: { [key: string]: boolean };
}

// Untuk opsi filter dinamis di UI
export interface LabFilterOptions {
  buildings: string[];
  floors: string[];
  types: string[];
}

// --- TAMBAHKAN DEFINISI INI ---
// Tipe untuk respons API GET /api/laboratorium/{id} (Detail satu lab)
// Asumsi backend membungkus objek Laboratorium dalam field 'data'
// dan mungkin ada field 'success' dan 'message' juga.
export interface ApiLaboratoriumDetailResponse {
  data: Laboratorium;
  success?: boolean; // Opsional, tergantung konsistensi API Anda
  message?: string;  // Opsional
}
// --- AKHIR TAMBAHAN ---


// Opsional: Tipe untuk respons API GET /api/laboratorium (List lab)
// Jika backend Anda membungkus array dalam 'data' dan menyertakan info pagination
// export interface PaginatedLabResponse {
//   data: Laboratorium[];
//   current_page: number;
//   last_page: number;
//   total: number;
//   per_page: number;
//   // ... field pagination lainnya
// }
// export interface ApiLaboratoriumListResponse extends PaginatedLabResponse {
//   success?: boolean;
//   message?: string;
// }


// Tipe untuk data form tambah lab (jika Anda implementasi fitur ini)
export interface AddLaboratoriumFormData {
  nama_lab: string;
  lokasi_gedung: string;
  lokasi_ruang: string;
  jam_buka?: string | null;
  jam_tutup?: string | null;
  kapasitas?: number | null;
  status: 'Open' | 'Closed';
  deskripsi_singkat?: string | null;
  fasilitas_utama?: string | null;
  type_lab?: string | null;
}