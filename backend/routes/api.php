<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\InventarisController;
use App\Http\Controllers\Api\PeminjamanController;
use App\Http\Controllers\Api\LaboratoriumController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\NotificationController; // Jika Anda sudah membuatnya

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// === Rute Publik (Tidak Perlu Login) ===
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


// === Rute Terproteksi (Perlu Login via Sanctum) ===
Route::middleware('auth:sanctum')->group(function () {

    // --- Otentikasi & User ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        // Mengembalikan user yang terautentikasi dengan resource jika Anda punya UserResource
        // return new \App\Http\Resources\UserResource($request->user());
        // Atau langsung objek user:
        return $request->user();
    });

    // --- Kategori ---
    // Semua user terautentikasi boleh lihat kategori
    Route::get('/kategori', [KategoriController::class, 'index']);
    // Jika ada CRUD Kategori, proteksi dengan Gate yang sesuai (misal 'manage-inventaris' atau 'manage-kategori')
    // Route::post('/kategori', [KategoriController::class, 'store'])->middleware('can:manage-inventaris');
    // Route::put('/kategori/{kategori}', [KategoriController::class, 'update'])->middleware('can:manage-inventaris');
    // Route::delete('/kategori/{kategori}', [KategoriController::class, 'destroy'])->middleware('can:manage-inventaris');

    // --- Inventaris ---
    // Semua user terautentikasi boleh lihat daftar dan detail inventaris
    Route::get('/inventaris', [InventarisController::class, 'index']);
    Route::get('/inventaris/{inventaris}', [InventarisController::class, 'show']);
    // Hanya Admin/Aslab yang boleh Tambah, Update, Hapus inventaris
    Route::post('/inventaris', [InventarisController::class, 'store'])->middleware('can:manage-inventaris');
    Route::put('/inventaris/{inventaris}', [InventarisController::class, 'update'])->middleware('can:manage-inventaris');
    // Untuk PUT, kadang method spoofing POST dengan _method='PUT' dipakai jika frontend form tidak support PUT langsung
    // Route::post('/inventaris/{inventaris}', [InventarisController::class, 'update'])->middleware('can:manage-inventaris'); // Jika pakai _method
    Route::delete('/inventaris/{inventaris}', [InventarisController::class, 'destroy'])->middleware('can:manage-inventaris');

    // --- Peminjaman ---
    // Semua user terautentikasi boleh lihat riwayat peminjamannya (controller sudah handle filter by role)
    Route::get('/peminjaman', [PeminjamanController::class, 'index']);
    // Mahasiswa boleh membuat permintaan peminjaman baru
    Route::post('/peminjaman', [PeminjamanController::class, 'store']);
    // Semua user terautentikasi boleh lihat detail peminjamannya (controller akan handle otorisasi)
    Route::get('/peminjaman/{peminjaman}', [PeminjamanController::class, 'show']);
    // Hanya Admin/Aslab yang boleh update status peminjaman
    Route::patch('/peminjaman/{peminjaman}/update-status', [PeminjamanController::class, 'updateStatus'])->middleware('can:manage-inventaris');

    // --- Laboratorium ---
    // Semua user terautentikasi boleh lihat daftar dan detail laboratorium
    Route::get('/laboratorium', [LaboratoriumController::class, 'index']);
    Route::get('/laboratorium/{laboratorium}', [LaboratoriumController::class, 'show']);
    // Hanya Admin/Aslab yang boleh mengubah status laboratorium
    // Ganti 'manage-settings' dengan 'manage-inventaris' jika Aslab juga boleh,
    // atau buat Gate baru 'manage-laboratorium' untuk Admin & Aslab.
    Route::patch('/laboratorium/{laboratorium}/status', [LaboratoriumController::class, 'updateStatus'])->middleware('can:manage-inventaris'); // Menggunakan 'manage-inventaris' untuk Admin & Aslab

    // Rute untuk Tambah Entitas Laboratorium Baru (jika diimplementasikan)
    // Route::post('/laboratorium', [LaboratoriumController::class, 'store'])->middleware('can:manage-inventaris'); // Atau Gate khusus


    // --- Settings ---
    // Hanya Admin yang boleh akses settings
    Route::get('/settings', [SettingController::class, 'index'])->middleware('can:manage-settings');
    Route::patch('/settings', [SettingController::class, 'update'])->middleware('can:manage-settings');

    // --- Dashboard ---
    // Semua user terautentikasi boleh akses dashboard (controller akan handle data per role)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // --- Notifikasi (Jika Ada) ---
    // Route::get('/notifications', [NotificationController::class, 'index']);
    // Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);

}); // Akhir dari grup middleware auth:sanctum