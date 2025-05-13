<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Untuk proses otentikasi
use App\Models\User;                 // <-- Untuk interaksi dengan model User
use Illuminate\Validation\ValidationException; // <-- Untuk melempar error validasi
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
{
    // 1. Validasi Input (Sesuaikan dengan kebutuhan data registrasi)
    $request->validate([
        'name' => ['required', 'string', 'max:255'],
        // Validasi email: wajib, string, format email, max 255 char, unik di tabel 'users'
        'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
        // Validasi npm: wajib, string, max 255 char, unik di tabel 'users'
        'npm' => ['required', 'string', 'max:255', 'unique:'.User::class],
        // Validasi password: wajib, dikonfirmasi (harus ada field 'password_confirmation'), gunakan aturan default Laravel
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
        // Anda bisa menambahkan validasi untuk 'role' jika user bisa memilih,
        // tapi lebih aman jika default 'Mahasiswa' atau diatur oleh admin.
    ]);

    // 2. Buat User Baru
    try {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'npm' => $request->npm,
            'password' => Hash::make($request->password),
            'role' => 'Mahasiswa', // Default role saat registrasi mandiri
        ]);

        // 3. (Opsional) Buat Token Langsung & Login setelah registrasi
        // $token = $user->createToken('api-token-register')->plainTextToken;

        // 4. Kembalikan Response Sukses
        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil.',
            'user' => $user, // Kirim data user yg baru dibuat
            // 'token' => $token, // Kirim token jika ingin langsung login
            // 'token_type' => 'Bearer',
        ], 201); // Kode status 201 Created

    } catch (\Exception $e) {
        // Tangani jika ada error saat membuat user
        return response()->json([
            'success' => false,
            'message' => 'Registrasi gagal: ' . $e->getMessage(),
        ], 500);
    }
}

    /**
     * Handle user login request.
     */
    public function login(Request $request) // Method yang dipanggil oleh route /api/login
    {
        // 1. Validasi Input dari Request
        // Pastikan request mengirimkan 'npm' dan 'password'
        $request->validate([
            'npm' => 'required|string', // Wajib diisi dan berupa string
            'password' => 'required|string', // Wajib diisi dan berupa string
        ]);

        // 2. Siapkan Kredensial untuk Otentikasi
        // Ambil hanya 'npm' dan 'password' dari request
        $credentials = $request->only('npm', 'password');

        // 3. Coba Lakukan Otentikasi
        // Auth::attempt() akan otomatis:
        // - Mencari user berdasarkan 'npm' (atau field lain yg dikonfigurasi)
        // - Mengambil hash password dari user yg ditemukan
        // - Membandingkan hash tersebut dengan 'password' yg dikirim menggunakan Hash::check()
        if (!Auth::attempt($credentials)) {
            // Jika otentikasi GAGAL (NPM tidak ditemukan atau password salah)
            // Lempar exception validasi agar frontend tahu errornya
            throw ValidationException::withMessages([
                // Pesan error bisa lebih spesifik atau generik
                'npm' => ['NPM atau Password yang Anda masukkan salah.'],
            ]);
        }
    

        // 4. Jika Otentikasi BERHASIL
        $user = Auth::user(); // Dapatkan data user yang berhasil login

        // 5. Buat API Token menggunakan Sanctum
        // 'api-token' adalah nama token (bisa diganti)
        // plainTextToken mengembalikan token dalam bentuk string
        $token = $user->createToken('api-token')->plainTextToken;

        // 6. Kembalikan Response Sukses
        // Kirim response JSON berisi pesan sukses, data user, dan token
        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user, // Hati-hati, pastikan $hidden di Model User menyembunyikan password
            'token' => $token,
            'token_type' => 'Bearer', // Tipe token standar untuk API
        ], 200); // Kode status 200 OK
    }

    /**
     * Handle user logout request.
     * (Kita tambahkan ini sekalian, akan digunakan nanti)
     */
    public function logout(Request $request)
    {
        // Pastikan user terotentikasi sebelum logout
        if (Auth::check()) {
             // Hapus token yang digunakan untuk request saat ini
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logout berhasil'], 200);
        }

        return response()->json(['message' => 'Tidak ada user yang terotentikasi'], 401); // Unauthorized
    }
}