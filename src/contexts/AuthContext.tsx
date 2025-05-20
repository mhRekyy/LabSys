// src/contexts/AuthContext.tsx (REVISI LENGKAP - Mengadaptasi Struktur Anda)

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";

// 1. Definisikan tipe data User dari Backend (Lebih Lengkap)
// Sesuaikan properti ini dengan data yang dikirim oleh /api/login dan /api/user
interface UserType {
  id: number;
  name: string;
  email: string;
  npm: string;
  role: 'Admin' | 'Aslab' | 'Mahasiswa'; // Sesuaikan dengan role di backend
  // Tambahkan properti lain jika ada
  created_at?: string;
  updated_at?: string;
}

// 2. Definisikan tipe data Context yang baru
interface AuthContextType {
  isAuthenticated: boolean; // Ganti isLoggedIn
  user: UserType | null;     // Simpan objek User lengkap
  token: string | null;      // Simpan token API
  login: (userData: UserType, apiToken: string) => void; // Ubah parameter login
  logout: () => void;
  isAdmin: boolean;          // Flag isAdmin (Aslab atau Admin?)
  isStudent: boolean;        // Flag isStudent
  isAslab: boolean;          // Tambahkan flag isAslab jika perlu
  isLoading: boolean;        // Untuk cek token awal
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 3. State yang Diperlukan
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(() => {
      // Ambil token dari localStorage saat inisialisasi awal
      return localStorage.getItem("authToken");
  });
  const [isLoading, setIsLoading] = useState<boolean>(true); // Mulai loading

  // --- Hitung flag role berdasarkan state 'user' ---
  const isAdmin = user?.role === 'Admin';
  const isAslab = user?.role === 'Aslab';
  const isStudent = user?.role === 'Mahasiswa';
  // Atau jika Aslab dianggap Admin untuk UI: const isAdminUI = user?.role === 'Admin' || user?.role === 'Aslab';


  // 4. Fungsi untuk fetch user data menggunakan token (Validasi token saat load)
  const fetchUserWithToken = useCallback(async (currentToken: string) => {
    setIsLoading(true); // Mulai loading saat fetch
    const userApiUrl = "http://127.0.0.1:8000/api/user"; // Endpoint backend

    try {
      const response = await fetch(userApiUrl, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        const userData: UserType = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        setToken(currentToken); // Pastikan state token juga di-set
        console.log("AuthProvider: Token valid, user data loaded.");
      } else {
        console.error("AuthProvider: Token invalid/expired. Status:", response.status);
        // Jika token tidak valid, bersihkan semuanya
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("AuthProvider: Failed to fetch user:", error);
       localStorage.removeItem("authToken");
       setIsAuthenticated(false);
       setUser(null);
       setToken(null);
    } finally {
      setIsLoading(false); // Selesai loading
    }
  }, []);

  // 5. useEffect untuk cek token saat aplikasi load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      console.log("AuthProvider: Token found, validating...");
      fetchUserWithToken(storedToken);
    } else {
      setIsLoading(false); // Tidak ada token, selesai loading
      console.log("AuthProvider: No token found.");
    }
  }, [fetchUserWithToken]); // Dependency array memastikan ini jalan sekali

  // 6. Fungsi Login Baru (Menerima User & Token dari Backend)
  const login = (userData: UserType, apiToken: string) => {
    localStorage.setItem("authToken", apiToken); // Simpan token
    setUser(userData);                       // Simpan data user
    setToken(apiToken);                      // Simpan token di state
    setIsAuthenticated(true);                // Set status login
    setIsLoading(false);                     // Pastikan loading selesai
    console.log("AuthProvider: User logged in.", userData, apiToken);
  };

  // 7. Fungsi Logout Baru
  const logout = async () => {
    const currentToken = localStorage.getItem("authToken"); // Ambil token sebelum dihapus

    // Hapus data lokal dulu agar UI cepat update
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    console.log("AuthProvider: User logged out, local data cleared.");

    // Panggil API Logout di backend (best practice)
    if (currentToken) {
      const logoutApiUrl = "http://127.0.0.1:8000/api/logout";
      try {
        await fetch(logoutApiUrl, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${currentToken}`,
          },
        });
        console.log("AuthProvider: Server logout successful.");
      } catch (error) {
        console.error("AuthProvider: Server logout failed:", error);
      }
    }
     // Navigasi bisa dilakukan di komponen yang memanggil logout
  };

  // Tampilkan loading indicator saat mengecek token awal
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading Authentication...</div>; // Atau komponen loading
  }

  // 8. Sediakan nilai context yang sudah diperbarui
  return (
    <AuthContext.Provider value={{
      isAuthenticated, // Ganti dari isLoggedIn
      user,            // Objek user lengkap
      token,           // Token API
      login,           // Fungsi login baru
      logout,          // Fungsi logout baru
      isAdmin,         // Flag Admin (berdasarkan user.role)
      isStudent,       // Flag Mahasiswa (berdasarkan user.role)
      isAslab,         // Flag Aslab (berdasarkan user.role)
      isLoading        // Status loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook useAuth (Mungkin perlu update untuk konsistensi nama)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // Mengembalikan semua nilai dari AuthContextType
};

// RequireAuth (Menggunakan isAuthenticated dan isLoading)
export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Gunakan nilai baru
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Checking Authentication...</div>; // Tampilkan loading
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// RequireAdmin (Perlu cek role Admin ATAU Aslab?)
// Sesuaikan logika ini berdasarkan siapa yang dianggap "Admin" di UI
export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, isAslab, isLoading } = useAuth(); // Ambil flag role
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Checking Authentication...</div>; // Tampilkan loading
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- Logika Izin Admin/Aslab ---
  if (!(isAdmin || isAslab)) { 
    console.warn("RequireAdmin: Access denied. User is not Admin or Aslab.");
    // Arahkan ke dashboard default jika bukan Admin/Aslab
    return <Navigate to="/" replace />; // Arahkan ke halaman utama (misal dashboard mahasiswa)
  }
  // --- Akhir Logika Izin ---

  return <>{children}</>;
};