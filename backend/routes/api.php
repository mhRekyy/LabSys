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
use App\Http\Controllers\Api\NotificationController;
// Tambahkan controller lain di sini nanti...

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Rute-rute untuk API aplikasi LabSys.
*/

// === Rute Publik (Tidak Perlu Login) ===
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


// === Rute Terproteksi (Perlu Login via Sanctum) ===
Route::middleware('auth:sanctum')->group(function () {

    // --- Otentikasi & User ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // Tambahkan route update profile/password di sini nanti

    // --- Kategori ---
    Route::get('/kategori', [KategoriController::class, 'index']);
    // Tambahkan route POST, PUT, DELETE kategori di sini nanti jika perlu

    // --- Inventaris ---
    Route::get('/inventaris', [InventarisController::class, 'index']); // Daftar inventaris (sudah dibuat)
    Route::get('/inventaris/{inventaris}', [InventarisController::class, 'show']); // <-- Rute Detail (Baru Ditambahkan)
    Route::post('/inventaris', [InventarisController::class, 'store']);
    Route::put('/inventaris/{inventaris}', [InventarisController::class, 'update']);
    Route::delete('/inventaris/{inventaris}', [InventarisController::class, 'destroy']);

    // --- Peminjaman ---
    Route::get('/peminjaman', [PeminjamanController::class, 'index']);             // Melihat riwayat peminjaman
    Route::post('/peminjaman', [PeminjamanController::class, 'store']);            // Membuat permintaan peminjaman baru
    Route::get('/peminjaman/{peminjaman}', [PeminjamanController::class, 'show']);  // (Opsional) Melihat detail 1 peminjaman
    // Route untuk Admin/Aslab mengupdate status peminjaman (approval, pengembalian, dll.)
    Route::patch('/peminjaman/{peminjaman}/update-status', [PeminjamanController::class, 'updateStatus']);

    // --- Laboratorium ---
    Route::get('/laboratorium', [LaboratoriumController::class, 'index'])->middleware('can:manage-settings');
    Route::get('/laboratorium/{laboratorium}', [LaboratoriumController::class, 'show']);
    Route::patch('/laboratorium/{laboratorium}/status', [LaboratoriumController::class, 'updateStatus'])->middleware('can:manage-settings');
    // Tambahkan route GET, PATCH lab di sini nanti

    // --- Settings ---
    Route::get('/settings', [SettingController::class, 'index'])->middleware('can:manage-settings');
    Route::patch('/settings', [SettingController::class, 'update'])->middleware('can:manage-settings');

    // --- Dashboard ---
    Route::get('/dashboard', [DashboardController::class, 'index']); 
    // Tambahkan route GET dashboard di sini nanti

    // --- Notifikasi ---
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    // Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);

}); // Akhir dari grup middleware auth:sanctum