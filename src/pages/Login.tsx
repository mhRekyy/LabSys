// src/pages/Login.tsx (Versi Lengkap Terhubung ke Backend)

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link jika belum ada
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen, LogIn, Beaker, Lock, AtSign, Eye, EyeOff, UserCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Pastikan import RadioGroup

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const Login = () => {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  // Pastikan state role diinisialisasi dengan benar
  const [role, setRole] = useState<"mahasiswa" | "aslab">("mahasiswa");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  // Ambil fungsi login dari AuthContext (asumsi sudah dimodifikasi)
  const { login } = useAuth();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // --- FUNGSI handleLogin YANG SUDAH TERHUBUNG KE BACKEND ---
  const handleLogin = async (e: React.FormEvent) => { // Tambahkan async
    e.preventDefault();
    setIsLoading(true);

    // URL API Login Backend Anda
    // TODO: Ganti dengan Environment Variable (import.meta.env.VITE_API_URL) di proyek nyata
    const apiUrl = "http://127.0.0.1:8000/api/login"; // Sesuaikan port jika perlu

    try {
      // Kirim request POST ke backend
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ npm, password }), // Kirim npm dan password
      });

      const data = await response.json(); // Baca response body

      if (response.ok) { // Jika backend sukses (200 OK)
        // Cek jika user ada di response (penting!)
        if (!data.user) {
           console.error("Data user tidak ditemukan di response backend:", data);
           toast.error("Gagal memproses data login dari server.");
           setIsLoading(false);
           return;
        }

        // Pengecekan Role (Opsional tapi direkomendasikan)
        const backendRoleLower = data.user.role.toLowerCase(); // Role dari backend ('mahasiswa', 'aslab', 'admin')
        const selectedRole = role; // Role dari state UI ('mahasiswa', 'aslab')

        // Hanya izinkan login jika role backend cocok dengan pilihan UI (Mahasiswa atau Aslab)
        if (backendRoleLower !== selectedRole) {
          // Khusus untuk Admin, mungkin tidak ada pilihan di UI, tapi biarkan login jika dia coba
          if (backendRoleLower !== 'admin') {
             toast.error(`Login failed: You logged in as ${data.user.role}, but selected ${selectedRole === 'mahasiswa' ? 'Mahasiswa' : 'Aslab'} role.`);
             setIsLoading(false);
             return;
          }
          // Jika dia admin, biarkan lanjut meskipun tidak memilih role admin
          toast.info(`Logged in as Admin.`); // Beri info jika admin login tanpa memilih role admin
        }
        // Akhir Pengecekan Role

        toast.success(data.message || `Login successful as ${data.user.role}!`);

        // Panggil Context Login dengan data dari Backend
        if (data.user && data.token) {
          login(data.user, data.token); // <= AuthContext.tsx HARUS sudah dimodifikasi!
        } else {
          // Seharusnya tidak terjadi jika response.ok, tapi sebagai fallback
          console.error("Data user atau token tidak ditemukan meskipun response OK:", data);
          toast.error("Gagal memproses data login.");
          setIsLoading(false);
          return;
        }

        navigate("/"); // Arahkan ke dashboard

      } else { // Jika backend gagal (4xx, 5xx)
        toast.error(data.message || "Invalid NPM or password."); // Tampilkan pesan error backend
      }
    } catch (error) { // Tangani error jaringan
      console.error("Login API call failed:", error);
      toast.error("Login failed. Check connection.");
    } finally {
      setIsLoading(false); // Selalu hentikan loading
    }
  };
  // --- AKHIR FUNGSI handleLogin ---

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // --- Bagian JSX (return) TIDAK BERUBAH dari kode Anda sebelumnya ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-300">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Beaker className="h-12 w-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">LabSys</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Laboratory Information System</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your NPM and password to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="npm">NPM (Student ID)</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="npm"
                        placeholder="Enter your NPM"
                        value={npm}
                        onChange={(e) => setNpm(e.target.value)}
                        required
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bagian Pilihan Role */}
                  <div className="space-y-2">
                    <Label>Select Role</Label>
                    <RadioGroup
                      value={role}
                      onValueChange={(value) => setRole(value as "mahasiswa" | "aslab")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-3 rounded-md border p-3 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <RadioGroupItem value="mahasiswa" id="mahasiswa" className="border-slate-300" />
                        <Label htmlFor="mahasiswa" className="flex items-center cursor-pointer">
                          <UserCircle className="h-5 w-5 mr-2 text-blue-500" />
                          Mahasiswa (Student)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-md border p-3 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <RadioGroupItem value="aslab" id="aslab" className="border-slate-300" />
                        <Label htmlFor="aslab" className="flex items-center cursor-pointer">
                          <Users className="h-5 w-5 mr-2 text-purple-500" />
                          Aslab (Lab Assistant)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {/* Akhir Bagian Pilihan Role */}

                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                  <Button
                    type="submit"
                    className="w-full h-12 text-base transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        <LogIn className="mr-2 h-5 w-5" /> Sign In
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col border-t pt-4">
               {/* Link ke Sign Up */}
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed bottom-20 left-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-40 right-40 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );
};

export default Login;