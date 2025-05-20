// src/pages/SignUp.tsx (Versi Lengkap Terhubung ke Backend)

import React, { useState, useEffect } from "react"; // useEffect ditambahkan jika belum ada
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// Icon User sudah ada, tambahkan UserPlus jika belum
import { UserPlus, Beaker, Lock, AtSign, Eye, EyeOff, Mail, User } from "lucide-react";
import { toast } from "sonner";
// Kita tidak perlu useAuth di sini karena registrasi tidak memerlukan login
// import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

// Hapus MOCK_STUDENTS
// const MOCK_STUDENTS = [...];

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

const Signup = () => {
  // State untuk form inputs (sudah ada di kode Anda)
  const [npm, setNpm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State ini bisa dihapus jika tidak ada fungsi dark mode
  const navigate = useNavigate();
  // const { login } = useAuth(); // Tidak perlu login context di sini

  // useEffect untuk dark mode bisa tetap ada jika relevan
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // --- FUNGSI handleSignup YANG BARU ---
  const handleSignup = async (e: React.FormEvent) => { // Tambahkan async
    e.preventDefault();
    setIsLoading(true);

    // Validasi Frontend: Password Confirmation
    if (password !== confirmPassword) {
      toast.error("Password confirmation does not match.");
      setIsLoading(false);
      return;
    }

    // URL API Register Backend
    const apiUrl = "http://127.0.0.1:8000/api/register"; // Pastikan port benar

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        // Kirim data yang dibutuhkan oleh backend
        body: JSON.stringify({
          name: name, // atau cukup name, jika key dan variabel sama
          email: email,
          npm: npm,
          password: password,
          password_confirmation: confirmPassword // Penting untuk validasi backend
        }),
      });

      const data = await response.json();

      if (response.status === 201) { // Jika backend sukses (201 Created)
        toast.success(data.message || "Registration successful! Please log in.");
        navigate('/login'); // Arahkan ke halaman login setelah sukses

      } else if (response.status === 422) { // Jika gagal validasi
        if (data.errors) {
          // Ambil pesan error pertama atau gabungkan semua
          const firstErrorKey = Object.keys(data.errors)[0];
          const firstErrorMessage = data.errors[firstErrorKey][0];
          toast.error(`Registration failed: ${firstErrorMessage}`);
          // Atau gabungkan semua:
          // const errorMessages = Object.values(data.errors).flat().join(' ');
          // toast.error(`Registration failed: ${errorMessages}`);
        } else {
          toast.error(data.message || "Validation failed.");
        }
      } else { // Error lain dari backend (500, dll)
        toast.error(data.message || "Registration failed. Please try again later.");
      }
    } catch (error) { // Error jaringan
      console.error("Signup API call failed:", error);
      toast.error("Registration failed. Check connection.");
    } finally {
      setIsLoading(false);
    }
  };
  // --- AKHIR FUNGSI handleSignup ---

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // --- Bagian JSX (return) TIDAK BERUBAH dari kode Anda ---
  // Pastikan form onSubmit memanggil handleSignup
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-300">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
         {/* ... (Icon Beaker, Judul LabSys) ... */}
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
             {/* ... (Garis gradient, CardHeader) ... */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Register for a new student account to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pastikan form onSubmit={handleSignup} */}
              <form onSubmit={handleSignup}>
                <div className="space-y-4">
                   {/* ... (Input NPM, Name, Email, Password, Confirm Password) ... */}
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
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        placeholder="Create a password"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-12 pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Akhir Input Fields */}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                  {/* ... (Tombol Submit dengan Loading State) ... */}
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
                        Creating Account...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        <UserPlus className="mr-2 h-5 w-5" /> Create Account
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center border-t pt-4">
               {/* Link ke Login */}
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      {/* ... (Divs untuk blob) ... */}
       <div className="fixed top-20 right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed bottom-20 left-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-40 right-40 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );
};

export default Signup;