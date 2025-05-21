// src/lib/axiosInstance.ts
import axios from 'axios';

// 1. Ambil base URL API dari environment variable (.env) Anda.
//    Ini adalah cara terbaik untuk mengelola konfigurasi.
//    Di file .env Anda (di root proyek), tambahkan baris:
//    VITE_API_URL=http://localhost:8000  (Ganti dengan URL backend Anda jika berbeda)

const API_BASE_URL = import.meta.env.VITE_API_URL;

// 2. Jika VITE_API_URL tidak diset, gunakan URL default.
//    Ini berguna untuk pengembangan jika .env lupa diset, tapi sebaiknya VITE_API_URL selalu ada.
const DEFAULT_API_URL = 'http://localhost:8000'; // Ganti port jika backend Anda berbeda

const effectiveApiUrl = API_BASE_URL || DEFAULT_API_URL;

if (!API_BASE_URL) {
  console.warn(
    `VITE_API_URL tidak diset di file .env. Menggunakan URL default: ${DEFAULT_API_URL}. ` +
    `Sangat disarankan untuk mengatur VITE_API_URL.`
  );
}

// 3. Buat instance Axios yang dikonfigurasi
const axiosInstance = axios.create({
  baseURL: effectiveApiUrl, // URL dasar untuk semua panggilan API
  headers: {
    'Content-Type': 'application/json', // Default tipe konten yang dikirim
    'Accept': 'application/json',       // Tipe respons yang diharapkan dari API
  },
  // timeout: 10000, // Opsional: Batas waktu request dalam milidetik (misalnya 10 detik)
  // withCredentials: true, // Uncomment jika Anda menggunakan cookies untuk session (untuk Sanctum API token, ini biasanya tidak diperlukan)
});

/*
// OPSIONAL: Request Interceptor
// Interceptor ini akan dijalankan SEBELUM setiap request dikirim.
// Berguna untuk menambahkan token otorisasi secara otomatis.

axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari mana pun Anda menyimpannya (misalnya localStorage atau context)
    // Contoh jika token disimpan di localStorage dengan nama 'authToken'
    const token = localStorage.getItem('authToken'); // GANTI INI sesuai cara Anda menyimpan token

    if (token) {
      // Jika token ada, tambahkan ke header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Kembalikan konfigurasi yang sudah dimodifikasi (atau yang asli jika tidak ada token)
  },
  (error) => {
    // Lakukan sesuatu dengan error request
    return Promise.reject(error);
  }
);
*/

/*
// OPSIONAL: Response Interceptor
// Interceptor ini akan dijalankan SETELAH setiap response diterima dari API.
// Berguna untuk menangani error global, seperti 401 Unauthorized.

axiosInstance.interceptors.response.use(
  (response) => {
    // Setiap status code yang berada dalam rentang 2xx akan memicu fungsi ini
    // Lakukan sesuatu dengan data response
    return response;
  },
  (error) => {
    // Setiap status code yang berada di luar rentang 2xx akan memicu fungsi ini
    if (error.response) {
      // Request dibuat dan server merespons dengan status code
      // yang berada di luar rentang 2xx
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
      console.error('API Error Headers:', error.response.headers);

      if (error.response.status === 401) {
        // Contoh: Tangani error Unauthorized (misalnya, token tidak valid atau expired)
        // Anda bisa memanggil fungsi logout dari AuthContext di sini,
        // atau redirect ke halaman login, atau menghapus token dari localStorage.
        console.warn("Unauthorized (401). Anda mungkin perlu login ulang.");
        // localStorage.removeItem('authToken'); // Hapus token
        // window.location.href = '/login'; // Redirect ke login
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response yang diterima
      // `error.request` adalah instance dari XMLHttpRequest di browser
      console.error('API No Response:', error.request);
      toast.error('Tidak ada respons dari server. Periksa koneksi Anda.'); // Contoh notifikasi
    } else {
      // Sesuatu terjadi saat menyiapkan request yang memicu Error
      console.error('API Request Setup Error:', error.message);
      toast.error('Terjadi kesalahan saat menyiapkan permintaan ke server.'); // Contoh notifikasi
    }
    return Promise.reject(error); // Penting untuk meneruskan error agar bisa ditangani di tempat lain jika perlu
  }
);
*/

// 4. Ekspor instance yang sudah dikonfigurasi
export default axiosInstance;