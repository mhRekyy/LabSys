// src/types/settings.ts

// Definisikan field settings yang Anda miliki di UI dan backend.
// Nama field di sini HARUS SESUAI dengan KEY yang dikirim/diterima dari backend.
// Tipe data juga harus sesuai dengan apa yang DIKIRIM OLEH SettingController@index SETELAH CASTING.
export interface AppSettings {
  // Dari Tab General - Card General Settings
  institution_name?: string | null; // Jika ini key di backend
  contact_email?: string | null;    // Jika ini key di backend
  low_stock_alerts?: boolean;       // Jika ini key di backend (misal: enable_inventory_alerts)
  maintenance_alerts?: boolean;   // Jika ini key di backend (misal: enable_maintenance_reminders)

  // Dari Tab General - Card System Preferences
  default_laboratory_view?: 'grid' | 'list' | string; // Jika ini key di backend
  items_per_page_system?: number; // Jika ini key di backend (misal: items_per_page)
  confirm_delete?: boolean;       // Jika ini key di backend (misal: confirm_before_deleting)
  student_booking_approval?: boolean; // Jika ini key di backend (misal: require_admin_approval)

  // Dari Tab Notifications
  notify_inventory_updates?: boolean;
  notify_low_stock?: boolean; // Mungkin duplikat dengan low_stock_alerts, pilih satu key konsisten
  notify_lab_bookings?: boolean;
  notify_student_reminders?: boolean; // Mungkin dari notify_student_due_reminders

  // Dari Tab User Management
  user_registration_mode?: 'open' | 'approval' | 'closed' | string;
  max_borrowings_per_student?: number;
  auto_suspend_overdue_users?: boolean; // Mungkin dari auto_suspend_overdue
  allow_multiple_lab_bookings?: boolean;

  // Dari Tab Admin Access
  default_admin_role_permission?: 'full' | 'inventory' | 'bookings' | 'readonly' | string;
  require_2fa_admin?: boolean;
  keep_admin_action_logs?: boolean;

  // Dari Tab Laboratory Settings
  lab_booking_window_days?: number;
  lab_max_booking_duration_hours?: number;
  lab_allow_weekend_bookings?: boolean;
  lab_auto_approve_faculty_bookings?: boolean;
  lab_enforce_capacity_limits?: boolean;

  // Field tambahan yang mungkin ada dari controller backend Anda (SettingController@index)
  // yang belum tercakup oleh UI di atas, atau jika nama key di backend berbeda.
  // Contoh dari diskusi sebelumnya:
  nama_aplikasi?: string;
  deskripsi_aplikasi?: string;
  email_kontak_admin?: string; // Mungkin duplikat dengan contact_email
  maks_hari_peminjaman?: number; // Mungkin duplikat dengan max_borrowings_per_student atau field lain
  notifikasi_aktif?: boolean; // Boolean umum, mungkin diwakili oleh switch spesifik

  // Fallback untuk field lain yang mungkin tidak terdefinisi eksplisit
  [key: string]: string | number | boolean | undefined | null;
}

// Tipe untuk respons API GET /api/settings
export interface ApiSettingsResponse {
  success: boolean;
  message?: string;
  data: AppSettings; // Backend mengirim objek AppSettings yang sudah di-cast
}

// Tipe untuk payload API PATCH /api/settings
export type UpdateSettingsPayload = Partial<AppSettings>;

// Tipe untuk respons API PATCH /api/settings
export interface ApiUpdateSettingsResponse {
  success: boolean;
  message: string;
  data?: AppSettings; // Opsional, jika backend mengembalikan data yang diupdate
}